import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        // Block AI training crawlers
        userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://wastemytime.fun/sitemap.xml',
    host: 'https://wastemytime.fun',
  };
}
