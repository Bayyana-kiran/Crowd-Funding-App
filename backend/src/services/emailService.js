import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendVerificationEmail(ngoData, status, remarks = '') {
        const statusMessages = {
            approved: {
                subject: 'NGO Registration Approved - DeCrowd',
                heading: 'Congratulations! Your NGO has been approved',
                message: 'Your NGO registration has been approved. You can now create fundraising campaigns and start accepting donations.'
            },
            rejected: {
                subject: 'NGO Registration Update - DeCrowd',
                heading: 'NGO Registration Status Update',
                message: 'We regret to inform you that your NGO registration has been rejected.'
            }
        };

        const template = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4F46E5; text-align: center; padding: 20px 0;">
                    ${statusMessages[status].heading}
                </h1>
                <div style="padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                    <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5;">
                        Dear ${ngoData.name},
                    </p>
                    <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.5;">
                        ${statusMessages[status].message}
                    </p>
                    ${remarks ? `
                        <div style="margin-bottom: 20px; padding: 15px; background-color: #fff; border-radius: 4px;">
                            <p style="margin: 0; font-size: 16px; color: #374151;">
                                <strong>Remarks:</strong><br/>
                                ${remarks}
                            </p>
                        </div>
                    ` : ''}
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">
                            If you have any questions, please contact our support team.
                        </p>
                    </div>
                </div>
                <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
                    &copy; ${new Date().getFullYear()} DeCrowd. All rights reserved.
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ngoData.email,
            subject: statusMessages[status].subject,
            html: template
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Verification email sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw error;
        }
    }
}

export default new EmailService(); 