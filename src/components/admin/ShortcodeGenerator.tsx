'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Paper, Stack, IconButton, Tooltip, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ShortcodeGenerator() {
  const [values, setValues] = useState({
    title: '',
    price: '',
    link: '/experiences/',
    image: '/images/',
    badge: ''
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
    setCopied(false);
  };

  const generateCode = () => {
    if (!values.title) return "Enter a title to generate code...";
    
    const parts = [
      `title=${values.title}`,
      `price=${values.price || '0'}`,
      `link=${values.link}`,
      `image=${values.image}`
    ];

    if (values.badge) parts.push(`badge=${values.badge}`);

    return `[[PRODUCT: ${parts.join(' | ')} ]]`;
  };

  const handleCopy = () => {
    if (!values.title) return;
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper sx={{ p: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        🛍️ Product Card Generator
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Fill in the details below, copy the code, and paste it into the "Article Content" box above.
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField 
          label="Product Title (e.g., Airport Transfer)" 
          size="small" 
          fullWidth 
          value={values.title} 
          onChange={handleChange('title')} 
        />
        <Stack direction="row" spacing={2}>
            <TextField 
              label="Price (€)" 
              size="small" 
              type="number" 
              sx={{ width: 120 }} 
              value={values.price} 
              onChange={handleChange('price')} 
            />
            <TextField 
              label="Badge (Optional)" 
              placeholder="e.g. Best Seller"
              size="small" 
              fullWidth
              value={values.badge} 
              onChange={handleChange('badge')} 
            />
        </Stack>
        <TextField 
          label="Link URL" 
          size="small" 
          fullWidth 
          value={values.link} 
          onChange={handleChange('link')} 
        />
        <TextField 
          label="Image URL" 
          size="small" 
          fullWidth 
          value={values.image} 
          onChange={handleChange('image')} 
        />
      </Stack>

      {/* RESULT BOX */}
      <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2, position: 'relative', border: '1px dashed', borderColor: 'text.secondary' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>
          GENERATED CODE:
        </Typography>
        <Typography 
            component="code" 
            sx={{ 
                fontFamily: 'monospace', 
                fontSize: '0.85rem', 
                color: 'primary.main',
                wordBreak: 'break-all',
                display: 'block',
                pr: 4
            }}
        >
            {generateCode()}
        </Typography>

        <Tooltip title={copied ? "Copied!" : "Copy to Clipboard"}>
            <IconButton 
                onClick={handleCopy} 
                sx={{ position: 'absolute', top: 8, right: 8 }}
                color={copied ? "success" : "default"}
            >
                <ContentCopyIcon fontSize="small" />
            </IconButton>
        </Tooltip>
      </Box>

      {copied && (
        <Alert severity="success" sx={{ mt: 2, py: 0 }}>
            Code copied! Now paste it above.
        </Alert>
      )}
    </Paper>
  );
}