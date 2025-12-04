// -------------------------------------------------------------------------
// 1. NEW FILE: /src/app/api/admin/reviews/route.ts
// This API route fetches ALL reviews (pending and approved) for the admin panel.
// -------------------------------------------------------------------------
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import serializeTimestamps from '@/lib/firestore-serialize';

export const revalidate = 0; // We don't want to cache the admin list

export async function GET() {
  try {
    const reviewsSnapshot = await adminDb
      .collection('reviews')
      .orderBy('createdAt', 'desc')
      .get();
    
    const reviews = reviewsSnapshot.docs.map(doc => {
      const data = doc.data();
      const safe = serializeTimestamps(data as any) as Record<string, any>;
      return {
        id: doc.id,
        ...safe,
        createdAt: safe.createdAt,
      };
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all reviews for admin:", error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
