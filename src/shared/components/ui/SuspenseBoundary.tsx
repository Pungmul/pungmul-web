import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

export function SuspenseBoundary({ 
  children, 
  fallback,
  name = 'content'
}: SuspenseBoundaryProps) {
  const defaultFallback = (
    <LoadingSpinner 
      message={`${name} 로딩 중...`}
      size="medium"
    />
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
} 