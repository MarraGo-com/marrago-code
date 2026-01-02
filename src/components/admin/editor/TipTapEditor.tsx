// src/components/admin/editor/TipTapEditor.tsx
'use client';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import ProductExtension from './ProductExtension';
import ProductInserter from './ProductInserter';
import { compressAndUploadImage } from '@/utils/upload-helper';
import { Box, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Divider } from '@mui/material';
import { 
  FormatBold, FormatItalic, FormatListBulleted, FormatQuote, 
  AddPhotoAlternate, LocalOffer 
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';

// --- TOOLBAR ---
const MenuBar = ({ editor, onOpenProductModal }: { editor: any, onOpenProductModal: () => void }) => {
  const t = useTranslations('admin.editor');
  
  const addImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (file) {
        const url = await compressAndUploadImage(file, 'blog-content');
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  }, [editor]);

  if (!editor) return null;

  return (
    <Stack 
      direction="row" 
      spacing={1} 
      flexWrap="wrap" // 🟢 ALLOW WRAPPING ON MOBILE
      sx={{ 
        p: 1, 
        borderBottom: '1px solid', 
        borderColor: 'divider', 
        bgcolor: 'background.paper', 
        position: 'sticky', 
        top: 0, 
        zIndex: 10,
        gap: 1 // Gap for wrapped items
      }}
    >
        <ToggleButtonGroup size="small" exclusive>
          <ToggleButton value="bold" selected={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBold /></ToggleButton>
          <ToggleButton value="italic" selected={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalic /></ToggleButton>
        </ToggleButtonGroup>
        
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' } }} />
        
        <ToggleButtonGroup size="small" exclusive>
           <ToggleButton value="bulletList" selected={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulleted /></ToggleButton>
           <ToggleButton value="blockquote" selected={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><FormatQuote /></ToggleButton>
        </ToggleButtonGroup>
        
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' } }} />
        
        <Tooltip title={t('tooltips.uploadImage')}>
          <IconButton size="small" onClick={addImage}><AddPhotoAlternate color="primary" /></IconButton>
        </Tooltip>
        
        <Tooltip title={t('tooltips.insertCard')}>
            <IconButton 
                size="small" 
                onClick={onOpenProductModal} 
                sx={{ bgcolor: 'secondary.light', color: 'white', '&:hover': { bgcolor: 'secondary.main' } }}
            >
                <LocalOffer fontSize="small" />
            </IconButton>
        </Tooltip>
    </Stack>
  );
};

// --- MAIN EDITOR ---
interface TipTapEditorProps {
  content: any;
  onChange: (json: any) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const t = useTranslations('admin.editor');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null); 
  const updateCallbackRef = useRef<((data: any) => void) | null>(null);

  const editor = useEditor({
    immediatelyRender: false, 
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: true }),
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: t('placeholder') }),
      ProductExtension,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
        style: 'min-height: 400px; padding: 24px; outline: none; font-size: 1.1rem; line-height: 1.8;'
      }
    }
  });

  useEffect(() => {
    if (editor) {
        const storage = editor.storage as any;
        if (storage.productCard) {
            storage.productCard.onEdit = (currentAttrs: any, updateFn: (newAttrs: any) => void) => {
                setEditingData(currentAttrs);
                updateCallbackRef.current = updateFn;
                setDialogOpen(true);
            };
        }
    }
  }, [editor]);

  const handleProductSave = (data: any) => {
    if (editingData && updateCallbackRef.current) {
        updateCallbackRef.current(data);
    } else {
        editor?.chain().focus().insertContent({ type: 'productCard', attrs: data }).run();
    }
    setDialogOpen(false);
    setEditingData(null);
    updateCallbackRef.current = null;
  };

  useEffect(() => {
    if (editor && content && editor.isEmpty) {
         setTimeout(() => {
             if (editor.isEmpty) editor.commands.setContent(content);
         }, 0);
    }
  }, [content, editor]);

  return (
    <Box 
      sx={{ 
        border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper',
        '& .ProseMirror img': { maxWidth: '100%', maxHeight: '400px', height: 'auto', borderRadius: '8px', margin: '1rem auto', display: 'block', objectFit: 'contain' }
      }}
    >
      <MenuBar editor={editor} onOpenProductModal={() => { setEditingData(null); setDialogOpen(true); }} />
      <EditorContent editor={editor} />
      
      <ProductInserter 
        open={dialogOpen} 
        onClose={() => { setDialogOpen(false); setEditingData(null); }}
        onInsert={handleProductSave}
        initialData={editingData} 
      />
    </Box>
  );
}