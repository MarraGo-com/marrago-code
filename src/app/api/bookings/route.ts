// /src/app/api/bookings/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

// --- 1. ADD NODEMAILER IMPORT ---
import nodemailer from 'nodemailer';

// --- 2. SET UP NODEMAILER TRANSPORTER ---
// This uses the email credentials you have in your .env.local file
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
});

// This function handles POST requests to /api/bookings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      experienceId, 
      experienceTitle, 
      customerName, 
      customerEmail, 
      requestedDate, 
      numberOfGuests,
      price
    } = body;

    // --- Validation (This is correct) ---
    if (!experienceId || !customerName || !customerEmail || !requestedDate || !numberOfGuests || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Format the date for the email
    const formattedDate = new Date(requestedDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    // --- Prepare the New Booking Document (This is correct) ---
    const newBooking = {
      experienceId,
      experienceTitle,
      customerName,
      customerEmail,
      requestedDate: new Date(requestedDate), 
      numberOfGuests: Number(numberOfGuests),
      price: price,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    };

    // --- Add the Document to Firestore (This is correct) ---
    const docRef = await adminDb.collection('bookings').add(newBooking);

    revalidatePath('/admin/bookings'); 

    // --- 3. SEND EMAIL NOTIFICATION TO OMAR ---
    try {
      await transporter.sendMail({
        from: `"MarraGo Website" <${process.env.NODEMAILER_EMAIL}>`,
        to: process.env.NODEMAILER_EMAIL, // This sends it to your admin email
        subject: `🔔 New Booking Request: ${experienceTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Booking Request Received!</h2>
            <p>A new 'pending' booking has been submitted via the website.</p>
            <hr>
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Tour:</strong> ${experienceTitle}</li>
              <li><strong>Customer Name:</strong> ${customerName}</li>
              <li><strong>Customer Email:</strong> ${customerEmail}</li>
              <li><strong>Requested Date:</strong> ${formattedDate}</li>
              <li><strong>Guests:</strong> ${numberOfGuests}</li>
              <li><strong>Price:</strong> ${price.amount} ${price.currency}</li>
            </ul>
            <hr>
            <p><strong>Next Step:</strong> You must now contact this client at <strong>${customerEmail}</strong> to confirm availability and send them a secure CMI or PayPal payment link to collect the deposit.</p>
          </div>
        `
      });
      console.log(`✅ Notification email sent to ${process.env.NODEMAILER_EMAIL}`);
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
      // We don't fail the whole request, but we log the error
    }

    console.log(`✅ New booking request submitted for experience ${experienceTitle}.`);
    return NextResponse.json({ message: 'Booking request submitted successfully!', id: docRef.id }, { status: 201 });

  } catch (error) {
    console.error("Error submitting booking:", error);
    return NextResponse.json({ error: 'Failed to submit booking request' }, { status: 500 });
  }
}