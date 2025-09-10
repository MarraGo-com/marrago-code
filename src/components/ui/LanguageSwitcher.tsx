// /src/components/ui/LanguageSwitcher.tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';
import { Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const onSelectChange = (e: SelectChangeEvent) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: 120 }}>
      <Select
        value={locale}
        onChange={onSelectChange}
        disabled={isPending}
        sx={{
          color: 'inherit', // Inherit color from the parent (Header)
          fontSize: '0.875rem',
          '& .MuiSelect-select': {
            padding: '4px 24px 4px 8px',
          },
          '& .MuiSvgIcon-root': {
            color: 'inherit', // Inherit color for the dropdown arrow
          },
          '&:before, &:after': {
            borderBottom: 'none', // Remove the underline
          },
          '&:hover:not(.Mui-disabled):before': {
             borderBottom: 'none',
          }
        }}
        IconComponent={LanguageIcon}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        {/* You can easily add Arabic back later by uncommenting this line */}
        {/* <MenuItem value="ar">العربية</MenuItem> */}
      </Select>
    </FormControl>
  );
}