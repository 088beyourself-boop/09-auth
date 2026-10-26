'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthRoutesLayoutProps {
  children: ReactNode;
}

export default function AuthRoutesLayout({ children }: AuthRoutesLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return children;
}
