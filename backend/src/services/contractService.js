import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const CrowdfundingApp = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, '../contracts/Crowdfundingapp.json'),
        'utf8'
    )
);

class ContractService {
    constructor() {
        // Connect to local testnet
        this.web3 = new Web3('http://127.0.0.1:7545');

        if (!process.env.CONTRACT_ADDRESS) {
            throw new Error('CONTRACT_ADDRESS is not defined');
        }

        // Debug log to check ABI
        console.log('Contract ABI:', CrowdfundingApp.abi);

        // Initialize contract with proper ABI format
        this.contract = new this.web3.eth.Contract(
            CrowdfundingApp.abi, // Use the ABI directly, don't access [0]
            process.env.CONTRACT_ADDRESS
        );

        // Verify contract methods
        console.log('Available contract methods:', this.contract.methods);
    }

    // Helper method to get account
    async getAccount() {
        const accounts = await this.web3.eth.getAccounts();
        return accounts[0]; // Use the first account
    }

    // Create a new campaign
    async createCampaign(campaignData, ngoAddress) {
        try {
            console.log('Creating campaign with data:', campaignData);
            console.log('NGO Address:', ngoAddress);

            const {
                title,
                description,
                goal,
                startDate,
                deadline
            } = campaignData;

            // Validate inputs
            if (!title || !description || !goal || !startDate || !deadline) {
                throw new Error('Missing required campaign fields');
            }

            if (!ngoAddress) {
                throw new Error('NGO address is required');
            }

            // Convert timestamps and add buffer time for start date
            const now = Math.floor(Date.now() / 1000);
            const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
            const endTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

            // Validate timestamps
            if (startTimestamp <= now + 300) { // 5 minutes buffer
                throw new Error('Start date must be at least 5 minutes in the future');
            }

            if (endTimestamp <= startTimestamp) {
                throw new Error('End date must be after start date');
            }

            // Convert goal to Wei
            const goalInWei = this.web3.utils.toWei(goal.toString(), 'ether');

            console.log('Sending transaction with params:', {
                title,
                description,
                goalInWei,
                startTimestamp,
                endTimestamp,
                from: ngoAddress,
                currentTime: now
            });

            try {
                // First estimate gas
                const gasEstimate = await this.contract.methods.createCampaign(
                    title,
                    description,
                    goalInWei,
                    startTimestamp,
                    endTimestamp
                ).estimateGas({ from: ngoAddress });

                console.log('Estimated gas:', gasEstimate);

                // Convert BigInt to number and add buffer
                const gasLimit = Number(gasEstimate) + 50000;

                // Then send transaction with calculated gas
                const tx = await this.contract.methods.createCampaign(
                    title,
                    description,
                    goalInWei,
                    startTimestamp,
                    endTimestamp
                ).send({
                    from: ngoAddress,
                    gas: gasLimit
                });

                console.log('Transaction receipt:', tx);

                if (!tx.events || !tx.events.CampaignCreated) {
                    throw new Error('Campaign creation event not found in transaction');
                }

                const campaignId = tx.events.CampaignCreated.returnValues.campaignId;

                // Get the campaign details from blockchain
                const campaign = await this.contract.methods.campaigns(campaignId).call();

                return {
                    id: campaignId,
                    title,
                    description,
                    goal: goal.toString(),
                    startDate: new Date(startTimestamp * 1000).toISOString(),
                    endDate: new Date(endTimestamp * 1000).toISOString(),
                    ngoAddress,
                    status: 'active',
                    isActive: true,
                    totalRaised: '0',
                    fundsRaised: '0'
                };
            } catch (txError) {
                console.error('Transaction error:', txError);
                throw new Error(`Transaction failed: ${txError.message}`);
            }
        } catch (error) {
            console.error('Detailed error in createCampaign:', error);
            throw new Error(`Failed to create campaign: ${error.message}`);
        }
    }

    // Get all active campaigns
    async getAllCampaigns() {
        try {
            const campaigns = await this.contract.methods.getAllActiveCampaigns().call();

            // Make sure we return an array
            if (!Array.isArray(campaigns)) {
                console.log('Raw campaigns data:', campaigns);
                return [];
            }

            return campaigns.map(campaign => ({
                id: campaign.campaignId,
                title: campaign.campaign.name,
                description: campaign.campaign.description,
                goal: this.web3.utils.fromWei(campaign.campaign.goalAmount, 'ether'),
                totalRaised: this.web3.utils.fromWei(campaign.campaign.fundsRaised, 'ether'),
                startDate: new Date(Number(campaign.campaign.startDate) * 1000).toISOString(),
                deadline: new Date(Number(campaign.campaign.endDate) * 1000).toISOString(),
                status: campaign.campaign.isPaused ? 'paused' : 'active',
                ngoAddress: campaign.campaign.ngoAdmin
            }));
        } catch (error) {
            console.error('Error getting campaigns:', error);
            // Return empty array on error
            return [];
        }
    }

