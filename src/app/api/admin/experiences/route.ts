// /src/app/api/admin/experiences/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 1. Destructure the new 'tags' field from the body. It will be a string.
    const { price, locationId, coverImage, galleryImages, translations, tags } = body;

    if (!translations?.en?.title || !price?.amount) {
      return NextResponse.json({ message: 'English title and price amount are required' }, { status: 400 });
    }

    // 2. Process the tags string into an array for Firestore.
    // This splits the string by commas, trims whitespace from each tag, and removes any empty tags.
    const tagsArray = tags && typeof tags === 'string'
      ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
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
      tags: tagsArray, // <-- 3. Save the processed array of tags.
      isFeatured: true,
      createdAt: FieldValue.serverTimestamp(),
    };
    
    const docRef = await adminDb.collection('experiences').add(newData);

    revalidatePath('/[locale]/experiences', 'page');
    revalidatePath(`/[locale]/experiences/${docRef.id}`, 'page');
    return NextResponse.json({ message: 'Experience created successfully', id: docRef.id }, { status: 201 });

  } catch (error: unknown) { // Using 'unknown' for better type safety
    console.error("Error creating experience:", error);
    let errorMessage = 'Failed to create experience';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}