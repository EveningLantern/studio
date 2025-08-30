'use server';

import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(email: string) {
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('Email credentials are not set for sending welcome email.');
        return; 
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Digital Indian" <${EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to the Digital Indian Newsletter!',
        html: `
            <h1>Welcome!</h1>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You'll be the first to know about our latest articles, insights, and company news.</p>
            <p>Best regards,<br>The Digital Indian Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}
