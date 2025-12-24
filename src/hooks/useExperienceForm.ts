// /src/hooks/useExperienceForm.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { 
  Experience, 
  GalleryImage, 
  Translation, 
  TimelineStep, 
  DurationUnit 
} from '@/types/experience';

// Helper to create an empty translation object
const emptyTranslation: Translation = { 
  title: '', 
  description: '', 
  shortDescription: '', 
  highlights: '', 
  included: '', 
  notIncluded: '', 
  importantInfo: '', 
  itinerary: '', 
  program: [],   
  faqs: [] 
};

// --- UPDATED INITIAL STATE (Strict Types) ---
const initialFormData = {
  price: { amount: '', currency: 'EUR', prefix: 'from' },
  locationId: '',
  coverImage: '',
  
  // 1. UPDATED: Tags are now an Array
  tags: [] as string[], 

  maxGuests: undefined as number | undefined,
  tourCode: '',
  
  // 2. UPDATED: Languages are now an Array
  languages: [] as string[], 

  startTimes: '', // Still comma-separated string for now (as per your form)
  
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,

  // 3. UPDATED: Duration split into Value + Unit
  durationValue: undefined as number | undefined,
  durationUnit: 'hours' as DurationUnit,

  // --- PRO FIELDS ---
  scarcity: { 
    isLikelyToSellOut: false, 
    spotsLeft: undefined as number | undefined 
  },
  bookingPolicy: { 
    cancellationHours: 24, 
    isPayLater: true, 
    instantConfirmation: true 
  },
  features: { 
    mobileTicket: true, 
    pickupIncluded: false 
  },

  translations: {
    en: { ...emptyTranslation },
    fr: { ...emptyTranslation },
    es: { ...emptyTranslation }
  }
};

type FormLanguageTab = 'en' | 'fr' | 'es';

export function useExperienceForm(initialExperience: Experience | null) {
  const [formData, setFormData] = useState(initialFormData);
  const [initialGalleryImages, setInitialGalleryImages] = useState<GalleryImage[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [newGalleryImageFiles, setNewGalleryImageFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [currentTab, setCurrentTab] = useState<FormLanguageTab>('en');

  // ▼▼▼ UPDATED DATA LOADING LOGIC ▼▼▼
  useEffect(() => {
    if (initialExperience) {
      const newFormState = {
          // Base fields
          locationId: initialExperience.locationId || '',
          coverImage: initialExperience.coverImage || '',
          
          // 4. MAPPING NEW STRICT FIELDS
          durationValue: initialExperience.durationValue,
          durationUnit: initialExperience.durationUnit || 'hours',
          
          tags: initialExperience.tags || [], // No more .join()
          languages: initialExperience.languages || [], // No more .join()

          // Price
          price: initialExperience.price ? { 
              ...initialExperience.price, 
              amount: initialExperience.price.amount !== undefined ? String(initialExperience.price.amount) : '' 
          } : initialFormData.price,
          
          startTimes: initialExperience.startTimes?.join(', ') || '',

          // Optionals
          maxGuests: initialExperience.maxGuests,
          latitude: initialExperience.latitude,
          longitude: initialExperience.longitude,
          tourCode: initialExperience.tourCode || '',

          // Pro Fields
          scarcity: {
            isLikelyToSellOut: initialExperience.scarcity?.isLikelyToSellOut ?? initialFormData.scarcity.isLikelyToSellOut,
            spotsLeft: initialExperience.scarcity?.spotsLeft ?? initialFormData.scarcity.spotsLeft
          },
          bookingPolicy: {
            cancellationHours: initialExperience.bookingPolicy?.cancellationHours ?? initialFormData.bookingPolicy.cancellationHours,
            isPayLater: initialExperience.bookingPolicy?.isPayLater ?? initialFormData.bookingPolicy.isPayLater,
            instantConfirmation: initialExperience.bookingPolicy?.instantConfirmation ?? initialFormData.bookingPolicy.instantConfirmation
          },
          features: {
            mobileTicket: initialExperience.features?.mobileTicket ?? initialFormData.features.mobileTicket,
            pickupIncluded: initialExperience.features?.pickupIncluded ?? initialFormData.features.pickupIncluded
          },
          
          // Translations
          translations: {
              en: {
                ...emptyTranslation, ...initialExperience.translations?.en,
                faqs: initialExperience.translations?.en?.faqs || [],
                program: initialExperience.translations?.en?.program || []
              },
              fr: {
                ...emptyTranslation, ...initialExperience.translations?.fr,
                faqs: initialExperience.translations?.fr?.faqs || [],
                program: initialExperience.translations?.fr?.program || []
              },
              es: {
                ...emptyTranslation, ...initialExperience.translations?.es,
                faqs: initialExperience.translations?.es?.faqs || [],
                program: initialExperience.translations?.es?.program || []
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

  // --- Change Handlers ---
  const handleNestedChange = useCallback((path: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const checked = type === 'checkbox' && 'checked' in event.target ? event.target.checked : false;
    setFormData(prev => {
        const newState = JSON.parse(JSON.stringify(prev));
        let currentLevel = newState;
        const parts = path.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (i === parts.length - 1) {
                currentLevel[parts[i]][name] = type === 'checkbox' ? checked : value;
            } else {
                currentLevel = currentLevel[parts[i]];
            }
        }
        return newState;
    });
  }, []);

  // --- FAQ Handlers ---
  const handleAddFaq = (lang: FormLanguageTab) => {
    setFormData(prev => {
      const newState = { ...prev };
      const currentFaqs = newState.translations[lang].faqs || [];
      newState.translations[lang].faqs = [...currentFaqs, { question: '', answer: '' }];
      return newState;
    });
  };

  const handleFaqChange = (lang: FormLanguageTab, index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => {
      const newState = { ...prev };
      const newFaqs = [...(newState.translations[lang].faqs || [])];
      newFaqs[index][field] = value;
      newState.translations[lang].faqs = newFaqs;
      return newState;
    });
  };

  const handleRemoveFaq = (lang: FormLanguageTab, index: number) => {
    setFormData(prev => {
      const newState = { ...prev };
      const currentFaqs = newState.translations[lang].faqs || [];
      newState.translations[lang].faqs = currentFaqs.filter((_, i) => i !== index);
      return newState;
    });
  };

  // --- TIMELINE HANDLERS ---
  const handleAddTimelineStep = (lang: FormLanguageTab) => {
    setFormData(prev => {
      const newState = { ...prev };
      const currentProgram = newState.translations[lang].program || [];
      const newStep: TimelineStep = { 
        title: '', 
        type: 'stop', 
        duration: '', 
        admission: 'free',
        description: ''
      };
      newState.translations[lang].program = [...currentProgram, newStep];
      return newState;
    });
  };

  const handleTimelineStepChange = (lang: FormLanguageTab, index: number, field: keyof TimelineStep, value: any) => {
    setFormData(prev => {
      const newState = { ...prev };
      const newProgram = [...(newState.translations[lang].program || [])];
      newProgram[index] = { ...newProgram[index], [field]: value };
      newState.translations[lang].program = newProgram;
      return newState;
    });
  };

  const handleRemoveTimelineStep = (lang: FormLanguageTab, index: number) => {
    setFormData(prev => {
      const newState = { ...prev };
      const currentProgram = newState.translations[lang].program || [];
      newState.translations[lang].program = currentProgram.filter((_, i) => i !== index);
      return newState;
    });
  };

  // --- Image Handlers ---
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
    handleRemoveFaq,
    handleAddTimelineStep,
    handleTimelineStepChange,
    handleRemoveTimelineStep
  };
}