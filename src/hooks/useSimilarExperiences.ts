'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
// Ensure we import 'db' consistently like in CreateExperience
import { firestore as db } from '@/lib/firebase'; 
import { Experience } from '@/types/experience';

export function useSimilarExperiences(currentId: string, locationId: string) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      // Safety check: If locationId is missing, stop.
      if (!locationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const experiencesRef = collection(db, 'experiences');

        // Query: Same Location + Published Status
        // We fetch 5 items so if we filter out the current one, we still have 4 left.
        const q = query(
            experiencesRef,
            where('locationId', '==', locationId),
            where('status', '==', 'published'), 
            limit(5)
        );

        const snapshot = await getDocs(q);
        const results: Experience[] = [];

        snapshot.forEach((doc) => {
          // Client-side exclusion of the current tour
          if (doc.id !== currentId) {
            results.push({ id: doc.id, ...doc.data() } as Experience);
          }
        });

        // Ensure we strictly return max 4 items
        setExperiences(results.slice(0, 4));
        
      } catch (error) {
        console.error("Failed to fetch similar experiences:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilar();
  }, [currentId, locationId]);

  return { experiences, loading };
}