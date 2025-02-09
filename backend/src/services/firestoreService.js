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
    arrayUnion
} from 'firebase/firestore';
import EmailService from './emailService.js';

class FirestoreService {
    // NGO Related Operations
    async getAllNGOs() {
        try {
            const ngoSnapshot = await getDocs(collection(db, 'ngo'));
            return ngoSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting NGOs:', error);
            throw error;
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
            console.error('Error getting NGO by wallet:', error);
            throw error;
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
            console.error('Error getting pending NGOs:', error);
            throw error;
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

    async updateNGOStatus(ngoId, status, remarks = '') {
        try {
            const ngoRef = doc(db, 'ngo', ngoId);
            const ngoDoc = await getDoc(ngoRef);
            const ngoData = ngoDoc.data();

            await updateDoc(ngoRef, {
                status: status,
                remarks: remarks,
                updatedAt: new Date().toISOString(),
                verifiedAt: status === 'approved' ? new Date().toISOString() : null
            });

            // Send email notification
            if (status === 'approved' || status === 'rejected') {
                await EmailService.sendVerificationEmail(
                    { ...ngoData, id: ngoId },
                    status,
                    remarks
                );
            }

            return true;
        } catch (error) {
            console.error('Error updating NGO status:', error);
            throw error;
        }
    }

    async getAdminDashboardStats() {
        try {
            const [ngos, campaigns, donations] = await Promise.all([
                this.getAllNGOs(),
                this.getAllCampaigns(),
                this.getAllDonations()
            ]);

            return {
                totalNGOs: ngos.length,
                pendingApprovals: ngos.filter(ngo => ngo.status === 'pending').length,
                totalFundsRaised: donations.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0),
                activeNGOs: ngos.filter(ngo => ngo.status === 'approved').length,
                totalCampaigns: campaigns.length,
                activeCampaigns: campaigns.filter(c => c.status === 'active').length
            };
        } catch (error) {
            console.error('Error getting admin dashboard stats:', error);
            throw error;
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
            console.error('Error getting recent NGO registrations:', error);
            throw error;
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
            console.error('Error getting recent donations:', error);
            throw error;
        }
    }

    async createCampaign(campaignData) {
        try {
            // Validate required fields
            const requiredFields = ['title', 'description', 'goal', 'deadline', 'ngoId'];
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
                deadline: new Date(campaignData.deadline).toISOString(),
                totalRaised: 0,
                donors: [],
                imageUrl: campaignData.imageUrl || '',
                category: campaignData.category || 'Other',
                tags: campaignData.tags || [],
                updates: [],
                lastUpdated: new Date().toISOString()
            };

            const campaignRef = await addDoc(collection(db, 'campaigns'), campaign);
            return {
                id: campaignRef.id,
                ...campaign
            };
        } catch (error) {
            console.error('Error creating campaign:', error);
            throw error;
        }
    }

    async createDonation(donationData) {
        try {
            // Update campaign total raised amount
            const campaignRef = doc(db, 'campaigns', donationData.campaignId);
            const campaignDoc = await getDoc(campaignRef);
            const campaign = campaignDoc.data();

            await updateDoc(campaignRef, {
                totalRaised: parseFloat(campaign.totalRaised || 0) + parseFloat(donationData.amount),
                donors: arrayUnion(donationData.donorWallet)
            });

            // Create donation record
            const donationRef = await addDoc(collection(db, 'donations'), donationData);
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
}

export default new FirestoreService(); 