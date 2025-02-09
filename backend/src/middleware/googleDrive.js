import { google } from 'googleapis';
import { Readable } from 'stream';
import dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });
const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Create a new folder for NGO registration
async function createNGOFolder(darpanId) {
    try {
        const folderMetadata = {
            name: darpanId,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId]
        };

        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: 'id'
        });

        return folder.data.id;
    } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
    }
}

// Upload file to specific folder
async function uploadFile(buffer, fileType, folderId) {
    try {
        // Get original file extension from the buffer's mime type
        const mimeType = buffer.mimetype || 'application/octet-stream';
        let extension = '';

        // Common mime type to extension mapping
        const mimeToExt = {
            'application/pdf': '.pdf',
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/jpg': '.jpg',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/vnd.ms-excel': '.xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
        };

        extension = mimeToExt[mimeType] || '';

        const fileMetadata = {
            name: `${fileType}${extension}`, // Add extension to filename
            parents: [folderId]
        };

        // Convert buffer to readable stream
        const readable = new Readable();
        readable._read = () => { }; // Required but noop
        readable.push(buffer);
        readable.push(null);

        const media = {
            mimeType: mimeType,
            body: readable
        };

        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, name',
        });

        return file.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

export { createNGOFolder, uploadFile }; 