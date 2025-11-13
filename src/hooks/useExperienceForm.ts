// -------------------------------------------------------------------------
// 1. UPDATED FILE: /src/hooks/useExperienceForm.ts
// This hook is now upgraded to handle the 'tags' field.
// -------------------------------------------------------------------------
'use client';

import { useState, useEffect, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Experience, GalleryImage } from '@/types/experience';
// ...removed unused import SelectChangeEvent...

// The initial state now includes a 'tags' property
const initialFormData = {
  price: { amount: '', currency: 'EUR', prefix: 'from' },
  locationId: '',
  coverImage: '',
  tags: '', // ITEN: Added tags as a comma-separated string
  translations: {
    en: { title: '', description: '', included: '', notIncluded: '', importantInfo: '', itinerary: '' },
    fr: { title: '', description: '', included: '', notIncluded: '', importantInfo: '', itinerary: '' },
    es: { title: '', description: '', included: '', notIncluded: '', importantInfo: '', itinerary: '' } // <-- ADDED THIS LINE
  }
};

export function useExperienceForm(initialExperience: Experience | null) {
  const [formData, setFormData] = useState(initialFormData);
  const [initialGalleryImages, setInitialGalleryImages] = useState<GalleryImage[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [newGalleryImageFiles, setNewGalleryImageFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [currentTab, setCurrentTab] = useState<'en' | 'fr'| 'es'>('en');

  useEffect(() => {
    if (initialExperience) {
      const { galleryImages, ...restOfExperience } = initialExperience;
      
      setFormData({
          ...initialFormData,
          ...restOfExperience,
          price: initialExperience.price ? { ...initialExperience.price, amount: String(initialExperience.price.amount) } : initialFormData.price,
          // ITEN: Convert the tags array from Firestore into a comma-separated string for the form
          tags: initialExperience.tags?.join(', ') || '',
          translations: {
              en: {
                title: initialExperience.translations?.en?.title ?? '',
                description: initialExperience.translations?.en?.description ?? '',
                included: initialExperience.translations?.en?.included ?? '',
                notIncluded: initialExperience.translations?.en?.notIncluded ?? '',
                importantInfo: initialExperience.translations?.en?.importantInfo ?? '',
                itinerary: initialExperience.translations?.en?.itinerary ?? '',
              },
              fr: {
                title: initialExperience.translations?.fr?.title ?? '',
                description: initialExperience.translations?.fr?.description ?? '',
                included: initialExperience.translations?.fr?.included ?? '',
                notIncluded: initialExperience.translations?.fr?.notIncluded ?? '',
                importantInfo: initialExperience.translations?.fr?.importantInfo ?? '',
                itinerary: initialExperience.translations?.fr?.itinerary ?? '',
              },
              es: { // <-- ADDED THIS ENTIRE OBJECT
              title: initialExperience.translations?.es?.title ?? '',
              description: initialExperience.translations?.es?.description ?? '',
              included: initialExperience.translations?.es?.included ?? '',
              notIncluded: initialExperience.translations?.es?.notIncluded ?? '',
              importantInfo: initialExperience.translations?.es?.importantInfo ?? '',
              itinerary: initialExperience.translations?.es?.itinerary ?? '',
            }
          }
      });

      setInitialGalleryImages(galleryImages || []);
    } else {
      setFormData(initialFormData);
      setInitialGalleryImages([]);
    }
    setCoverImageFile(null);
    setNewGalleryImageFiles([]);
  }, [initialExperience]);

  const handleNestedChange = useCallback((path: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => {
        const newState = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid mutation issues
        let currentLevel = newState;
        const parts = path.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (i === parts.length - 1) {
                currentLevel[parts[i]][name] = value;
            } else {
                currentLevel = currentLevel[parts[i]];
            }
        }
        return newState;
    });
  }, []);

  const handleCoverImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' });
      setCoverImageFile(compressedFile);
    } catch(e) {
      console.error("Cover image compression failed:", e);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleGalleryImagesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsCompressing(true);
    try {
      const compressedFiles = await Promise.all(
        Array.from(files).map(file => imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/webp' }))
      );
      setNewGalleryImageFiles(prev => [...prev, ...compressedFiles]);
    } catch (e) {
      console.error("Gallery image compression failed:", e);
    } finally {
      setIsCompressing(false);
    }
  };

  const removeInitialGalleryImage = (pathToRemove: string) => {
    setInitialGalleryImages(prev => prev.filter(img => img.path !== pathToRemove));
  };

  const removeNewGalleryImage = (fileName: string) => {
    setNewGalleryImageFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const resetForm = () => {
      setFormData(initialFormData);
      setInitialGalleryImages([]);
      setCoverImageFile(null);
      setNewGalleryImageFiles([]);
      setCurrentTab('en');
  };

  return {
    formData,
    initialGalleryImages,
    coverImageFile,
    newGalleryImageFiles,
    isCompressing,
    currentTab,
    setCurrentTab,
    handleNestedChange,
    handleCoverImageChange,
    handleGalleryImagesChange,
    removeInitialGalleryImage,
    removeNewGalleryImage,
    resetForm,
    setFormData
  };
};