import express from 'express';
import ContractService from '../services/contractService.js';
import FirestoreService from '../services/firestoreService.js';

const router = express.Router();

// NGO Routes (Firestore)
router.post('/ngo/register', async (req, res) => {
    try {
        const ngo = await FirestoreService.createNGO(req.body);
        res.json(ngo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/ngo/:walletAddress', async (req, res) => {
    try {
        const ngo = await FirestoreService.getNGOByWallet(req.params.walletAddress);
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }
        res.json(ngo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Donation Routes
router.get('/donations/user/:walletAddress', async (req, res) => {
    try {
        const donations = await FirestoreService.getDonationsByUser(req.params.walletAddress);
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Campaign Routes (Smart Contract)
router.post('/campaigns/create', async (req, res) => {
    try {
        // First check NGO status
        const ngo = await FirestoreService.getNGOByWallet(req.body.ngoAddress);

        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        if (ngo.status !== 'approved') {
            return res.status(403).json({
                error: 'NGO must be approved before creating campaigns'
            });
        }

        // Create campaign on blockchain
        const campaign = await ContractService.createCampaign(
            req.body,
            req.body.ngoAddress
        );

        // Store campaign in Firestore
        const firestoreCampaign = await FirestoreService.createCampaign({
            ...campaign,
            ngoId: ngo.id,
            donors: []
        });

        res.json(firestoreCampaign);
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/campaigns/all', async (req, res) => {
    try {
        const campaigns = await ContractService.getAllCampaigns();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Donation Routes
router.post('/donations/create', async (req, res) => {
    try {
        const { campaignId, amountInWei, donorWallet } = req.body;
        console.log('Donation request:', { campaignId, amountInWei, donorWallet });

        // Validate inputs
        if (!campaignId || !amountInWei || !donorWallet) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // Create blockchain transaction
        const donation = await ContractService.donate(
            campaignId,
            amountInWei,
            donorWallet
        );

        console.log('Donation successful:', donation);

        // Return the donation with updated campaign total
        res.json(donation);
    } catch (error) {
        console.error('Donation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Withdrawal Routes
router.post('/withdrawals/create', async (req, res) => {
    try {
        const withdrawal = await ContractService.withdrawFunds(
            req.body.campaignId,
            req.body.ngoAddress
        );

        // Store withdrawal record in Firestore
        const withdrawalRecord = await FirestoreService.createWithdrawal({
            ...withdrawal,
            ngoId: req.body.ngoId,
            timestamp: new Date().toISOString(),
            status: 'completed'
        });

        res.json(withdrawalRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Campaign Management Routes
router.post('/campaigns/:id/pause', async (req, res) => {
    try {
        await ContractService.pauseCampaign(req.params.id, req.body.ngoAddress);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/campaigns/:id/resume', async (req, res) => {
    try {
        await ContractService.resumeCampaign(req.params.id, req.body.ngoAddress);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// NGO Dashboard Routes
router.get('/campaigns/ngo/:ngoId', async (req, res) => {
    try {
        // First get NGO's wallet address
        const ngo = await FirestoreService.getNGOById(req.params.ngoId);
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        // Get all campaigns from smart contract and filter by NGO's address
        const allCampaigns = await ContractService.getAllCampaigns();
        const ngoCampaigns = allCampaigns.filter(
            campaign => campaign.ngoAddress.toLowerCase() === ngo.walletAddress.toLowerCase()
        );

        res.json(ngoCampaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/donations/ngo/:ngoId', async (req, res) => {
    try {
        // First get NGO's wallet address
        const ngo = await FirestoreService.getNGOById(req.params.ngoId);
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        // Get all campaigns for this NGO
        const allCampaigns = await ContractService.getAllCampaigns();
        const ngoCampaigns = allCampaigns.filter(
            campaign => campaign.ngoAddress.toLowerCase() === ngo.walletAddress.toLowerCase()
        );

        // Get donations for each campaign
        const donations = [];
        for (const campaign of ngoCampaigns) {
            const campaignDonations = await ContractService.getCampaignDonations(campaign.id);
            donations.push(...campaignDonations);
        }

        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/withdrawals/:ngoId', async (req, res) => {
    try {
        // First get NGO's wallet address
        const ngo = await FirestoreService.getNGOById(req.params.ngoId);
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        // Get all withdrawals from smart contract
        const withdrawals = await ContractService.getNGOWithdrawals(ngo.walletAddress);
        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add these routes
router.post('/campaigns/:id/refund', async (req, res) => {
    try {
        await ContractService.refundDonors(req.params.id, req.body.ngoAddress);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/campaigns/:id/remove', async (req, res) => {
    try {
        await ContractService.removeCampaign(req.params.id, req.body.ngoAddress);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/campaigns/:id/balance', async (req, res) => {
    try {
        const balance = await ContractService.getCampaignBalance(req.params.id);
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Specific campaign routes first
router.get('/campaigns/all', async (req, res) => {
    try {
        const campaigns = await ContractService.getAllCampaigns();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/campaigns/ngo/:ngoId', async (req, res) => {
    try {
        // First get NGO's wallet address
        const ngo = await FirestoreService.getNGOById(req.params.ngoId);
        if (!ngo) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        // Get all campaigns from smart contract and filter by NGO's address
        const allCampaigns = await ContractService.getAllCampaigns();
        const ngoCampaigns = allCampaigns.filter(
            campaign => campaign.ngoAddress.toLowerCase() === ngo.walletAddress.toLowerCase()
        );

        res.json(ngoCampaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Then the parameterized route
router.get('/campaigns/:id', async (req, res) => {
    try {
        console.log('Fetching campaign with ID:', req.params.id);
        const campaign = await ContractService.getCampaignById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        res.json(campaign);
    } catch (error) {
        console.error('Error in campaign route:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router; 