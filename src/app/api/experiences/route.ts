// /src/app/api/experiences/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin'; // <-- Use the Admin SDK for all operations
import serializeTimestamps from '@/lib/firestore-serialize';
// No need to import collection, getDocs, or orderBy from 'firebase-admin/firestore'

// This tells Next.js to cache this server-side request for 1 hour
export const revalidate = 3600; 

// --- GET function now using the ADMIN SDK ---
export async function GET() {
  try {
    const experiencesRef = adminDb.collection('experiences');
    const experiencesSnapshot = await experiencesRef.get();
    
    const experiences = experiencesSnapshot.docs.map(doc => {
      const data = doc.data();
      const safe = serializeTimestamps(data as any) as Record<string, any>;

      return {
        id: doc.id,
        ...safe,
        createdAt: safe.createdAt ?? new Date().toISOString(),
      };
    });

    return NextResponse.json({ experiences }, { status: 200 });

  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ message: 'Failed to fetch experiences' }, { status: 500 });
  }
}

// --- Your POST function (no changes needed) ---
export async function POST() {
  // ... your existing POST code remains the same ...
  // It already correctly uses the Admin SDK.
}