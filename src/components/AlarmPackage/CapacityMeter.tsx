import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info } from 'lucide-react';
import { CapacityLimits } from '@/lib/rules';

interface CapacityMeterProps {
  limits: CapacityLimits;
  className?: string;
}

export function CapacityMeter({ limits, className }: CapacityMeterProps) {
  const getProgressColor = (used: number, max: number, threshold?: number) => {
    const percentage = (used / max) * 100;
    if (percentage >= 90) return 'hsl(var(--progress-danger))';
    if (threshold && used > threshold) return 'hsl(var(--progress-warning))';
    return 'hsl(var(--progress-safe))';
  };

  const getStatusBadge = (used: number, max: number, threshold?: number) => {
    const percentage = (used / max) * 100;
    if (percentage >= 90) return <Badge variant="destructive" className="text-xs">Near Limit</Badge>;
    if (threshold && used > threshold) return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Expander Needed</Badge>;
    return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">Good</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          System Capacity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Inputs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Sensor Inputs</span>
            {getStatusBadge(limits.inputs.used, limits.inputs.max, limits.inputs.threshold)}
          </div>
          <div className="space-y-1">
            <Progress 
              value={(limits.inputs.used / limits.inputs.max) * 100}
              className="h-2"
              style={{
                '--progress-foreground': getProgressColor(limits.inputs.used, limits.inputs.max, limits.inputs.threshold)
              } as React.CSSProperties}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{limits.inputs.used} / {limits.inputs.max} used</span>
              <span>Expander needed at {limits.inputs.threshold + 1}</span>
            </div>
          </div>
        </div>

        {/* Power */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Power Draw</span>
            {getStatusBadge(limits.power.used, limits.power.max)}
          </div>
          <div className="space-y-1">
            <Progress 
              value={(limits.power.used / limits.power.max) * 100}
              className="h-2"
              style={{
                '--progress-foreground': getProgressColor(limits.power.used, limits.power.max)
              } as React.CSSProperties}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{limits.power.used} / {limits.power.max} mA</span>
              <span>PSU needed at {limits.power.max + 1} mA</span>
            </div>
          </div>
        </div>

        {/* Keypads */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Keypads</span>
            {getStatusBadge(limits.keypads.used, limits.keypads.max)}
          </div>
          <div className="space-y-1">
            <Progress 
              value={(limits.keypads.used / limits.keypads.max) * 100}
              className="h-2"
              style={{
                '--progress-foreground': getProgressColor(limits.keypads.used, limits.keypads.max)
              } as React.CSSProperties}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{limits.keypads.used} / {limits.keypads.max} used</span>
              {limits.touchscreens.used > 0 && (
                <span>{limits.touchscreens.used} touchscreen{limits.touchscreens.used !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>

        {/* Warnings */}
        {(limits.inputs.used > limits.inputs.threshold || 
          limits.touchscreens.used > limits.touchscreens.threshold ||
          limits.power.used > limits.power.max) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-800">Auto-additions required:</p>
                <ul className="text-xs text-yellow-700 space-y-0.5">
                  {limits.inputs.used > limits.inputs.threshold && (
                    <li>• Input expander needed for {limits.inputs.used} sensors</li>
                  )}
                  {(limits.touchscreens.used > limits.touchscreens.threshold || limits.power.used > limits.power.max) && (
                    <li>• Additional power supply needed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}