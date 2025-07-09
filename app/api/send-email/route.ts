import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Format appointment data for email
    const { name, email, phone, date, message } = data;
    
    // Prepare email content
    const emailContent = `
      <h2>New Appointment Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Preferred Date:</strong> ${date || 'Not provided'}</p>
      <p><strong>Message:</strong> ${message || 'Not provided'}</p>
      <p>Please contact the customer to confirm their appointment.</p>
    `;

    // Send email
    await transporter.sendMail({
      from: '"JENDO Website" <noreply@jendoinnovations.com>',
      to: ['keerthi@effectivesolutions.lk', 'keerthi.office1990@gmail.com'],
      subject: 'New Appointment Request',
      html: emailContent,
    });

    return NextResponse.json(
      { success: true, message: 'Appointment request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit appointment request' },
      { status: 500 }
    );
  }
}