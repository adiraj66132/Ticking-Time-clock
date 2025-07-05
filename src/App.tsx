import { Toaster } from "@/components/ui/toaster";
import { Suspense } from 'react';
import Clock from '@/components/Clock';
import SEO from '@/components/SEO';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingState from '@/components/LoadingState';
import { ToastProvider } from '@/components/ui/toast';

const App = () => {
  return (
    <ToastProvider>
      <SEO />
      <ErrorBoundary>
        <Suspense fallback={
          <LoadingState 
            size="lg"
            message="Loading clock application..."
            className="min-h-screen"
          />
        }>
          <Clock />
        </Suspense>
      </ErrorBoundary>
      <Toaster />
    </ToastProvider>
  );
};

export default App;
