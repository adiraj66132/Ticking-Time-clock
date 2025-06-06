import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseTimezoneReturn {
  timezones: string[];
  selectedTimezone: string;
  setSelectedTimezone: (timezone: string) => void;
  isLoading: boolean;
  error: Error | null;
}

const CACHE_KEY = 'timezone-data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getLocalTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Error getting local timezone:', error);
    return 'UTC';
  }
};

// Extended list of common timezones
const commonTimezones = [
  // Americas
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'America/Buenos_Aires',
  
  // Europe
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Moscow',
  
  // Asia
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Dubai',
  'Asia/Bangkok',
  'Asia/Kolkata',
  
  // Pacific
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Perth',
  'Pacific/Auckland',
];

export const useTimezone = (): UseTimezoneReturn => {
  const [timezones, setTimezones] = useState<string[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState(getLocalTimezone());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    return null;
  };

  const setCachedData = (data: string[]) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  };

  const fetchTimezones = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get data from cache first
      const cachedData = getCachedData();
      if (cachedData) {
        setTimezones(cachedData);
        setIsLoading(false);
        return;
      }

      // Sort timezones by offset
      const sortedTimezones = commonTimezones.sort((a, b) => {
        try {
          const offsetA = new Date().toLocaleString('en-US', { timeZone: a, timeZoneName: 'short' });
          const offsetB = new Date().toLocaleString('en-US', { timeZone: b, timeZoneName: 'short' });
          return offsetA.localeCompare(offsetB);
        } catch {
          return 0;
        }
      });

      // Move local timezone to the top if it's not already in the list
      const localTz = getLocalTimezone();
      const reorderedTimezones = [
        localTz,
        ...sortedTimezones.filter(tz => tz !== localTz),
      ];

      setTimezones(reorderedTimezones);
      setCachedData(reorderedTimezones);
    } catch (error) {
      console.error('Error organizing timezones:', error);
      setError(error instanceof Error ? error : new Error('Failed to organize timezones'));
      
      // Fallback to minimal timezone list
      const fallbackTimezones = [
        getLocalTimezone(),
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
      ];
      setTimezones(fallbackTimezones);
      
      toast({
        title: 'Error loading timezones',
        description: 'Using a minimal set of timezones instead.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTimezones();
  }, [fetchTimezones]);

  return {
    timezones,
    selectedTimezone,
    setSelectedTimezone,
    isLoading,
    error,
  };
};

export default useTimezone; 