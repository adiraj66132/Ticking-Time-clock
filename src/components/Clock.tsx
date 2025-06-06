
import { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="clock-card rounded-3xl p-8 md:p-12 animate-fade-in">
        {/* Date Display */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light gradient-text">
            {formatDate(time)}
          </h1>
        </div>

        {/* Time Display */}
        <div className="flex justify-center gap-4 md:gap-6">
          {/* Hours */}
          <div className="time-segment rounded-2xl p-4 md:p-6 text-center min-w-[80px] md:min-w-[100px]">
            <div className="text-4xl md:text-6xl font-light text-white mb-2">
              {hours}
            </div>
            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">
              hour
            </div>
          </div>

          {/* Minutes */}
          <div className="time-segment rounded-2xl p-4 md:p-6 text-center min-w-[80px] md:min-w-[100px]">
            <div className="text-4xl md:text-6xl font-light text-white mb-2">
              {minutes}
            </div>
            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">
              minutes
            </div>
          </div>

          {/* Seconds */}
          <div className="time-segment rounded-2xl p-4 md:p-6 text-center min-w-[80px] md:min-w-[100px]">
            <div className="text-4xl md:text-6xl font-light text-white mb-2">
              {seconds}
            </div>
            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">
              seconds
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 flex justify-center">
          <div className="w-24 h-1 bg-clock-gradient rounded-full animate-pulse-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
