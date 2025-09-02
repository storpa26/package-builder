import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Building, Building2, Store, Zap, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

type ServiceType = 'alarm' | 'intercom';
type PropertyType = 'single-house' | 'multi-house' | 'apartment' | 'townhouse' | 'retail';
type SystemType = 'hardwired' | 'wireless';

interface QuizState {
  service: ServiceType;
  property: PropertyType | null;
  system: SystemType | null;
}

interface PropertyOption {
  id: PropertyType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const propertyOptions: PropertyOption[] = [
  {
    id: 'single-house',
    label: 'Single-storey House',
    icon: Home,
    description: 'Ground floor home'
  },
  {
    id: 'multi-house',
    label: 'Multi-storey House',
    icon: Building,
    description: 'Two or more levels'
  },
  {
    id: 'apartment',
    label: 'Apartment/Unit',
    icon: Building2,
    description: 'Flat or unit'
  },
  {
    id: 'townhouse',
    label: 'Townhouse/Villa',
    icon: Building,
    description: 'Attached home'
  },
  {
    id: 'retail',
    label: 'Small Retail',
    icon: Store,
    description: 'Shop or office'
  }
];

const getSystemRecommendation = (property: PropertyType): SystemType => {
  switch (property) {
    case 'single-house':
      return 'hardwired';
    case 'multi-house':
    case 'apartment':
    case 'townhouse':
      return 'wireless';
    case 'retail':
      return 'hardwired';
    default:
      return 'wireless';
  }
};

const getRationaleText = (system: SystemType): string => {
  return system === 'hardwired'
    ? 'Easy cable runs expected — best reliability & power headroom.'
    : 'Challenging cable access — faster, cleaner install.';
};

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const trackAnalytics = (event: string, data: any) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event,
      ...data,
      timestamp: Date.now()
    });
  }
};

