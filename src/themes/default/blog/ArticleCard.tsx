// -------------------------------------------------------------------------
// 2. UPDATED FILE: /src/components/blog/ArticleCard.tsx
// This component now uses our new helper function to display a clean summary.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { createSummary } from '@/lib/utils'; // <-- Import our new helper function
import { Article } from '@/types/article';



export default function ArticleCard({ article }: { article: Article }) {
  const locale = useLocale();
  const translation = article.translations?.[locale] || article.translations?.en;
  
  const formattedDate = new Date(article.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Use the helper function to create a clean summary
  const summary = createSummary(translation?.content || '');

  return (
    <Card component={Link} href={`/blog/${article.slug}`} sx={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={article.coverImage}
        alt={translation?.title || 'Article image'}
        sx={{ height: 200, objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formattedDate}
        </Typography>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {translation?.title || 'Title Not Available'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {summary} {/* <-- Display the clean summary here */}
        </Typography>
      </CardContent>
    </Card>
  );
}