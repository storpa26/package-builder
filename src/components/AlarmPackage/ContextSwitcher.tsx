import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Home, Store } from 'lucide-react';
import { Context, contextLabels, defaultChips } from '@/data/assumptions';

interface ContextSwitcherProps {
  currentContext: Context;
  onContextChange: (context: Context) => void;
  assumptions: string[];
  className?: string;
}

const contextIcons: Record<Context, React.ElementType> = {
  residential: Home,
  retail: Store
};

export function ContextSwitcher({ 
  currentContext, 
  onContextChange, 
  assumptions,
  className 
}: ContextSwitcherProps) {
  const contexts: Context[] = ['residential', 'retail'];

  return (
    <div className={`bg-muted/30 rounded-lg p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Property Type & Assumptions</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {contexts.map(context => {
            const Icon = contextIcons[context];
            const isActive = context === currentContext;
            
            return (
              <Button
                key={context}
                variant={isActive ? "default" : "outline"}
                className={`
                  h-auto flex-col gap-2 p-4
                  ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/5'}
                `}
                onClick={() => onContextChange(context)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{contextLabels[context]}</span>
              </Button>
            );
          })}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Current Assumptions:</h4>
          <div className="flex flex-wrap gap-2">
            {assumptions.map((assumption, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {assumption}
              </Badge>
            ))}
          </div>
        </div>

        <details className="text-sm">
          <summary className="cursor-pointer text-primary font-medium hover:underline">
            What could change this price?
          </summary>
          <div className="mt-2 text-muted-foreground space-y-1">
            <p>• Long cable runs beyond included meters</p>
            <p>• Conduit installation in commercial properties</p>
            <p>• Heritage building or access restrictions</p>
            <p>• Roof type and accessibility challenges</p>
            <p>• Local council requirements</p>
            <p>• Site-specific installation complexity</p>
          </div>
        </details>
      </div>
    </div>
  );
}