// /src/app/api/experiences/[id]/route.ts
import { NextResponse as NextPublicResponse } from 'next/server';
import { adminDb as adminDbPublic } from '@/lib/firebase-admin';

// Revalidate this route every hour
export const revalidate = 3600; 

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
   const { id } = await params;
  try {
   
    if (!id) { return NextPublicResponse.json({ error: 'Experience ID is required' }, { status: 400 }); }

    const docRef = adminDbPublic.collection('experiences').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) { return NextPublicResponse.json({ error: 'Experience not found' }, { status: 404 }); }
    
    const data = docSnap.data();
    if (!data) { return NextPublicResponse.json({ error: 'Experience data is empty' }, { status: 404 }); }

    // Construct the experience object, explicitly including ALL new fields
    const experience = {
      id: docSnap.id,
      // Base fields
      price: data.price,
      locationId: data.locationId,
      coverImage: data.coverImage,
      galleryImages: data.galleryImages || [],
      duration: data.duration,
      translations: data.translations,
      createdAt: data.createdAt?.toDate().toISOString(),
      
      // ▼▼▼ INCLUDE NEW FIELDS IN RESPONSE ▼▼▼
      tags: data.tags || [],
      maxGuests: data.maxGuests,
      tourCode: data.tourCode,
      languages: data.languages || [],
      startTimes: data.startTimes || [],
      latitude: data.latitude,
      longitude: data.longitude
      // ▲▲▲
    };
    
    // Add a debug log on the server to confirm what's being sent
    console.log(`API (GET): Sending complete experience data for ${id}`);

    return NextPublicResponse.json({ experience }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching public experience with id: ${id}`, error);
    return NextPublicResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}