// -------------------------------------------------------------------------
// 1. UPDATED FILE: /src/lib/data.ts
// We will move our data-fetching logic here and wrap it in React's `cache` function.
// -------------------------------------------------------------------------
import 'server-only'; // This ensures this code only ever runs on the server
import { cache } from 'react';
import { adminDb } from '@/lib/firebase-admin';
import { Article } from '@/types/article';
import { Review } from '@/types/review';

// FOR THE BLOG PAGE:

// We wrap our database call in React's `cache` function.
// This de-duplicates requests: if multiple components ask for this data in a single
// render, the database will only be hit once.
export const getPublishedArticles = cache(async () => {
  try {
    console.log('Fetching published articles from Firestore...');
    const articlesSnapshot = await adminDb
      .collection('articles')
      .where('status', '==', 'published')
      .orderBy('createdAt', 'desc')
      .get();
    
    const articles = articlesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
         createdAt: data.createdAt.toDate().toISOString(),
         updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
      };
    });
    return articles as Article[];
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return [];
  }
});

// We do the same for fetching a single article.
export const getArticleBySlug = cache(async (slug: string) => {
    try {
        console.log(`Fetching article with slug: ${slug} from Firestore...`);
        const articlesRef = adminDb.collection('articles');
        const querySnapshot = await articlesRef
          .where('slug', '==', slug)
          .where('status', '==', 'published')
          .limit(1)
          .get();

        if (querySnapshot.empty) return null;

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
        } as Article;
    } catch (error) {
        console.error("Error fetching single article:", error);
        return null;
    }
});
// --- NEW: FOR EXPERIENCES ---
export const getAllExperiences = cache(async () => {
  try {
    const experiencesSnapshot = await adminDb.collection('experiences').orderBy('createdAt', 'desc').get();
    const experiences = experiencesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
      };
    });
    return experiences;
  } catch (error) {
    console.error("Error fetching all experiences:", error);
    return [];
  }
});

export const getExperienceById = cache(async (id: string) =>  {
  try {
    const docRef = adminDb.collection('experiences').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    const data = docSnap.data();
    if (!data) return null;
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
    } ;
  } catch (error) {
    console.error(`Error fetching experience by id: ${id}`, error);
    return null;
  }
});

// --- NEW: FOR REVIEWS ---
export const getFeaturedReviews = cache(async () => {
  try {
    const reviewsSnapshot = await adminDb.collection('reviews')
      .where('isApproved', '==', true)
      .where('rating', '==', 5)
      .orderBy('createdAt', 'desc')
      .limit(3).get();
    const reviews = reviewsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    return [];
  }
});

// --- NEW: Function to get ALL reviews for the admin panel ---
export const getAllAdminReviews = cache(async () => {
  try {
    const reviewsSnapshot = await adminDb.collection('reviews').orderBy('createdAt', 'desc').get();
    return reviewsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id,
         ...data, 
         createdAt: data.createdAt.toDate().toISOString() 
        };
    });
  } catch (error) {
    console.error("Error fetching all reviews for admin:", error);
    return [];
  }
});

// --- NEW: Function to get ALL bookings for the admin panel ---
export const getAllAdminBookings = cache(async () => {
  try {
    const bookingsSnapshot = await adminDb.collection('bookings').orderBy('createdAt', 'desc').get();
    return bookingsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
        requestedDate: data.requestedDate.toDate().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching bookings for admin:", error);
    return [];
  }
});
// --- NEW FUNCTION to get review summary for a specific experience ---
export const getReviewSummary = cache(async (experienceId: string) => {
  try {
    if (!experienceId) {
      return { reviewCount: 0, averageRating: 0 };
    }

    const reviewsSnapshot = await adminDb
      .collection('reviews')
      .where('experienceId', '==', experienceId)
      .where('isApproved', '==', true)
      .get();

    if (reviewsSnapshot.empty) {
      return { reviewCount: 0, averageRating: 0 };
    }

    let totalRating = 0;
    reviewsSnapshot.forEach(doc => {
      totalRating += doc.data().rating;
    });

    const reviewCount = reviewsSnapshot.size;
    const averageRating = totalRating / reviewCount;

    return { 
      reviewCount, 
      averageRating: parseFloat(averageRating.toFixed(2))
    };
  } catch (error) {
    console.error("Error fetching review summary:", error);
    return { reviewCount: 0, averageRating: 0 }; // Return a default value on error
  }
});
export const getAllApprovedReviews = cache(async () => {
  try {
    console.log('Fetching all approved reviews from Firestore...');
    const reviewsSnapshot = await adminDb.collection('reviews')
      .where('isApproved', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
      
    const reviews = reviewsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
         createdAt: data.createdAt.toDate().toISOString(),
      };
    });
    return reviews as Review[];
  } catch (error) {
    console.error("Error fetching all approved reviews:", error);
    return [];
  }
});