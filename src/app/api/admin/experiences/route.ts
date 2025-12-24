import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ▼▼▼ 1. DESTRUCTURE ALL FIELDS (INCLUDING NEW PRO FIELDS) ▼▼▼
    const { 
      price, 
      locationId, 
      coverImage, 
      galleryImages, 
      translations, 
      tags,
      duration,
      maxGuests,
      tourCode,
      languages,
      startTimes,
      latitude,
      longitude,
      // New Pro Fields:
      scarcity,
      bookingPolicy,
      features
    } = body;

    if (!translations?.en?.title || !price?.amount) {
      return NextResponse.json({ message: 'English title and price amount are required' }, { status: 400 });
    }

    // Fix: Handle tags whether they are a string (old way) or array (new way)
    const tagsArray = Array.isArray(tags) 
      ? tags 
      : (tags && typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : []);

    const newData = {
      price: {
        amount: Number(price.amount) || 0,
        currency: price.currency || 'EUR',
        prefix: price.prefix || 'from',
      },
      locationId,
      coverImage,
      galleryImages: galleryImages || [],
      translations, // Saves 'program' timeline automatically
      tags: tagsArray,

      // Standard Fields
      duration: duration || '',
      maxGuests: maxGuests ?? null,
      tourCode: tourCode ?? '',
      languages: languages || [],
      startTimes: startTimes || [],
      latitude: latitude ?? null,
      longitude: longitude ?? null,

      // ▼▼▼ 2. SAVE NEW PRO FIELDS ▼▼▼
      scarcity: scarcity || null,
      bookingPolicy: bookingPolicy || null,
      features: features || null,
      // ▲▲▲
      
      isFeatured: true,
      createdAt: FieldValue.serverTimestamp(),
    };
    
    console.log("API (POST): Creating new experience with data:", newData);

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