import express from 'express';
import FirestoreService from '../services/firestoreService.js';
import ContractService from '../services/contractService.js';

const router = express.Router();

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        // Get data from both Firestore and Smart Contract
        const [ngos, campaigns] = await Promise.all([
            FirestoreService.getAllNGOs(),
            ContractService.getAllCampaigns()
        ]);

        // Calculate total funds raised from all campaigns
        const totalFundsRaised = campaigns.reduce(
            (acc, curr) => acc + parseFloat(curr.totalRaised || 0),
            0
        );

        const stats = {
            totalNGOs: ngos.length,
            pendingApprovals: ngos.filter(ngo => ngo.status === 'pending').length,
            activeNGOs: ngos.filter(ngo => ngo.status === 'approved').length,
            totalCampaigns: campaigns.length,
            activeCampaigns: campaigns.filter(c => c.status === 'active').length,
            totalFundsRaised
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all NGO applications
router.get('/ngos', async (req, res) => {
    try {
        const ngos = await FirestoreService.getAllNGOs();
        res.json(ngos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update NGO verification status
router.put('/ngos/:ngoId/status', async (req, res) => {
    try {
        const { ngoId } = req.params;
        const { status } = req.body;

        console.log('Updating NGO status:', { ngoId, status });

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Update NGO status in Firestore
        const updatedNGO = await FirestoreService.updateNGOStatus(ngoId, status);

        if (!updatedNGO) {
            return res.status(404).json({ error: 'NGO not found' });
        }

        res.json(updatedNGO);
    } catch (error) {
        console.error('Error updating NGO status:', error);
        res.status(500).json({ error: error.message });
    }
});

// NGO Management Routes
router.get('/ngos/pending', async (req, res) => {
    try {
        const pendingNGOs = await FirestoreService.getPendingNGOs();
        res.json(pendingNGOs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/ngos/approved', async (req, res) => {
    try {
        const approvedNGOs = await FirestoreService.getApprovedNGOs();
        res.json(approvedNGOs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/ngos/rejected', async (req, res) => {
    try {
        const rejectedNGOs = await FirestoreService.getRejectedNGOs();
        res.json(rejectedNGOs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// NGO Verification
router.post('/ngos/verify', async (req, res) => {
    try {
        const { ngoId, status, remarks } = req.body;
        await FirestoreService.updateNGOStatus(ngoId, status, remarks);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Recent Activity Routes
router.get('/recent-registrations', async (req, res) => {
    try {
        const registrations = await FirestoreService.getRecentNGORegistrations();
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/recent-donations', async (req, res) => {
    try {
        const donations = await ContractService.getRecentDonations();
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 