// -------------------------------------------------------------------------
// 5. UPDATED FILE: /src/components/ui/ExperienceCard.tsx
// This component is now a simple "switcher" that chooses which card style to render.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { Experience } from '@/types/experience';
import ImmersiveExperienceCard from '../cards/ImmersiveExperienceCard';
import ClassicExperienceCard from '../cards/ClassicExperienceCard';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  // Read the card style from the central configuration file
  const cardStyle = siteConfig.theme.cardStyle;

  // Render the appropriate card component based on the configuration
  if (cardStyle === 'classic') {
    return <ClassicExperienceCard experience={experience} />;
  }

  // Default to the immersive style
  return <ImmersiveExperienceCard experience={experience} />;
}