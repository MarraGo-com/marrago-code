// /src/themes/luxury/blog/PostLayout.tsx
'use client';

import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import { Article, ArticleTranslation } from '@/types/article';
import Image from 'next/image';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface PostLayoutProps {
  article: Article;
  translation: ArticleTranslation | undefined;
}

export default function PostLayout({ article, translation }: PostLayoutProps) {
  const formattedDate = article.createdAt ? format(new Date(article.createdAt), 'MMMM d, yyyy') : '';

  return (
    <Box sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      {/* 1. Full-width, high-impact cover image */}
      <Box sx={{ position: 'relative', width: '100%', height: '60vh', minHeight: '400px' }}>
        <Image
          src={article.coverImage}
          alt={translation?.title || 'cover image'}
          fill
          priority // This image is above the fold, so prioritize loading
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
      </Box>

      {/* 2. Centered, elegant content container */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ maxWidth: '750px', mx: 'auto', textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            {translation?.title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              color: 'text.secondary',
              mb: 4,
            }}
          >
            {article.author && (
              <>
                <Typography variant="body1" component="span" sx={{ fontWeight: 500 }}>
                  {article.author}
                </Typography>
                <Divider orientation="vertical" flexItem />
              </>
            )}
            <Typography variant="body1" component="span">
              {formattedDate}
            </Typography>
          </Box>
        </Box>
        
        {/* 3. The main article content, styled for readability */}
        <Box
          className="markdown-content"
          sx={{
            mt: 6,
            fontSize: '1.2rem',
            lineHeight: 1.8,
            color: 'text.secondary',
            '& h2, & h3': {
                color: 'text.primary',
                fontWeight: 'bold',
                marginTop: '2.5em',
                marginBottom: '1em',
            },
            '& p': {
                marginBottom: '1.5em',
            },
            '& img': {
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                marginTop: '2em',
                marginBottom: '2em',
                maxWidth: '100%',
                height: 'auto',
            },
            '& a': {
                color: 'primary.main',
                textDecoration: 'underline',
            }
          }}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {translation?.content}
            </ReactMarkdown>
        </Box>
      </Container>
    </Box>
  );
}