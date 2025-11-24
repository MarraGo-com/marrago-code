// /src/app/api/admin/experiences/initiate/route.ts

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * This route's sole purpose is to generate a new, unique ID for an experience
 * and create a placeholder document in Firestore.
 * It returns the new ID to the client.
 */
export async function POST() {
  try {
    // Create a new document reference in the 'experiences' collection.
    // This automatically generates a unique ID without needing any data yet.
    const newDocRef = adminDb.collection('experiences').doc();
    const newId = newDocRef.id;

    // It's good practice to set a placeholder document immediately.
    // This can be useful for cleanup jobs if the user abandons the form.
    await newDocRef.set({
      createdAt: FieldValue.serverTimestamp(),
      status: 'published' // A temporary status
    });

    // Send the new ID back to the client.
    return NextResponse.json({ id: newId }, { status: 201 });

  } catch (error) {
    console.error("Error initiating experience:", error);
    return NextResponse.json({ message: 'Failed to initiate experience' }, { status: 500 });
  }
}
