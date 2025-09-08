// -------------------------------------------------------------------------
// 1. NEW FILE: /src/components/ui/BackToExperiencesButton.tsx
// This is a dedicated Client Component to solve the error.
// -------------------------------------------------------------------------
'use client';

import React from 'react';
import { Button } from '@mui/material';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function BackToExperiencesButton() {
    const t = useTranslations('BookingStatusPage');

    return (
        <Button component={Link} href="/experiences" variant="contained">
            {t('backButton')}
        </Button>
    );
}