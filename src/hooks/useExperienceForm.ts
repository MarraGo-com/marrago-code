// /src/hooks/useExperienceForm.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Experience, GalleryImage, Translation } from '@/types/experience';

// Helper to create an empty translation object
const emptyTranslation: Translation = { 
  title: '', 
  description: '', 
  shortDescription: '', // <--- NEW FIELD INITIALIZATION
  highlights: '', 
  included: '', 
  notIncluded: '', 
  importantInfo: '', 
  itinerary: '',
  faqs: [] 
};

// The initial state
const initialFormData = {
  price: { amount: '', currency: 'EUR', prefix: 'from' },
  locationId: '',
  coverImage: '',
  tags: '',
  maxGuests: undefined as number | undefined,
  tourCode: '',
  languages: '', 
  startTimes: '',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  duration: '', // Added duration to base form data
  translations: {
    en: { ...emptyTranslation },
    fr: { ...emptyTranslation },
    es: { ...emptyTranslation }
  }
};

type LanguageCode = 'en' | 'fr' | 'es';

export function useExperienceForm(initialExperience: Experience | null) {
  const [formData, setFormData] = useState(initialFormData);
  const [initialGalleryImages, setInitialGalleryImages] = useState<GalleryImage[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [newGalleryImageFiles, setNewGalleryImageFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [currentTab, setCurrentTab] = useState<LanguageCode>('en');

  // ▼▼▼ THE DATA LOADING LOGIC ▼▼▼
  useEffect(() => {
    if (initialExperience) {
      const newFormState = {
          // Explicitly map base fields
          locationId: initialExperience.locationId || '',
          coverImage: initialExperience.coverImage || '',
          duration: initialExperience.duration || '',
          
          // Handle Price conversion to string for input
          price: initialExperience.price ? { 
              ...initialExperience.price, 
              amount: initialExperience.price.amount !== undefined ? String(initialExperience.price.amount) : '' 
          } : initialFormData.price,
          
          // Handle Arrays -> Comma-separated strings
          tags: initialExperience.tags?.join(', ') || '',
          languages: initialExperience.languages?.join(', ') || '',
          startTimes: initialExperience.startTimes?.join(', ') || '',

          // Handle optional numbers & strings
          maxGuests: initialExperience.maxGuests,
          latitude: initialExperience.latitude,
          longitude: initialExperience.longitude,
          tourCode: initialExperience.tourCode || '',
          
          // Handle complex nested translations
          translations: {
              en: {
                ...emptyTranslation, ...initialExperience.translations?.en,
                faqs: initialExperience.translations?.en?.faqs || []
              },
              fr: {
                ...emptyTranslation, ...initialExperience.translations?.fr,
                faqs: initialExperience.translations?.fr?.faqs || []
              },
              es: {
                ...emptyTranslation, ...initialExperience.translations?.es,
                faqs: initialExperience.translations?.es?.faqs || []
              }
          }
      };
      setFormData(newFormState);
      setInitialGalleryImages(initialExperience.galleryImages || []);
    } else {
      setFormData(initialFormData);
      setInitialGalleryImages([]);
    }
    setCoverImageFile(null);
    setNewGalleryImageFiles([]);
  }, [initialExperience]);

  // --- No changes below this line ---
  const handleNestedChange = useCallback((path: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => {
        const newState = JSON.parse(JSON.stringify(prev));
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

  const handleAddFaq = (lang: LanguageCode) => {
    setFormData(prev => {
      const newState = { ...prev };
      const currentFaqs = newState.translations[lang].faqs || [];
      newState.translations[lang].faqs = [...currentFaqs, { question: '', answer: '' }];
      return newState;
    });
  };

  const handleFaqChange = (lang: LanguageCode, index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => {
      const newState = { ...prev };
      const newFaqs = [...(newState.translations[lang].faqs || [])];
      newFaqs[index][field] = value;
      newState.translations[lang].faqs = newFaqs;
      return newState;
    });
  };

  const handleRemoveFaq = (lang: LanguageCode, index: number) => {
    setFormData(prev => {
      const newState = { ...prev };
      const currentFaqs = newState.translations[lang].faqs || [];
      newState.translations[lang].faqs = currentFaqs.filter((_, i) => i !== index);
      return newState;
    });
  };

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
    setFormData,
    handleAddFaq,
    handleFaqChange,
    handleRemoveFaq
  };
}