export default function QuizApp() {
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [quiz, setQuiz] = useState<QuizState>({
    service: 'alarm',
    property: null,
    system: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track quiz start
  useEffect(() => {
    trackAnalytics('quiz_start', {});
  }, []);

  // Update system recommendation when property changes
  useEffect(() => {
    if (quiz.property) {
      const recommendedSystem = getSystemRecommendation(quiz.property);
      setQuiz(prev => ({ ...prev, system: recommendedSystem }));
      
      trackAnalytics('quiz_change', {
        service: quiz.service,
        property: quiz.property,
        system: recommendedSystem
      });
    }
  }, [quiz.property, quiz.service]);

  const handleServiceChange = (service: ServiceType) => {
    setQuiz(prev => ({ ...prev, service }));
  };

  const handlePropertySelect = (property: PropertyType) => {
    setQuiz(prev => ({ ...prev, property }));
  };

  const handleContinue = () => {
    if (quiz.property && quiz.system) {
      setStep('confirm');
    }
  };

  const handleConfirm = async () => {
    if (!quiz.property || !quiz.system || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Set cookie
      const profileData = {
        service: quiz.service,
        property: quiz.property,
        system: quiz.system
      };
      setCookie('ca_profile', JSON.stringify(profileData), 7);
      
      // Build redirect URL
      const baseUrl = 'https://cheapalarms.com.au';
      const servicePath = quiz.service === 'alarm' ? 'alarm' : 'intercom';
      const systemPath = quiz.system === 'hardwired' ? 'wired' : 'wireless';
      const redirectUrl = `${baseUrl}/${servicePath}-${systemPath}/?why=${quiz.system}&src=quiz`;
      
      // Track completion
      trackAnalytics('quiz_complete', {
        service: quiz.service,
        property: quiz.property,
        system: quiz.system,
        dest: redirectUrl
      });
      
      // Add confetti effect
      if (typeof window !== 'undefined' && (window as any).confetti) {
        (window as any).confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 800);
      
    } catch (error) {
      console.error('Quiz submission error:', error);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep('select');
  };

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-[#c95375] to-[#ff66c4] rounded-full flex items-center justify-center">
              {quiz.system === 'hardwired' ? (
                <Zap className="w-8 h-8 text-white" />
              ) : (
                <Wifi className="w-8 h-8 text-white" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-[#020202]">
              Perfect! You'll need {quiz.system === 'hardwired' ? 'Hardwired' : 'Wireless'}
            </h1>
            
            <p className="text-lg text-[#838381] max-w-md mx-auto">
              {getRationaleText(quiz.system!)}
            </p>
            
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="text-sm text-[#838381]">Your Selection:</div>
              <div className="flex items-center justify-center gap-4 text-sm">
                <Badge variant="secondary" className="bg-[#288896] text-white">
                  {quiz.service === 'alarm' ? 'Alarm System' : 'Intercom System'}
                </Badge>
                <Badge variant="secondary" className="bg-[#005667] text-white">
                  {propertyOptions.find(p => p.id === quiz.property)?.label}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-8"
            >
              Back
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-8 bg-[#c95375] hover:bg-[#ff66c4] text-white transition-all duration-200 transform hover:scale-105"
            >
              {isSubmitting ? 'Redirecting...' : 'Go to my page'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#020202]">
            Find Your Perfect Security System
          </h1>
          <p className="text-lg text-[#838381]">
            Answer a few quick questions to get personalized recommendations
          </p>
        </div>

        {/* Service Selection */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-[#020202]">What do you need?</h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleServiceChange('alarm')}
              className={cn(
                "px-6 py-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105",
                quiz.service === 'alarm'
                  ? "border-[#c95375] bg-[#c95375] text-white"
                  : "border-slate-200 bg-white text-[#020202] hover:border-[#c95375]"
              )}
            >
              🚨 Alarm System
            </button>
            <button
              onClick={() => handleServiceChange('intercom')}
              className={cn(
                "px-6 py-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105",
                quiz.service === 'intercom'
                  ? "border-[#c95375] bg-[#c95375] text-white"
                  : "border-slate-200 bg-white text-[#020202] hover:border-[#c95375]"
              )}
            >
              📞 Intercom System
            </button>
          </div>
        </Card>

        {/* Property Selection */}
        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-[#020202]">What's your property type?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {propertyOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = quiz.property === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handlePropertySelect(option.id)}
                  className={cn(
                    "p-6 rounded-lg border-2 text-left transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c95375] focus:ring-offset-2",
                    isSelected
                      ? "border-[#c95375] bg-[#c95375] text-white shadow-lg"
                      : "border-slate-200 bg-white text-[#020202] hover:border-[#c95375] hover:shadow-md"
                  )}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={cn("w-6 h-6 mt-1", isSelected ? "text-white" : "text-[#288896]")} />
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className={cn("text-sm", isSelected ? "text-white/80" : "text-[#838381]")}>                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Live Recommendation */}
          {quiz.property && quiz.system && (
            <div className="flex justify-center animate-in slide-in-from-bottom-2 duration-300">
              <Badge 
                className={cn(
                  "px-4 py-2 text-sm font-medium",
                  quiz.system === 'hardwired'
                    ? "bg-[#288896] text-white"
                    : "bg-[#018295] text-white"
                )}
              >
                {quiz.system === 'hardwired' ? '⚡' : '📶'} You'll likely need {quiz.system === 'hardwired' ? 'Hardwired' : 'Wireless'}
              </Badge>
            </div>
          )}
        </Card>

        {/* Continue Button */}
        {quiz.property && (
          <div className="flex justify-center animate-in slide-in-from-bottom-2 duration-300">
            <Button
              onClick={handleContinue}
              size="lg"
              className="px-12 py-3 bg-[#c95375] hover:bg-[#ff66c4] text-white text-lg transition-all duration-200 transform hover:scale-105"
            >
              Continue →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}