
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

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
    if (is24Hour) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return { hours, minutes, seconds, period: null };
    } else {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      
      if (hours === 0) hours = 12;
      if (hours > 12) hours -= 12;
      
      return { 
        hours: hours.toString().padStart(2, '0'), 
        minutes, 
        seconds, 
        period 
      };
    }
  };

  const { hours, minutes, seconds, period } = formatTime(time);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="clock-card rounded-3xl p-8 md:p-12 animate-fade-in relative max-w-4xl w-full">
        {/* Date Display */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-rounded font-light gradient-text">
            {formatDate(time)}
          </h1>
        </div>

        {/* Time Display */}
        <div className="flex justify-center items-center gap-6 md:gap-8 mb-8">
          {/* Hours */}
          <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px]">
            <div className="text-5xl md:text-7xl font-rounded font-light text-white mb-3">
              {hours}
            </div>
            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
              {is24Hour ? 'hour' : 'hours'}
            </div>
          </div>

          {/* Separator */}
          <div className="text-5xl md:text-7xl font-light text-white/60 animate-pulse">
            :
          </div>

          {/* Minutes */}
          <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px]">
            <div className="text-5xl md:text-7xl font-rounded font-light text-white mb-3">
              {minutes}
            </div>
            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
              minutes
            </div>
          </div>

          {/* Separator */}
          <div className="text-5xl md:text-7xl font-light text-white/60 animate-pulse">
            :
          </div>

          {/* Seconds */}
          <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px]">
            <div className="text-5xl md:text-7xl font-rounded font-light text-white mb-3">
              {seconds}
            </div>
            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
              seconds
            </div>
          </div>

          {/* AM/PM Display for 12-hour format */}
          {!is24Hour && period && (
            <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[80px]">
              <div className="text-3xl md:text-4xl font-rounded font-light text-white mb-3">
                {period}
              </div>
              <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
                period
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-1 bg-clock-gradient rounded-full animate-pulse-glow"></div>
        </div>

        {/* Format Toggle Button - Bottom Right */}
        <div className="absolute bottom-6 right-6">
          <Button
            onClick={() => setIs24Hour(!is24Hour)}
            variant="outline"
            size="sm"
            className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full px-4 py-2 font-rounded backdrop-blur-sm"
          >
            {is24Hour ? '12H' : '24H'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Clock;