    // Get campaign by ID
    async getCampaignById(campaignId) {
        try {
            console.log('Fetching campaign with ID:', campaignId);

            // First get the campaign struct from mapping
            const campaign = await this.contract.methods.campaigns(campaignId).call();
            console.log('Raw campaign data:', campaign);

            // Check if campaign exists (ngoAdmin will be zero address if not found)
            if (campaign.ngoAdmin === '0x0000000000000000000000000000000000000000') {
                console.log('Campaign not found - zero address');
                return null;
            }

            // Get campaign balance
            const balance = await this.contract.methods.getCampaignBalance(campaignId).call();

            // Get campaign status
            let status = 'active';
            if (campaign.isPaused) {
                status = 'paused';
            } else if (!campaign.isActive) {
                status = 'ended';
            } else {
                const now = Math.floor(Date.now() / 1000);
                if (now < Number(campaign.startDate)) {
                    status = 'pending';
                } else if (now > Number(campaign.endDate)) {
                    status = 'ended';
                }
            }

            // Format the campaign data
            const formattedCampaign = {
                id: campaignId,
                title: campaign.name,
                description: campaign.description,
                goal: this.web3.utils.fromWei(campaign.goalAmount, 'ether'),
                totalRaised: this.web3.utils.fromWei(campaign.fundsRaised, 'ether'),
                balance: this.web3.utils.fromWei(balance, 'ether'),
                startDate: new Date(Number(campaign.startDate) * 1000).toISOString(),
                deadline: new Date(Number(campaign.endDate) * 1000).toISOString(),
                status: status,
                ngoAddress: campaign.ngoAdmin,
                isWithdrawn: campaign.isWithdrawn,
                isActive: campaign.isActive,
                isPaused: campaign.isPaused
            };

            console.log('Formatted campaign data:', formattedCampaign);
            return formattedCampaign;
        } catch (error) {
            console.error('Error getting campaign by ID:', error);
            throw new Error(`Failed to get campaign: ${error.message}`);
        }
    }

