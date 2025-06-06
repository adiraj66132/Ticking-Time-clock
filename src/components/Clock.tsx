import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe2, Clock as ClockIcon } from 'lucide-react';
import Stopwatch from './Stopwatch';
import Timer from './Timer';
import LoadingState from './LoadingState';
import useTimezone from '@/hooks/useTimezone';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [activeTab, setActiveTab] = useState<'clock' | 'stopwatch' | 'timer'>('clock');
  const [showTimezoneList, setShowTimezoneList] = useState(false);
  
  const {
    timezones,
    selectedTimezone,
    setSelectedTimezone,
    isLoading: isLoadingTimezones,
  } = useTimezone();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: selectedTimezone,
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return date.toLocaleDateString('en-US');
    }
  };

  const formatTime = (date: Date) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour,
        timeZone: selectedTimezone,
      };
      
      const timeString = date.toLocaleTimeString('en-US', options);
      const [time, period] = timeString.split(' ');
      const [hours, minutes, seconds] = time.split(':');
      
      return { 
        hours: hours.padStart(2, '0'),
        minutes, 
        seconds, 
        period: is24Hour ? null : period 
      };
    } catch (error) {
      console.error('Error formatting time:', error);
      const fallbackDate = new Date();
      return {
        hours: fallbackDate.getHours().toString().padStart(2, '0'),
        minutes: fallbackDate.getMinutes().toString().padStart(2, '0'),
        seconds: fallbackDate.getSeconds().toString().padStart(2, '0'),
        period: null
      };
    }
  };

  const { hours, minutes, seconds, period } = formatTime(time);

  const renderClockContent = () => {
    switch (activeTab) {
      case 'stopwatch':
        return <Stopwatch />;
      case 'timer':
        return <Timer />;
      default:
        return (
          <>
            {/* Date Display */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-rounded font-light gradient-text">
                {formatDate(time)}
              </h1>
            </div>

            {/* Digital Time Display */}
            <div className="flex justify-center items-center gap-6 md:gap-8 mb-8">
              {/* Hours */}
              <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[100px] md:min-w-[120px]">
                <div className="text-5xl md:text-7xl font-serif font-normal text-white mb-3">
                  {hours}
                </div>
                <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
                  {is24Hour ? 'hour' : 'hours'}
                </div>
              </div>

              {/* Separator */}
              <div className="text-5xl md:text-7xl font-serif text-white/60 animate-pulse">
                :
              </div>

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
              <div className="text-5xl md:text-7xl font-serif text-white/60 animate-pulse">
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

              {/* AM/PM Display for 12-hour format */}
              {!is24Hour && period && (
                <div className="time-segment rounded-3xl p-6 md:p-8 text-center min-w-[80px]">
                  <div className="text-3xl md:text-4xl font-serif font-normal text-white mb-3">
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
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="clock-card rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 animate-fade-in relative w-full max-w-[95vw] md:max-w-4xl">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
          <div className="flex bg-secondary/50 rounded-full p-1 backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
            <Button
              onClick={() => setActiveTab('clock')}
              variant={activeTab === 'clock' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-full px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 font-rounded transition-all duration-300 whitespace-nowrap ${
                activeTab === 'clock' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-white hover:bg-secondary/60'
              }`}
            >
              <ClockIcon className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Clock</span>
            </Button>
            <Button
              onClick={() => setActiveTab('stopwatch')}
              variant={activeTab === 'stopwatch' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-full px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 font-rounded transition-all duration-300 whitespace-nowrap ${
                activeTab === 'stopwatch' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-white hover:bg-secondary/60'
              }`}
            >
              <span className="text-xs sm:text-sm">Stopwatch</span>
            </Button>
            <Button
              onClick={() => setActiveTab('timer')}
              variant={activeTab === 'timer' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-full px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 font-rounded transition-all duration-300 whitespace-nowrap ${
                activeTab === 'timer' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-white hover:bg-secondary/60'
              }`}
            >
              <span className="text-xs sm:text-sm">Timer</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto no-scrollbar">
          {activeTab === 'clock' && (
            <>
              {/* Date Display */}
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-rounded font-light gradient-text">
                  {formatDate(time)}
                </h1>
              </div>

              {/* Digital Time Display */}
              <div className="flex justify-start md:justify-center items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 mb-6 sm:mb-8 overflow-x-auto pb-2 no-scrollbar">
                {/* Hours */}
                <div className="time-segment rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 text-center min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:min-w-[120px] flex-shrink-0">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-normal text-white mb-2 md:mb-3">
                    {hours}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
                    {is24Hour ? 'hour' : 'hours'}
                  </div>
                </div>

                {/* Separator */}
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-white/60 animate-pulse flex-shrink-0">
                  :
                </div>

                {/* Minutes */}
                <div className="time-segment rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 text-center min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:min-w-[120px] flex-shrink-0">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-normal text-white mb-2 md:mb-3">
                    {minutes}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
                    minutes
                  </div>
                </div>

                {/* Separator */}
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-white/60 animate-pulse flex-shrink-0">
                  :
                </div>

                {/* Seconds */}
                <div className="time-segment rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 text-center min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:min-w-[120px] flex-shrink-0">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-normal text-white mb-2 md:mb-3">
                    {seconds}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
                    seconds
                  </div>
                </div>

                {/* AM/PM Display for 12-hour format */}
                {!is24Hour && period && (
                  <div className="time-segment rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 text-center min-w-[60px] sm:min-w-[70px] md:min-w-[80px] flex-shrink-0">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-normal text-white mb-2 md:mb-3">
                      {period}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-muted-foreground uppercase tracking-wider font-rounded">
                      period
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                <div className="w-20 sm:w-24 md:w-32 h-1 bg-clock-gradient rounded-full animate-pulse-glow"></div>
              </div>
            </>
          )}
          {activeTab === 'stopwatch' && <Stopwatch />}
          {activeTab === 'timer' && <Timer />}
        </div>

        {/* Bottom Controls */}
        {activeTab === 'clock' && (
          <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-end items-center sm:items-end mt-4 sm:mt-0 sm:absolute sm:bottom-6 sm:right-6">
            {/* Timezone Selector */}
            <div className="relative">
              <Button
                onClick={() => setShowTimezoneList(!showTimezoneList)}
                variant="outline"
                size="sm"
                className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 font-rounded backdrop-blur-sm text-xs sm:text-sm"
                disabled={isLoadingTimezones}
              >
                {isLoadingTimezones ? (
                  <LoadingState size="sm" className="p-0" />
                ) : (
                  <>
                    <Globe2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    {selectedTimezone.split('/').pop()?.replace('_', ' ')}
                  </>
                )}
              </Button>
              
              {showTimezoneList && !isLoadingTimezones && (
                <div className="absolute bottom-full right-0 mb-2 bg-secondary/95 backdrop-blur-lg border border-primary/30 rounded-lg p-2 w-48 max-h-48 sm:max-h-60 overflow-y-auto">
                  {timezones.map((tz) => (
                    <button
                      key={tz}
                      onClick={() => {
                        setSelectedTimezone(tz);
                        setShowTimezoneList(false);
                      }}
                      className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-rounded transition-colors ${
                        selectedTimezone === tz
                          ? 'bg-primary/20 text-white'
                          : 'text-white/80 hover:bg-secondary/60'
                      }`}
                    >
                      {tz.split('/').pop()?.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 12/24 Hour Toggle */}
            <Button
              onClick={() => setIs24Hour(!is24Hour)}
              variant="outline"
              size="sm"
              className="bg-secondary/80 border-primary/30 text-white hover:bg-secondary/60 hover:border-primary/50 transition-all duration-300 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 font-rounded backdrop-blur-sm text-xs sm:text-sm"
            >
              {is24Hour ? '12H' : '24H'}
            </Button>
          </div>
        )}
      </div>

      {/* Copyright and Tech Stack Info */}
      <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 text-right max-w-[90vw] sm:max-w-none">
        <p className="text-xs sm:text-sm text-white/60 font-rounded truncate">
          © 2025 Adiraj Kashyap. All rights reserved.
        </p>
        <p className="text-[10px] sm:text-xs text-white/40 font-rounded mt-0.5 sm:mt-1">
          Built with{' '}
          <a 
            href="https://react.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            React
          </a>
          ,{' '}
          <a 
            href="https://www.typescriptlang.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            TypeScript
          </a>
          {' & '}
          <a 
            href="https://tailwindcss.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            Tailwind CSS
          </a>
        </p>
      </div>
    </div>
  );
};

export default Clock;
