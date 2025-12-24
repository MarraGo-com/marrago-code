// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { adminDb } from '@/lib/firebase-admin'; // <--- 1. Import Admin DB

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Destructure the new fields we added in the Wizard
    const { 
      name, 
      email, 
      message, 
      subject,
      saveToDb, // boolean flag
      userId,   // the logged-in user's ID
      tripData  // the raw wizard data object
    } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- PART A: SAVE TO FIRESTORE (If requested) ---
    // We do this concurrently with email sending, or before.
    if (saveToDb && userId && tripData) {
        try {
            // We create a new collection called 'trips'
            await adminDb.collection('trips').add({
                userId: userId,
                // Spread the trip details (destinations, budget, etc.)
                ...tripData,
                // Add Meta fields
                customerName: name,
                customerEmail: email,
                createdAt: new Date(), // Server timestamp
                status: 'pending' // 'pending', 'quoted', 'booked'
            });
            console.log(`[API] Trip saved for user: ${userId}`);
        } catch (dbError) {
            console.error('[API] Firestore Save Error:', dbError);
            // We do NOT stop the function here. 
            // Even if DB fails, we still want to try sending the email.
        }
    }

    // --- PART B: SEND EMAIL (Nodemailer) ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL, 
      to: process.env.NODEMAILER_EMAIL,
      replyTo: email, 
      subject: subject || `New Message from ${name} via your Website`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">${subject || 'New Contact Form Submission'}</h2>
          
          ${saveToDb ? `<p style="color: #666; font-size: 12px;">✅ This request was securely saved to the database (User ID: ${userId})</p>` : ''}
          
          <p>You have received a new message from your website.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          
          <h3 style="margin-top: 20px;">Details:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #0070f3;">
            ${message}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Message sent & saved successfully!' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}