    // Donate to a campaign
    async donate(campaignId, amountInWei, donorWallet) {
        try {
            console.log('Donation params:', { campaignId, amountInWei, donorWallet });

            // Get campaign first to verify it exists and is active
            const campaign = await this.contract.methods.campaigns(campaignId).call();
            if (!campaign || !campaign.ngoAdmin) {
                throw new Error('Campaign not found');
            }
            if (!campaign.isActive) {
                throw new Error('Campaign is not active');
            }

            // First estimate gas for the transaction
            const gasEstimate = await this.contract.methods.donate(campaignId)
                .estimateGas({
                    from: donorWallet,
                    value: amountInWei
                });

            console.log('Estimated gas:', gasEstimate);

            // Add buffer to gas estimate
            const gasLimit = Number(gasEstimate) + 50000;

            // Send transaction
            const tx = await this.contract.methods.donate(campaignId)
                .send({
                    from: donorWallet,
                    value: amountInWei,
                    gas: gasLimit
                });

            console.log('Transaction receipt:', tx);

            if (!tx.events || !tx.events.DonationReceived) {
                throw new Error('Donation event not found in transaction');
            }

            // Get updated campaign balance
            const updatedBalance = await this.contract.methods.getCampaignBalance(campaignId).call();
            console.log('Updated campaign balance:', updatedBalance);

            const event = tx.events.DonationReceived.returnValues;
            return {
                campaignId: event.campaignId,
                donor: event.donor,
                amount: this.web3.utils.fromWei(event.amount, 'ether'),
                transactionHash: tx.transactionHash,
                totalRaised: this.web3.utils.fromWei(updatedBalance, 'ether'),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error making donation:', error);
            throw new Error(`Failed to make donation: ${error.message}`);
        }
    }

    // Update campaign
    async updateCampaign(campaignId, campaignData, ngoAddress) {
        try {
            const {
                goal,
                startDate,
                deadline
            } = campaignData;

            const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
            const endTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

            await this.contract.methods.updateCampaign(
                campaignId,
                this.web3.utils.toWei(goal.toString(), 'ether'),
                startTimestamp,
                endTimestamp
            ).send({ from: ngoAddress });

            return await this.getCampaignById(campaignId);
        } catch (error) {
            console.error('Error updating campaign:', error);
            throw error;
        }
    }

    // Withdraw funds
    async withdrawFunds(campaignId, ngoAddress) {
        try {
            const tx = await this.contract.methods.withdrawFunds(campaignId)
                .send({
                    from: ngoAddress,
                    gas: 300000
                });

            return {
                transactionHash: tx.transactionHash,
                campaignId,
                ngoAddress
            };
        } catch (error) {
            console.error('Error withdrawing funds:', error);
            throw error;
        }
    }

    // Pause campaign
    async pauseCampaign(campaignId, ngoAddress) {
        try {
            await this.contract.methods.pauseCampaign(campaignId)
                .send({
                    from: ngoAddress,
                    gas: 300000
                });
            return true;
        } catch (error) {
            console.error('Error pausing campaign:', error);
            throw error;
        }
    }

    // Resume campaign
    async resumeCampaign(campaignId, ngoAddress) {
        try {
            await this.contract.methods.resumeCampaign(campaignId)
                .send({
                    from: ngoAddress,
                    gas: 300000
                });
            return true;
        } catch (error) {
            console.error('Error resuming campaign:', error);
            throw error;
        }
    }

    async getCampaignDonations(campaignId) {
        try {
            // Get donation events for this campaign
            const events = await this.contract.getPastEvents('DonationReceived', {
                filter: { campaignId: campaignId },
                fromBlock: 0,
                toBlock: 'latest'
            });

            return events.map(event => ({
                campaignId: event.returnValues.campaignId,
                donor: event.returnValues.donor,
                amount: this.web3.utils.fromWei(event.returnValues.amount, 'ether'),
                transactionHash: event.transactionHash,
                timestamp: new Date().toISOString() // You might want to get the block timestamp
            }));
        } catch (error) {
            console.error('Error getting campaign donations:', error);
            return [];
        }
    }

    async getNGOWithdrawals(ngoAddress) {
        try {
            // Get all campaigns for this NGO
            const campaigns = await this.getAllCampaigns();
            const ngoCampaigns = campaigns.filter(
                campaign => campaign.ngoAddress.toLowerCase() === ngoAddress.toLowerCase()
            );

            // Get withdrawal events for each campaign
            const withdrawals = [];
            for (const campaign of ngoCampaigns) {
                const events = await this.contract.getPastEvents('FundsWithdrawn', {
                    filter: { campaignId: campaign.id },
                    fromBlock: 0,
                    toBlock: 'latest'
                });

                withdrawals.push(...events.map(event => ({
                    campaignId: event.returnValues.campaignId,
                    amount: this.web3.utils.fromWei(campaign.totalRaised, 'ether'),
                    transactionHash: event.transactionHash,
                    timestamp: new Date().toISOString() // You might want to get the block timestamp
                })));
            }

            return withdrawals;
        } catch (error) {
            console.error('Error getting NGO withdrawals:', error);
            return [];
        }
    }

    // Add this method to ContractService class
    async getRecentDonations(limit = 5) {
        try {
            const events = await this.contract.getPastEvents('DonationReceived', {
                fromBlock: 0,
                toBlock: 'latest'
            });

            // Sort events by block number in descending order and take the most recent ones
            const recentDonations = events
                .sort((a, b) => b.blockNumber - a.blockNumber)
                .slice(0, limit)
                .map(event => ({
                    campaignId: event.returnValues.campaignId,
                    donor: event.returnValues.donor,
                    amount: this.web3.utils.fromWei(event.returnValues.amount, 'ether'),
                    transactionHash: event.transactionHash,
                    blockNumber: event.blockNumber
                }));

            // Get campaign details for each donation
            const donationsWithDetails = await Promise.all(
                recentDonations.map(async (donation) => {
                    const campaign = await this.getCampaignById(donation.campaignId);
                    return {
                        ...donation,
                        campaignTitle: campaign.title,
                        ngoAddress: campaign.ngoAddress
                    };
                })
            );

            return donationsWithDetails;
        } catch (error) {
            console.error('Error getting recent donations:', error);
            return [];
        }
    }

    // Update the refundDonors method
    async refundDonors(campaignId, ngoAddress) {
        try {
            // First check if campaign exists and is ended
            const campaign = await this.getCampaignById(campaignId);
            if (!campaign) {
                throw new Error('Campaign not found');
            }

            if (campaign.status !== 'ended') {
                throw new Error('Campaign must be ended before refunding');
            }

            if (campaign.isWithdrawn) {
                throw new Error('Funds have already been withdrawn');
            }

            // Send refund transaction
            const tx = await this.contract.methods.refundDonors(campaignId)
                .send({
                    from: ngoAddress,
                    gas: 300000
                });

            console.log('Refund transaction receipt:', tx);

            if (!tx.events || !tx.events.RefundIssued) {
                throw new Error('Refund event not found in transaction');
            }

            const event = tx.events.RefundIssued.returnValues;
            return {
                campaignId: event.campaignId,
                amount: this.web3.utils.fromWei(event.amount, 'ether'),
                transactionHash: tx.transactionHash,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error refunding donors:', error);
            throw new Error(`Failed to refund donors: ${error.message}`);
        }
    }

    // Add method to get donor's donation amount
    async getDonationAmount(campaignId, donorAddress) {
        try {
            const amount = await this.contract.methods.getDonationAmount(campaignId, donorAddress).call();
            return this.web3.utils.fromWei(amount, 'ether');
        } catch (error) {
            console.error('Error getting donation amount:', error);
            throw new Error(`Failed to get donation amount: ${error.message}`);
        }
    }

    async removeCampaign(campaignId, ngoAddress) {
        try {
            const tx = await this.contract.methods.removeCampaign(campaignId)
                .send({
                    from: ngoAddress,
                    gas: 300000
                });
            return tx;
        } catch (error) {
            throw new Error(`Failed to remove campaign: ${error.message}`);
        }
    }

    async getCampaignBalance(campaignId) {
        try {
            const balance = await this.contract.methods.getCampaignBalance(campaignId).call();
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            throw new Error(`Failed to get campaign balance: ${error.message}`);
        }
    }
}

export default new ContractService(); 