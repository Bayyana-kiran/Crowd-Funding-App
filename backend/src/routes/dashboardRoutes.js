import express from 'express';
import FirestoreService from '../services/firestoreService.js';

const router = express.Router();

// NGO Routes
router.get('/ngo/all', async (req, res) => {
    try {
        const ngos = await FirestoreService.getAllNGOs();
        res.json(ngos);
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

// Campaign Routes
router.get('/campaigns/all', async (req, res) => {
    try {
        const campaigns = await FirestoreService.getAllCampaigns();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/campaigns/ngo/:ngoId', async (req, res) => {
    try {
        const campaigns = await FirestoreService.getCampaignsByNGO(req.params.ngoId);
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Donation Routes
router.get('/donations/ngo/:ngoId', async (req, res) => {
    try {
        const donations = await FirestoreService.getDonationsByNGO(req.params.ngoId);
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/donations/user/:walletAddress', async (req, res) => {
    try {
        const donations = await FirestoreService.getDonationsByUser(req.params.walletAddress);
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Withdrawal Routes
router.get('/withdrawals/:ngoId', async (req, res) => {
    try {
        const withdrawals = await FirestoreService.getWithdrawalRequests(req.params.ngoId);
        res.json(withdrawals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin NGO Verification Routes
router.get('/admin/ngos/pending', async (req, res) => {
    try {
        const ngos = await FirestoreService.getPendingNGOs();
        res.json(ngos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/ngos/approved', async (req, res) => {
    try {
        const ngos = await FirestoreService.getApprovedNGOs();
        res.json(ngos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/ngos/rejected', async (req, res) => {
    try {
        const ngos = await FirestoreService.getRejectedNGOs();
        res.json(ngos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/admin/ngos/:id/status', async (req, res) => {
    try {
        const { status, remarks } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        await FirestoreService.updateNGOStatus(req.params.id, status, remarks);
        res.json({ message: 'NGO status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Dashboard Routes
router.get('/admin/stats', async (req, res) => {
    try {
        const stats = await FirestoreService.getAdminDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/recent-registrations', async (req, res) => {
    try {
        const registrations = await FirestoreService.getRecentNGORegistrations();
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin/recent-donations', async (req, res) => {
    try {
        const donations = await FirestoreService.getRecentDonations();
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/campaigns/create', async (req, res) => {
    try {
        const campaign = await FirestoreService.createCampaign(req.body);
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/donations/create', async (req, res) => {
    try {
        const donation = await FirestoreService.createDonation(req.body);
        res.json(donation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this route to get campaign details
router.get('/campaign/:id', async (req, res) => {
    try {
        const campaign = await FirestoreService.getCampaignById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 