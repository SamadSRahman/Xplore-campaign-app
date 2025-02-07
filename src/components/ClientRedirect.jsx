// ClientRedirect.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirect({ redirectPath }) {
  const router = useRouter();

  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [redirectPath, router]);

  return null; // This component doesn't render anything
}