import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Suspense } from 'react';
import Clock from '@/components/Clock';
import SEO from '@/components/SEO';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingState from '@/components/LoadingState';
import { ToastProvider } from '@/components/ui/toast';

const queryClient = new QueryClient();

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
