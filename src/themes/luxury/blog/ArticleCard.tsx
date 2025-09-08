// /src/themes/luxury/blog/ArticleCard.tsx
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Article } from '@/types/article';
import Image from 'next/image';
import { format } from 'date-fns';

export interface ArticleCardProps {
  article: Article;
  isFeatured?: boolean;
  // The 'isFeatured' prop is no longer needed for this component
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const locale = useLocale();
  // Safely access translations
  const translation = article.translations?.[locale as 'en' | 'fr' | 'ar'] || article.translations?.en;
  const title = translation?.title || 'Untitled Article';
  
  const formattedDate = article.createdAt ? format(new Date(article.createdAt), 'MMMM d, yyyy') : '';

  return (
    <Link href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        className="group"
        sx={{
          width: '100%',
          display: 'block',
          height: '100%', // Ensure cards in a row have the same height
        }}
      >
        {/* Image with a hover effect */}
        <Box sx={{ 
          position: 'relative', 
          height: 250, 
          overflow: 'hidden',
          borderRadius: 2,
          mb: 2.5
        }}>
          <Image
            src={article.coverImage}
            alt={title}
            fill
            loading='lazy'
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw"
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </Box>
        
        {/* Text content */}
        <Box sx={{ px: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 'bold',
              lineHeight: 1.4,
              mt: 1,
              // This will automatically use the theme's heading font
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}