// /src/app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';

// --- Set up Nodemailer Transporter ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ▼▼▼ DESTRUCTURE NEW FIELDS FROM REQUEST BODY ▼▼▼
    const { 
      experienceId, 
      experienceTitle, 
      date, // This was 'requestedDate' before
      adults, // NEW
      children, // NEW
      totalGuests,
      customer, // NEW nested object with name, email, phone
      notes, // NEW
      status
    } = body;
    // ▲▲▲

    // --- Updated Validation ---
    if (!experienceId || !date || totalGuests === 0 || !customer || !customer.name || !customer.email || !customer.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    // ▼▼▼ PREPARE NEW BOOKING DOCUMENT STRUCTURE ▼▼▼
    const bookingData = {
      experienceId,
      experienceTitle,
      // Store customer info in a nested object for better organization
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone // NEW
      },
      date: new Date(date), 
      guests: {
        adults: Number(adults), // NEW
        children: Number(children), // NEW
        total: Number(totalGuests)
      },
      notes: notes || '', // NEW
      status: status || 'pending',
      createdAt: FieldValue.serverTimestamp(),
    };
    // ▲▲▲

    // --- Add the Document to Firestore ---
    const docRef = await adminDb.collection('bookings').add(bookingData);

    revalidatePath('/admin/bookings'); 

    // --- UPDATED EMAIL NOTIFICATION TO OMAR ---
    try {
      await transporter.sendMail({
        from: `"MarraGo Website" <${process.env.NODEMAILER_EMAIL}>`,
        to: process.env.NODEMAILER_EMAIL,
        subject: `🔔 New Booking Request: ${experienceTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #d32f2f;">New Booking Request Received!</h2>
            <p>A new 'pending' booking has been submitted via the website.</p>
            <hr style="border: 0; border-top: 1px solid #eee;">
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Tour:</strong> ${experienceTitle}</li>
              <li><strong>Requested Date:</strong> ${formattedDate}</li>
              <li><strong>Guests:</strong> ${totalGuests} (${adults} Adults, ${children} Children)</li>
            </ul>
            
            <h3>Customer Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${customer.name}</li>
              <li><strong>Email:</strong> <a href="mailto:${customer.email}">${customer.email}</a></li>
              <li><strong>Phone (WhatsApp):</strong> <a href="tel:${customer.phone}">${customer.phone}</a></li>
            </ul>

            ${notes ? `
            <h3>Additional Notes:</h3>
            <p style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #d32f2f;">${notes}</p>
            ` : ''}
            
            <hr style="border: 0; border-top: 1px solid #eee;">
            <p><strong>Next Step:</strong> Contact the client via WhatsApp or email to confirm availability and collect payment.</p>
          </div>
        `
      });
      console.log(`✅ Notification email sent to ${process.env.NODEMAILER_EMAIL}`);
    } catch (emailError) {
      console.error("Error sending notification email:", emailError);
    }

    console.log(`✅ New booking request submitted for experience ${experienceTitle}.`);
    return NextResponse.json({ message: 'Booking request submitted successfully!', id: docRef.id }, { status: 201 });

  } catch (error) {
    console.error("Error submitting booking:", error);
    return NextResponse.json({ error: 'Failed to submit booking request' }, { status: 500 });
  }
}