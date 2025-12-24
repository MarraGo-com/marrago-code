// src/app/api/admin/articles/[id]/route.ts

import { NextResponse } from 'next/server';
import { adminDb as adminDbArticle } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { revalidatePath } from 'next/cache';

type Params = Promise<{ id: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // 🟢 FIX: Extract 'coverImage' from the body
    const { slug, status, translations, coverImage } = body;

    if (!id || !slug || !status || !translations?.en?.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const articleRef = adminDbArticle.collection('articles').doc(id);
    
    // 🟢 FIX: Include 'coverImage' in the update
    await articleRef.update({
      slug,
      status,
      translations,
      coverImage, // <--- This was missing!
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Revalidate all relevant paths so the new image shows up immediately
    revalidatePath('/[locale]/admin/blog', 'page');
    revalidatePath('/[locale]/blog', 'page');
    revalidatePath('/[locale]/blog/[slug]', 'page');

    return NextResponse.json({ message: 'Article updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

type DeleteParams = Promise<{ id: string }>;
export async function DELETE(request: Request, { params }: { params: DeleteParams }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const articleRef = adminDbArticle.collection('articles').doc(id);
    const docSnap = await articleRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const data = docSnap.data();

    // Clean up image from storage if it exists
    if (data?.coverImage) {
      try {
        const bucket = getStorage().bucket();
        // Extract path from URL (simple parsing)
        const url = new URL(data.coverImage);
        // decodeURIComponent handles spaces/special chars in filenames
        const filePath = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
        
        await bucket.file(filePath).delete();
        console.log(`✅ Successfully deleted article image from storage: ${filePath}`);
      } catch (storageError: unknown) {
        console.warn("Could not delete article image from storage:", storageError);
      }
    }

    await articleRef.delete();
    console.log(`✅ Successfully deleted article document from Firestore: ${id}`);

    revalidatePath('/[locale]/admin/blog', 'page');
    revalidatePath('/[locale]/blog', 'page');

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}