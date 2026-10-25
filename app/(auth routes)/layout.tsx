import type { ReactNode } from 'react';

interface AuthRoutesLayoutProps {
  children: ReactNode;
}

export default function AuthRoutesLayout({ children }: AuthRoutesLayoutProps) {
  return children;
}
