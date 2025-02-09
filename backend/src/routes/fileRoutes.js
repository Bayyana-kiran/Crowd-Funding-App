import express from 'express';
import multer from 'multer';
import { createNGOFolder, uploadFile } from '../middleware/googleDrive.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const BASE_URL = process.env.BASE_URL || 'https://drive.google.com/file/d/';

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Configure multer for multiple files
const uploadFields = upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'panNGO', maxCount: 1 },
    { name: 'annualReport', maxCount: 1 },
    { name: 'legalFinanceDocs', maxCount: 1 }
]);

// Store NGO folders temporarily (in production, use a database)
const ngoFolders = new Map();

router.post('/upload', uploadFields, async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const { darpanId } = req.body;
        if (!darpanId) {
            return res.status(400).json({ error: 'DARPAN ID is required' });
        }

        // Check if folder exists for this NGO
        let folderId = ngoFolders.get(darpanId);

        // Create folder only if it doesn't exist
        if (!folderId) {
            console.log(`Creating new folder for DARPAN ID: ${darpanId}`);
            folderId = await createNGOFolder(darpanId);
            ngoFolders.set(darpanId, folderId);
        }

        // Upload all files to the NGO's folder
        const fileUrls = {};
        const uploadPromises = Object.keys(req.files).map(async (fileType) => {
            const file = req.files[fileType][0];
            // Create a buffer with mimetype
            const bufferWithMime = file.buffer;
            bufferWithMime.mimetype = file.mimetype;

            const fileData = await uploadFile(bufferWithMime, fileType, folderId);
            fileUrls[`${fileType}Url`] = `${BASE_URL}${fileData.id}/view`;
        });

        await Promise.all(uploadPromises);

        res.status(200).json({
            fileUrls,
            message: 'All files uploaded successfully'
        });

    } catch (error) {
        console.error('Error in file upload:', error);
        res.status(500).json({
            error: 'Failed to upload files',
            details: error.message
        });
    }
});

export default router; 