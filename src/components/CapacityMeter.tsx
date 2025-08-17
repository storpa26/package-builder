import React from 'react';
import { config } from '../lib/config';

interface CapacityMeterProps {
  inputsUsed: number;
  totalPower: number;
  keypadsCount: number;
  touchscreensCount: number;
  className?: string;
}

export function CapacityMeter({
  inputsUsed,
  totalPower,
  keypadsCount,
  touchscreensCount,
  className = ''
}: CapacityMeterProps) {
  const {
    MAX_INPUTS,
    POWER_BUDGET_MA,
    MAX_KEYPADS,
    TOUCHSCREEN_THRESHOLD
  } = config.validation;

  const getStatusColor = (used: number, max: number, isWarning = false) => {
    const percentage = (used / max) * 100;
    if (percentage >= 100) return 'text-red-600 bg-red-100';
    if (percentage >= 80 || isWarning) return 'text-amber-600 bg-amber-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressColor = (used: number, max: number, isWarning = false) => {
    const percentage = (used / max) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80 || isWarning) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const capacityItems = [
    {
      label: 'Inputs',
      used: inputsUsed,
      max: MAX_INPUTS,
      unit: '',
      isWarning: false
    },
    {
      label: 'Power',
      used: totalPower,
      max: POWER_BUDGET_MA,
      unit: ' mA',
      isWarning: false
    },
    {
      label: 'Keypads',
      used: keypadsCount,
      max: MAX_KEYPADS,
      unit: '',
      isWarning: false
    },
    {
      label: 'Touchscreens',
      used: touchscreensCount,
      max: TOUCHSCREEN_THRESHOLD,
      unit: '',
      isWarning: touchscreensCount > TOUCHSCREEN_THRESHOLD
    }
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">System Capacity</h3>
      
      <div className="space-y-3">
        {capacityItems.map((item) => {
          const percentage = Math.min((item.used / item.max) * 100, 100);
          const statusColor = getStatusColor(item.used, item.max, item.isWarning);
          const progressColor = getProgressColor(item.used, item.max, item.isWarning);
          
          return (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">{item.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                  {item.used}{item.unit} / {item.max}{item.unit}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              {item.used > item.max && (
                <p className="text-xs text-red-600 mt-1">
                  Exceeds maximum capacity!
                </p>
              )}
              
              {item.isWarning && item.used > item.max && (
                <p className="text-xs text-amber-600 mt-1">
                  Above threshold - additional PSU required
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}