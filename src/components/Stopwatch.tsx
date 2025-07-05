
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { localStorageUtils } from '@/lib/utils';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  // Load stopwatch state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorageUtils.load('stopwatchState', {
      time: 0,
      isRunning: false,
      startTime: null,
      lastUpdateTime: Date.now()
    });
    
    setTime(savedState.time);
    setIsRunning(savedState.isRunning);
    startTimeRef.current = savedState.startTime;
    lastUpdateTimeRef.current = savedState.lastUpdateTime || Date.now();

    // If stopwatch was running when page was closed, calculate elapsed time
    if (savedState.isRunning && savedState.startTime) {
      const now = Date.now();
      const elapsedSinceLastUpdate = now - savedState.lastUpdateTime;
      const newTime = savedState.time + elapsedSinceLastUpdate;
      setTime(newTime);
      lastUpdateTimeRef.current = now;
    }
  }, []);

  // Save stopwatch state to localStorage whenever it changes
  useEffect(() => {
    const stopwatchState = {
      time,
      isRunning,
      startTime: startTimeRef.current,
      lastUpdateTime: lastUpdateTimeRef.current
    };
    localStorageUtils.save('stopwatchState', stopwatchState);
  }, [time, isRunning]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, update lastUpdateTime
        lastUpdateTimeRef.current = Date.now();
      } else {
        // Page is visible again, calculate elapsed time
        if (isRunning) {
          const now = Date.now();
          const elapsedSinceLastUpdate = now - lastUpdateTimeRef.current;
          const newTime = time + elapsedSinceLastUpdate;
          setTime(newTime);
          lastUpdateTimeRef.current = now;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, time]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
        lastUpdateTimeRef.current = Date.now();
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0')
    };
  };

  const handleStartStop = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      lastUpdateTimeRef.current = Date.now();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    startTimeRef.current = null;
    lastUpdateTimeRef.current = Date.now();
  };

  const { minutes, seconds, milliseconds } = formatTime(time);

  return (
    <div className="flex flex-col items-center">
      {/* Time Display */}
      <div className="flex justify-center items-center gap-6 md:gap-8 mb-8">
        {/* Minutes */}
        <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px]">
          <div className="text-5xl md:text-7xl font-serif font-normal text-white mb-3">
            {minutes}
          </div>
          <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
            minutes
          </div>
        </div>

        {/* Separator */}
        <div className="text-5xl md:text-7xl font-serif text-white/60">
          :
        </div>

        {/* Seconds */}
        <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px]">
          <div className="text-5xl md:text-7xl font-serif font-normal text-white mb-3">
            {seconds}
          </div>
          <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
            seconds
          </div>
        </div>

        {/* Separator */}
        <div className="text-5xl md:text-7xl font-serif text-white/60">
          .
        </div>

        {/* Milliseconds */}
        <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px]">
          <div className="text-5xl md:text-7xl font-serif font-normal text-white mb-3">
            {milliseconds}
          </div>
          <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
            ms
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={handleStartStop}
          variant="outline"
          size="lg"
          className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full px-6 py-3 font-rounded backdrop-blur-sm"
        >
          {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          size="lg"
          className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full px-6 py-3 font-rounded backdrop-blur-sm"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Stopwatch;
