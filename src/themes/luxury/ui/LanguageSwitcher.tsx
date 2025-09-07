// /src/themes/luxury/ui/LanguageSwitcher.tsx
'use client';

// --- EDIT 1: Import the correct event type from Material-UI ---
import { Select, MenuItem, FormControl, InputAdornment, SelectChangeEvent } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher({ textColor, fontSize }: { textColor: string, fontSize: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
//  const theme = useTheme();

  // --- EDIT 2: Use the correct SelectChangeEvent type ---
  const onSelectChange = (e: SelectChangeEvent) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <FormControl variant="standard" sx={{ width: 'auto' }}>
      <Select
        value={locale}
        onChange={onSelectChange}
        disableUnderline
        disabled={isPending}
        sx={{
          color: textColor,
          fontSize: fontSize,
          '& .MuiSelect-select': {
            paddingTop: '4px',
            paddingBottom: '4px',
            paddingLeft: '0px',
            paddingRight: '26px !important',
          },
          '& .MuiSvgIcon-root': {
            color: textColor,
            right: '2px',
          },
        }}
        startAdornment={
          <InputAdornment position="start" sx={{ ml: 1, mr: 0.5 }}>
            <LanguageIcon sx={{ color: textColor, fontSize: '1.1rem' }} />
          </InputAdornment>
        }
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="ar">العربية</MenuItem>
      </Select>
    </FormControl>
  );
}