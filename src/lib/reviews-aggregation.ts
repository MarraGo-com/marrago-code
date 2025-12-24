import { adminDb } from '@/lib/firebase-admin';

/**
 * Recalculates the average rating and review count for an experience
 * and updates the experience document in Firestore.
 * * Call this function whenever a review is:
 * 1. Approved
 * 2. Deleted
 * 3. Created (if auto-approved)
 */
export async function updateExperienceRating(experienceId: string) {
  try {
    console.log(`⚡ Updating aggregates for experience: ${experienceId}`);

    // 1. Fetch all APPROVED reviews for this experience
    const reviewsSnapshot = await adminDb
      .collection('reviews')
      .where('experienceId', '==', experienceId)
      .where('isApproved', '==', true)
      .get();

    const totalReviews = reviewsSnapshot.size;
    let totalRating = 0;

    // 2. Calculate the Sum
    reviewsSnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure we handle strings or numbers safely
      const rating = Number(data.rating) || 0;
      totalRating += rating;
    });

    // 3. Calculate Average (avoid division by zero)
    const averageRating = totalReviews > 0 
      ? Number((totalRating / totalReviews).toFixed(1)) // Round to 1 decimal (e.g. 4.8)
      : 0;

    // 4. Update the Experience Document
    await adminDb.collection('experiences').doc(experienceId).update({
      rating: averageRating,
      reviewCount: totalReviews
    });

    console.log(`✅ Updated ${experienceId}: ${averageRating} stars (${totalReviews} reviews)`);
    return { rating: averageRating, reviewCount: totalReviews };

  } catch (error) {
    console.error(`🔥 Failed to aggregate ratings for ${experienceId}:`, error);
    throw error; // Re-throw so the API knows it failed
  }
}