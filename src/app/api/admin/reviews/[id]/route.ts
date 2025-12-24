import { NextResponse as NextUpdateResponse } from 'next/server';
import { adminDb as adminDbReview } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
// 1. IMPORT THE AGGREGATION LOGIC
import { updateExperienceRating } from '@/lib/reviews-aggregation';

// This function handles approving a review
type Params = Promise<{ id: string }>;

export async function PUT(
  request: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const { isApproved } = await request.json();

    if (!id || typeof isApproved !== 'boolean') {
      return NextUpdateResponse.json({ error: 'Review ID and a boolean `isApproved` status are required' }, { status: 400 });
    }

    const reviewRef = adminDbReview.collection('reviews').doc(id);
    
    // 1. Update the review status
    await reviewRef.update({ isApproved: isApproved });

    // 2. Get the experience ID to recalculate stats
    const docSnap = await reviewRef.get();
    const experienceId = docSnap.data()?.experienceId;

    if (experienceId) {
       // 3. TRIGGER AGGREGATION (Recalculate Average & Count)
       await updateExperienceRating(experienceId);
       
       // 4. Refresh the page so users see the new star rating immediately
       revalidatePath(`/[locale]/experiences/${experienceId}`, 'page');
    }

    return NextUpdateResponse.json({ message: 'Review status updated and stats aggregated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error updating review status:", error);
    return NextUpdateResponse.json({ error: 'Failed to update review status' }, { status: 500 });
  }
}

// This function handles deleting a review
type DeleteParams = Promise<{ id: string }>;

export async function DELETE(
  request: Request,
  { params }: { params: DeleteParams }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextUpdateResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        const reviewRef = adminDbReview.collection('reviews').doc(id);

        // 1. GET EXPERIENCE ID BEFORE DELETING (Critical step!)
        // If we delete first, we lose the link to the parent experience.
        const docSnap = await reviewRef.get();
        const experienceId = docSnap.data()?.experienceId;

        // 2. Delete the review
        await reviewRef.delete();
        
        if (experienceId) {
            // 3. TRIGGER AGGREGATION (Recalculate to remove this rating)
            await updateExperienceRating(experienceId);
            
            // 4. Refresh cache
            revalidatePath(`/[locale]/experiences/${experienceId}`, 'page');
        }
        
        console.log(`✅ Successfully deleted review and updated aggregates: ${id}`);
        return NextUpdateResponse.json({ message: 'Review deleted and stats updated successfully' }, { status: 200 });

    } catch (error) {
        console.error("Error deleting review:", error);
        return NextUpdateResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}