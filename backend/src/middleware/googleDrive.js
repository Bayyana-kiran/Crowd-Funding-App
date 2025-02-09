import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export async function uploadFile(filePath) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: filePath.split('/').pop(), // File name
                mimeType: 'application/octet-stream',
                parents: [folderId], // Folder ID
            },
            media: {
                mimeType: 'application/octet-stream',
                body: fs.createReadStream(filePath),
            },
        });

        console.log(`File uploaded successfully: ${response.data.name}`);
        return response.data.name;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}