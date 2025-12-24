// src/components/admin/editor/ProductExtension.tsx
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { Box, Typography, Chip, IconButton, Card, Button } from '@mui/material';
import { Edit as EditIcon, ArrowForward, LocalActivity, Star } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';

// --- THE SMART COMPONENT ---
const ProductCardComponent = (props: any) => {
  const { title, price, image, badge, link } = props.node.attrs;
  
  // 🟢 MAGICAL CHECK: Are we in the Admin Panel or Public Blog?
  const isEditable = props.editor.isEditable;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const storage = props.editor.storage as any;
    if (props.editor && storage.productCard?.onEdit) {
        storage.productCard.onEdit(props.node.attrs, (newAttrs: any) => {
            props.updateAttributes(newAttrs);
        });
    }
  };

  return (
    <NodeViewWrapper className="product-card-wrapper">
      <Card 
        elevation={4} 
        sx={{ 
            position: 'relative', display: 'flex', overflow: 'hidden', my: 4, 
            borderRadius: 4, maxWidth: 700, mx: 'auto', bgcolor: 'background.paper',
            transition: 'all 0.3s ease',
            border: '1px solid', borderColor: 'divider',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, borderColor: 'primary.main' },
            '&:hover .edit-btn': { opacity: 1, transform: 'scale(1)' }
        }}
      >
        {/* 🟢 ADMIN ONLY: Edit Pencil */}
        {isEditable && (
            <IconButton 
                className="edit-btn"
                onClick={handleEdit}
                onMouseDown={(e) => e.preventDefault()} 
                sx={{
                    position: 'absolute', top: 12, right: 12, bgcolor: 'white', color: 'primary.main',
                    zIndex: 20, opacity: 0, transform: 'scale(0.8)', transition: 'all 0.2s', boxShadow: 3,
                    '&:hover': { bgcolor: 'primary.main', color: 'white' }
                }}
            >
                <EditIcon fontSize="small" />
            </IconButton>
        )}

        {/* IMAGE SIDE */}
        <Box sx={{ width: '40%', minWidth: 200, position: 'relative' }}>
<Image 
  src={image || '/images/placeholder.jpg'} 
  alt={title} 
  fill 
  style={{ objectFit: 'cover' }}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)' }} />
             {badge && (
                <Chip 
                    label={badge} size="small" color="secondary" icon={<Star style={{ fontSize: 14 }} />}
                    sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 'bold', boxShadow: 2, backdropFilter: 'blur(4px)' }} 
                />
             )}
        </Box>

        {/* CONTENT SIDE */}
        <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, opacity: 0.7 }}>
                <LocalActivity fontSize="inherit" color="primary" />
                <Typography variant="caption" fontWeight="bold" color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Experience</Typography>
            </Box>

            <Typography variant="h5" fontWeight="800" sx={{ mb: 1, lineHeight: 1.2, fontFamily: 'serif' }}>{title}</Typography>

            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2 }}>
            <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Starting from
                    </Typography>
                    
                    {/* 🟢 CHANGED COLOR HERE */}
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 'bold',
                            color: '#ff9800', // Bright Orange (Visible on Dark & Light)
                            // OR use: color: 'primary.main' (if your primary is bright)
                            // OR use: color: 'text.primary' (White in dark mode, Black in light)
                        }}
                    >
                        €{price}
                    </Typography>
                </Box>

                {/* 🟢 PUBLIC: Real Link / ADMIN: Fake Button */}
                {isEditable ? (
                    <Button variant="contained" color="primary" endIcon={<ArrowForward />} size="small" sx={{ borderRadius: 20, px: 3, textTransform: 'none', fontWeight: 'bold' }}>
                        Book Now
                    </Button>
                ) : (
                    <Link href={link || '#'} passHref>
                        <Button variant="contained" color="primary" endIcon={<ArrowForward />} size="small" sx={{ borderRadius: 20, px: 3, textTransform: 'none', fontWeight: 'bold' }}>
                            Book Now
                        </Button>
                    </Link>
                )}
            </Box>
        </Box>
      </Card>
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: 'productCard', 
  group: 'block',
  atom: true, 
  addAttributes() {
    return {
      title: { default: 'Experience Title' },
      price: { default: 0 },
      image: { default: '' },
      link: { default: '' },
      badge: { default: '' },
    };
  },
  addStorage() { return { onEdit: null }; },
  parseHTML() { return [{ tag: 'product-card' }]; },
  renderHTML({ HTMLAttributes }) { return ['product-card', mergeAttributes(HTMLAttributes)]; },
  addNodeView() { return ReactNodeViewRenderer(ProductCardComponent); },
});