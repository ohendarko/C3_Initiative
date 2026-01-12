// app/robots.ts

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://c3-learning.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Don't index API routes
          '/pending-verification',  // Don't index verification pages
          '/reset-password', // Don't index password reset
          '/instructor',
          '/verify-email'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}