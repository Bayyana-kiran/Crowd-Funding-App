import { db } from '../config/firebase.js';
import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    arrayUnion,
    setDoc
} from 'firebase/firestore';
import EmailService from './emailService.js';

class FirestoreService {
    // NGO Related Operations
    async getAllNGOs() {
        try {
            const snapshot = await getDocs(collection(db, 'ngo'));
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting all NGOs:', error);
            throw new Error(`Failed to get NGOs: ${error.message}`);
        }
    }

    async getNGOByWallet(walletAddress) {
        try {
            const q = query(
                collection(db, 'ngo'),
                where('walletAddress', '==', walletAddress),
                limit(1)
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) return null;

            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            throw new Error(`Failed to get NGO: ${error.message}`);
        }
    }

    // Campaign Related Operations
    async getAllCampaigns(includeEnded = false) {
        try {
            const q = includeEnded
                ? query(collection(db, 'campaigns'))
                : query(
                    collection(db, 'campaigns'),
                    where('status', '==', 'active')
                );
            const campaignSnapshot = await getDocs(q);
            return campaignSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting campaigns:', error);
            throw error;
        }
    }

    async getCampaignsByNGO(ngoId) {
        try {
            const q = query(
                collection(db, 'campaigns'),
                where('ngoId', '==', ngoId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting NGO campaigns:', error);
            throw error;
        }
    }

    // Donation Related Operations
    async getDonationsByNGO(ngoId) {
        try {
            const q = query(
                collection(db, 'donations'),
                where('ngoId', '==', ngoId),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const donations = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort in memory for now
            return donations.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Error getting NGO donations:', error);
            throw error;
        }
    }

    async getDonationsByUser(walletAddress) {
        try {
            const q = query(
                collection(db, 'donations'),
                where('donorWallet', '==', walletAddress),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const donations = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort in memory for now
            return donations.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Error getting user donations:', error);
            throw error;
        }
    }

    // Withdrawal Related Operations
    async getWithdrawalRequests(ngoId) {
        try {
            const q = query(
                collection(db, 'withdrawals'),
                where('ngoId', '==', ngoId),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const withdrawals = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort in memory for now
            return withdrawals.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Error getting withdrawal requests:', error);
            throw error;
        }
    }

    // Admin NGO Verification Operations
    async getPendingNGOs() {
        try {
            const q = query(
                collection(db, 'ngo'),
                where('status', '==', 'pending'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error(`Failed to get pending NGOs: ${error.message}`);
        }
    }

    async getApprovedNGOs() {
        try {
            const q = query(
                collection(db, 'ngo'),
                where('status', '==', 'approved'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting approved NGOs:', error);
            throw error;
        }
    }

    async getRejectedNGOs() {
        try {
            const q = query(
                collection(db, 'ngo'),
                where('status', '==', 'rejected'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting rejected NGOs:', error);
            throw error;
        }
    }

    async updateNGOStatus(ngoId, status) {
        try {
            console.log('Updating NGO status in Firestore:', { ngoId, status });

            const ngoRef = doc(db, 'ngo', ngoId);
            const ngoDoc = await getDoc(ngoRef);

            if (!ngoDoc.exists) {
                console.log('NGO not found:', ngoId);
                return null;
            }

            await updateDoc(ngoRef, {
                status: status,
                updatedAt: new Date().toISOString()
            });

            // Get the updated document
            const updatedDoc = await getDoc(ngoRef);
            return {
                id: updatedDoc.id,
                ...updatedDoc.data()
            };
        } catch (error) {
            console.error('Error updating NGO status:', error);
            throw new Error(`Failed to update NGO status: ${error.message}`);
        }
    }

    async getAdminDashboardStats() {
        try {
            const [ngos, donations] = await Promise.all([
                this.getAllNGOs(),
                this.getAllDonations()
            ]);

            return {
                totalNGOs: ngos.length,
                pendingApprovals: ngos.filter(ngo => ngo.status === 'pending').length,
                totalFundsRaised: donations.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0),
                activeNGOs: ngos.filter(ngo => ngo.status === 'approved').length
            };
        } catch (error) {
            throw new Error(`Failed to get admin stats: ${error.message}`);
        }
    }

    async getAllDonations() {
        try {
            const donationSnapshot = await getDocs(collection(db, 'donations'));
            return donationSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting all donations:', error);
            throw error;
        }
    }

    async getRecentNGORegistrations() {
        try {
            const q = query(
                collection(db, 'ngo'),
                orderBy('createdAt', 'desc'),
                limit(5)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error(`Failed to get recent registrations: ${error.message}`);
        }
    }

    async getRecentDonations() {
        try {
            const q = query(
                collection(db, 'donations'),
                orderBy('timestamp', 'desc'),
                limit(5)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error(`Failed to get recent donations: ${error.message}`);
        }
    }

    async createCampaign(campaignData) {
        try {
            // Validate required fields
            const requiredFields = ['id', 'title', 'description', 'goal', 'ngoId'];
            for (const field of requiredFields) {
                if (!campaignData[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            // Format and validate data
            const campaign = {
                ...campaignData,
                goal: parseFloat(campaignData.goal),
                status: 'active',
                createdAt: new Date().toISOString(),
                totalRaised: 0,
                donors: [],
                imageUrl: campaignData.imageUrl || '',
                category: campaignData.category || 'Other',
                tags: campaignData.tags || [],
                updates: [],
                lastUpdated: new Date().toISOString()
            };

            // Use blockchain campaign ID as Firestore document ID
            const campaignRef = doc(db, 'campaigns', campaignData.id);
            await setDoc(campaignRef, campaign);

            return {
                id: campaignData.id,
                ...campaign
            };
        } catch (error) {
            console.error('Error creating campaign:', error);
            throw error;
        }
    }

    async createDonation(donationData) {
        try {
            // Update campaign total raised amount using the value from blockchain
            const campaignRef = doc(db, 'campaigns', donationData.campaignId);
            const campaignDoc = await getDoc(campaignRef);

            if (!campaignDoc.exists()) {
                throw new Error('Campaign not found in Firestore');
            }

            await updateDoc(campaignRef, {
                totalRaised: donationData.totalRaised,
                donors: arrayUnion(donationData.donor)
            });

            // Create donation record
            const donationRef = await addDoc(collection(db, 'donations'), {
                ...donationData,
                timestamp: new Date().toISOString()
            });

            return {
                id: donationRef.id,
                ...donationData
            };
        } catch (error) {
            console.error('Error creating donation:', error);
            throw error;
        }
    }

    // Add this method to check and update campaign statuses
    async updateCampaignStatuses() {
        try {
            const campaigns = await this.getAllCampaigns();
            const now = new Date();

            for (const campaign of campaigns) {
                const deadline = new Date(campaign.deadline);
                if (deadline < now && campaign.status === 'active') {
                    const campaignRef = doc(db, 'campaigns', campaign.id);
                    await updateDoc(campaignRef, {
                        status: 'ended',
                        lastUpdated: new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            console.error('Error updating campaign statuses:', error);
            throw error;
        }
    }

    // Add this method to get campaign by ID
    async getCampaignById(campaignId) {
        try {
            const campaignDoc = await getDoc(doc(db, 'campaigns', campaignId));
            if (!campaignDoc.exists()) {
                return null;
            }
            return {
                id: campaignDoc.id,
                ...campaignDoc.data()
            };
        } catch (error) {
            console.error('Error getting campaign by ID:', error);
            throw error;
        }
    }

    // NGO Registration
    async createNGO(ngoData) {
        try {
            const docRef = await addDoc(collection(db, 'ngo'), {
                ...ngoData,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return {
                id: docRef.id,
                ...ngoData,
                status: 'pending'
            };
        } catch (error) {
            throw new Error(`Failed to create NGO: ${error.message}`);
        }
    }

    // Add this method to get NGO by ID
    async getNGOById(ngoId) {
        try {
            const ngoDoc = await getDoc(doc(db, 'ngo', ngoId));
            if (!ngoDoc.exists()) return null;

            return {
                id: ngoDoc.id,
                ...ngoDoc.data()
            };
        } catch (error) {
            throw new Error(`Failed to get NGO: ${error.message}`);
        }
    }

    // Add this method to create withdrawal record
    async createWithdrawal(withdrawalData) {
        try {
            const withdrawalRef = await addDoc(collection(db, 'withdrawals'), withdrawalData);
            return {
                id: withdrawalRef.id,
                ...withdrawalData
            };
        } catch (error) {
            console.error('Error creating withdrawal:', error);
            throw error;
        }
    }
}

export default new FirestoreService(); 