// /src/themes/adventure/blog/ArticleCard.tsx
'use client';

import React from 'react';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Article } from '@/types/article';
import { format } from 'date-fns';

export interface ArticleCardProps {
  article: Article;
  isFeatured: boolean;
}

export default function ArticleCard({ article, isFeatured }: ArticleCardProps) {
  const locale = useLocale();
  const translation = article.translations[locale as 'en' | 'fr' | 'ar'] || article.translations.en;
  const formattedDate = article.createdAt ? format(new Date(article.createdAt), 'MMM d, yyyy') : '';

  // Main featured article style
  if (isFeatured) {
    return (
      <Card 
        component={Link}
        href={`/blog/${article.slug}`}
        className="group"
        sx={{ textDecoration: 'none', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 5, borderRadius: 3 }}
      >
        <CardMedia
          component="img"
          sx={{ width: { md: '50%' }, height: 350, objectFit: 'cover' }}
          image={article.coverImage}
          alt={translation?.title || ''}
        />
        <CardContent sx={{ width: { md: '50%' }, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">{formattedDate}</Typography>
          <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', my: 1 }}>
            {translation?.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            By {article.author}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Secondary article style (more compact)
  return (
     <Card 
        component={Link}
        href={`/blog/${article.slug}`}
        className="group"
        sx={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 3 }}
      >
        <CardMedia
          component="img"
          height="200"
          image={article.coverImage}
          alt={translation?.title || ''}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="caption" color="text.secondary">{formattedDate}</Typography>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            {translation?.title}
          </Typography>
        </CardContent>
      </Card>
  );
}