'use client';

import React from 'react';
import { Box, Typography, Container, CircularProgress } from "@mui/material";
import { Article, ArticleTranslation } from "@/types/article";
import Image from "next/image";
import { format } from 'date-fns';

// --- TIPTAP IMPORTS ONLY ---
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import ProductExtension from '@/components/admin/editor/ProductExtension';

interface PostLayoutProps {
  article: Article;
  translation: ArticleTranslation;
}

// ------------------------------------------------------------------
// 1. THE VIEWER COMPONENT (Read-Only Editor)
// ------------------------------------------------------------------
const TipTapViewer = ({ content }: { content: any }) => {
  const editor = useEditor({
    editable: false, 
    immediatelyRender: false, 
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: true }), 
      ProductExtension, 
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none', 
        style: 'font-size: 1.1rem; line-height: 1.8; color: inherit; outline: none;'
      }
    }
  });

  if (!editor) {
    return <Box sx={{ py: 10, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  return <EditorContent editor={editor} />;
};

// ------------------------------------------------------------------
// 2. MAIN LAYOUT
// ------------------------------------------------------------------
export default function PostLayout({ article, translation }: PostLayoutProps) {
    // ▼▼▼ FIX: ROBUST DATE PARSING ▼▼▼
    let dateObj: Date;

    // 1. Check if it's a Firestore Timestamp (has .toDate())
    if (article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt) {
        dateObj = (article.createdAt as any).toDate();
    } 
    // 2. Check if it's already a JS Date object (Safe Cast for TS)
    else if ((article.createdAt as any) instanceof Date) {
        dateObj = article.createdAt as unknown as Date;
    } 
    // 3. Fallback: Parse string or number
    else {
        dateObj = new Date(article.createdAt as string | number);
    }
    
    const formattedDate = !isNaN(dateObj.getTime()) 
        ? format(dateObj, 'MMMM d, yyyy') 
        : '';
    // ▲▲▲

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <main className="flex-grow">
                <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
                    <article>
                        {/* HEADER */}
                        <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                            {translation.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                             <Box sx={{ ml: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {article.author || 'Editorial Team'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formattedDate}
                                </Typography>
                            </Box>
                        </Box>

                        {/* HERO IMAGE */}
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '16/9',
                            maxHeight: '500px',
                            borderRadius: 4,
                            overflow: 'hidden',
                            mb: 6,
                            boxShadow: 3
                        }}>
                            <Image
                                src={article.coverImage}
                                alt={translation.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                                sizes="(max-width: 768px) 100vw, 800px"
                            />
                        </Box>

                        {/* CONTENT RENDERER */}
                        <Box sx={{ 
                            '& h2': { fontSize: '1.8rem', fontWeight: 700, mt: 6, mb: 2 },
                            '& h3': { fontSize: '1.4rem', fontWeight: 600, mt: 4, mb: 2 },
                            '& ul, & ol': { mb: 3, pl: 4 },
                            '& li': { mb: 1 },
                            '& blockquote': { borderLeft: '4px solid', borderColor: 'primary.main', pl: 3, py: 1, my: 4, bgcolor: 'action.hover', fontStyle: 'italic' },
                            '& img': { borderRadius: 2, my: 4, maxWidth: '100%', height: 'auto' }
                        }}>
                            <TipTapViewer content={translation.content} />
                        </Box>
                    </article>
                </Container>
            </main>
        </Box>
    );
}