'use server';

import nodemailer from 'nodemailer';

export async function sendApplicationEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  const jobTitle = formData.get('jobTitle') as string;
  const resumeFile = formData.get('resume') as File;

  if (!name || !email || !jobTitle || !resumeFile) {
    return { success: false, message: 'Missing required fields.' };
  }
  
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error('Email credentials are not set in environment variables.');
    return { success: false, message: 'Server configuration error.' };
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

  try {
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());

    const mailOptions = {
      from: EMAIL_USER,
      to: 'debarunbiswas070105@gmail.com',
      replyTo: email,
      subject: `New Job Application for ${jobTitle} from ${name}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Position:</strong> ${jobTitle}</p>
        <p><strong>Applicant Name:</strong> ${name}</p>
        <p><strong>Applicant Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      attachments: [
        {
          filename: resumeFile.name,
          content: resumeBuffer,
          contentType: resumeFile.type,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Application sent successfully!' };
  } catch (error) {
    console.error('Error sending application email:', error);
    return { success: false, message: 'Failed to send application.' };
  }
}
