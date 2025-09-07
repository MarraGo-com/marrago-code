// /src/themes/default/blog/PostLayout.tsx
'use client';

import React from 'react';
import { Box, Typography, Container } from "@mui/material";
import { Article, ArticleTranslation } from "@/types/article";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';

export interface PostLayoutProps {
  article: Article;
  translation: ArticleTranslation | undefined;
}

export default function PostLayout({ article, translation }: PostLayoutProps) {
    const formattedDate = article.createdAt ? format(new Date(article.createdAt), 'MMMM d, yyyy') : '';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <main className="flex-grow">
                <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
                    <article>
                        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
                            {translation?.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            Published by {article.author} on {formattedDate}
                        </Typography>
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '16/9',
                            maxHeight: '500px',
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: 4,
                        }}>
                            <Image
                                src={article.coverImage}
                                alt={translation?.title ||'cover image'}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                                sizes="(max-width: 768px) 100vw, 768px"
                            />
                        </Box>
                        <Box sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {translation?.content}
                            </ReactMarkdown>
                        </Box>
                    </article>
                </Container>
            </main>
        </Box>
    );
}