// /src/app/api/admin/experiences/[id]/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { revalidatePath } from 'next/cache';
import { GalleryImage } from '@/types/experience'; // Assuming you have this in your types

type Params = Promise<{ id: string }>;
export async function PUT(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { price, locationId, coverImage, galleryImages, translations, tags } = body;

    if (!id) {
      return NextResponse.json({ message: 'Experience ID is required' }, { status: 400 });
    }

    const tagsArray = tags && typeof tags === 'string'
      ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : [];

    const docRef = adminDb.collection('experiences').doc(id);
    const updateData = {
      price,
      locationId,
      coverImage,
      galleryImages: galleryImages || [],
      translations,
      tags: tagsArray,
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    await docRef.update(updateData);

    revalidatePath('/[locale]/experiences', 'page');
    revalidatePath(`/[locale]/experiences/${id}`, 'page');
    return NextResponse.json({ message: 'Experience updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error updating experience:", error);
    let errorMessage = 'Failed to update experience';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    if (!id) { return NextResponse.json({ message: 'Experience ID is required' }, { status: 400 }); }

    const docRef = adminDb.collection('experiences').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) { return NextResponse.json({ error: 'Experience not found' }, { status: 404 }); }
    
    const data = docSnap.data();

    // Delete Cover Image
    if (data?.coverImage) {
        try {
            const bucket = getStorage().bucket();
            const filePath = decodeURIComponent(new URL(data.coverImage).pathname.split('/o/')[1].split('?')[0]);
            await bucket.file(filePath).delete();
            console.log(`✅ Deleted cover image: ${filePath}`);
        } catch (e) {
            console.warn(`Could not delete cover image ${data.coverImage}:`, e);
        }
    }

    // --- THIS IS THE CORRECTED LOGIC ---
    // This now correctly handles the array of { path, hidden } objects.
    if (data?.galleryImages && Array.isArray(data.galleryImages)) {
      const bucket = getStorage().bucket();
      const deletePromises = data.galleryImages.map((img: GalleryImage) => {
        try {
          const filePath = decodeURIComponent(new URL(img.path).pathname.split('/o/')[1].split('?')[0]);
          return bucket.file(filePath).delete().then(() => console.log(`✅ Deleted gallery image: ${filePath}`));
        } catch (e) {
          console.warn(`Could not delete gallery image ${img.path}:`, e);
          return Promise.resolve();
        }
      });
      await Promise.all(deletePromises);
    }
    
    await docRef.delete();
    console.log(`✅ Successfully deleted document from Firestore: ${id}`);
    revalidatePath('/[locale]/experiences', 'page');
    revalidatePath(`/[locale]/experiences/${id}`, 'page');
    return NextResponse.json({ message: 'Experience deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
