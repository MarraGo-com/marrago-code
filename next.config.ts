import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '/v0/b/**', 
            },
            
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
                pathname: '/**',
            }
        ],
        minimumCacheTTL: 60 * 60 * 24 * 30, // Cache for 30 days
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // ... (your other X- headers remain the same)
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        // UPDATED: Added permissions for Stripe and Firebase frames
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.google.com *.googletagmanager.com *.stripe.com; child-src *.youtube.com *.google.com; style-src 'self' 'unsafe-inline' *.googleapis.com unpkg.com; img-src * blob: data:; media-src 'self'; connect-src *; font-src 'self' *.gstatic.com; frame-src 'self' *.youtube.com *.google.com *.stripe.com *.firebaseapp.com;",
                    },
                ],
            },
        ];
    },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);