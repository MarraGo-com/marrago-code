// /src/app/api/admin/experiences/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // ▼▼▼ 1. DESTRUCTURE ALL NEW FIELDS ▼▼▼
    const { 
      price, 
      locationId, 
      coverImage, 
      galleryImages, 
      translations, 
      tags,
      // New fields:
      duration,
      maxGuests,
      tourCode,
      languages,
      startTimes,
      latitude,
      longitude
    } = body;
    // ▲▲▲

    if (!translations?.en?.title || !price?.amount) {
      return NextResponse.json({ message: 'English title and price amount are required' }, { status: 400 });
    }

    // Process the tags string into an array
    const tagsArray = tags && typeof tags === 'string'
      ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : [];

    const newData = {
      price: {
        amount: Number(price.amount) || 0,
        currency: price.currency || 'EUR',
        prefix: price.prefix || 'from',
      },
      locationId,
      coverImage,
      galleryImages: galleryImages || [],
      translations,
      tags: tagsArray,

      // ▼▼▼ 2. SAVE ALL NEW FIELDS TO FIRESTORE ▼▼▼
      duration: duration || '', // Ensure it's a string
      maxGuests: maxGuests ?? null, // Use null for optional numbers
      tourCode: tourCode ?? '',
      languages: languages || [],
      startTimes: startTimes || [],
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      // ▲▲▲
      
      isFeatured: true,
      createdAt: FieldValue.serverTimestamp(),
    };
    
    console.log("API (POST): Creating new experience with data:", newData); // Add debug log

    const docRef = await adminDb.collection('experiences').add(newData);

    revalidatePath('/[locale]/experiences', 'page');
    revalidatePath(`/[locale]/experiences/${docRef.id}`, 'page');
    return NextResponse.json({ message: 'Experience created successfully', id: docRef.id }, { status: 201 });

  } catch (error: unknown) {
    console.error("Error creating experience:", error);
    let errorMessage = 'Failed to create experience';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}