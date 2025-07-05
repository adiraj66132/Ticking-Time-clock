
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { localStorageUtils } from '@/lib/utils';

const Timer = () => {
  const [totalTime, setTotalTime] = useState(300000); // 5 minutes in milliseconds
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  // Load timer state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorageUtils.load('timerState', {
      totalTime: 300000,
      remainingTime: 300000,
      isRunning: false,
      isFinished: false,
      startTime: null,
      lastUpdateTime: Date.now()
    });
    
    setTotalTime(savedState.totalTime);
    setRemainingTime(savedState.remainingTime);
    setIsRunning(savedState.isRunning);
    setIsFinished(savedState.isFinished);
    startTimeRef.current = savedState.startTime;
    lastUpdateTimeRef.current = savedState.lastUpdateTime || Date.now();

    // If timer was running when page was closed, calculate elapsed time
    if (savedState.isRunning && savedState.startTime && !savedState.isFinished) {
      const now = Date.now();
      const elapsedSinceLastUpdate = now - savedState.lastUpdateTime;
      const newRemainingTime = Math.max(0, savedState.remainingTime - elapsedSinceLastUpdate);
      
      if (newRemainingTime <= 0) {
        setRemainingTime(0);
        setIsRunning(false);
        setIsFinished(true);
      } else {
        setRemainingTime(newRemainingTime);
        lastUpdateTimeRef.current = now;
      }
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    const timerState = {
      totalTime,
      remainingTime,
      isRunning,
      isFinished,
      startTime: startTimeRef.current,
      lastUpdateTime: lastUpdateTimeRef.current
    };
    localStorageUtils.save('timerState', timerState);
  }, [totalTime, remainingTime, isRunning, isFinished]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, update lastUpdateTime
        lastUpdateTimeRef.current = Date.now();
      } else {
        // Page is visible again, calculate elapsed time
        if (isRunning && !isFinished) {
          const now = Date.now();
          const elapsedSinceLastUpdate = now - lastUpdateTimeRef.current;
          const newRemainingTime = Math.max(0, remainingTime - elapsedSinceLastUpdate);
          
          if (newRemainingTime <= 0) {
            setRemainingTime(0);
            setIsRunning(false);
            setIsFinished(true);
          } else {
            setRemainingTime(newRemainingTime);
          }
          lastUpdateTimeRef.current = now;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, isFinished, remainingTime]);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 100) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prevTime - 100;
        });
        lastUpdateTimeRef.current = Date.now();
      }, 100);
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
  }, [isRunning, remainingTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  const handleStartStop = () => {
    if (isFinished) {
      setIsFinished(false);
      setRemainingTime(totalTime);
      startTimeRef.current = null;
      lastUpdateTimeRef.current = Date.now();
    }
    
    if (!isRunning) {
      startTimeRef.current = Date.now();
      lastUpdateTimeRef.current = Date.now();
    }
    
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemainingTime(totalTime);
    startTimeRef.current = null;
    lastUpdateTimeRef.current = Date.now();
  };

  const adjustTime = (amount: number) => {
    if (!isRunning) {
      const newTime = Math.max(60000, totalTime + amount); // Minimum 1 minute
      setTotalTime(newTime);
      setRemainingTime(newTime);
      setIsFinished(false);
    }
  };

  const { minutes, seconds } = formatTime(remainingTime);

  return (
    <div className="flex flex-col items-center">
      {/* Time Display */}
      <div className="flex justify-center items-center gap-6 md:gap-8 mb-8">
        {/* Minutes */}
        <div className={`time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px] ${isFinished ? 'border-red-500 bg-red-500/20' : ''}`}>
          <div className={`text-5xl md:text-7xl font-serif font-normal mb-3 ${isFinished ? 'text-red-400' : 'text-white'}`}>
            {minutes}
          </div>
          <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
            minutes
          </div>
        </div>

        {/* Separator */}
        <div className={`text-5xl md:text-7xl font-serif ${isFinished ? 'text-red-400/60 animate-pulse' : 'text-white/60'}`}>
          :
        </div>

        {/* Seconds */}
        <div className={`time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px] ${isFinished ? 'border-red-500 bg-red-500/20' : ''}`}>
          <div className={`text-5xl md:text-7xl font-serif font-normal mb-3 ${isFinished ? 'text-red-400' : 'text-white'}`}>
            {seconds}
          </div>
          <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
            seconds
          </div>
        </div>
      </div>

      {/* Time Adjustment Controls */}
      {!isRunning && !isFinished && (
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => adjustTime(-60000)}
            variant="outline"
            size="sm"
            className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full font-rounded backdrop-blur-sm"
          >
            <Minus className="w-4 h-4 mr-1" />
            1m
          </Button>
          <Button
            onClick={() => adjustTime(60000)}
            variant="outline"
            size="sm"
            className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full font-rounded backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            1m
          </Button>
          <Button
            onClick={() => adjustTime(300000)}
            variant="outline"
            size="sm"
            className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full font-rounded backdrop-blur-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            5m
          </Button>
        </div>
      )}

      {/* Status Message */}
      {isFinished && (
        <div className="mb-6">
          <p className="text-red-400 text-xl font-rounded animate-pulse">Time's Up!</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={handleStartStop}
          variant="outline"
          size="lg"
          className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full px-6 py-3 font-rounded backdrop-blur-sm"
        >
          {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
          {isFinished ? 'Restart' : isRunning ? 'Pause' : 'Start'}
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

export default Timer;
