import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import type { ValidationResult } from '../lib/config';

interface ValidationNoticesProps {
  result: ValidationResult;
  onDismissNotice?: (index: number) => void;
  className?: string;
}

export function ValidationNotices({
  result,
  onDismissNotice,
  className = ''
}: ValidationNoticesProps) {
  const { notices, errors, autoAppended } = result;

  if (!notices.length && !errors?.length && !autoAppended.length) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Blocking Errors */}
      {errors?.map((error, index) => (
        <div
          key={`error-${index}`}
          className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      ))}

      {/* Auto-appended Items */}
      {autoAppended.map((item, index) => (
        <div
          key={`auto-${index}`}
          className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              {item.item.title} Added Automatically
            </p>
            <p className="text-sm text-blue-700">{item.reason}</p>
          </div>
        </div>
      ))}

      {/* General Notices */}
      {notices.map((notice, index) => {
        // Skip notices that are already shown as auto-appended items
        const isAutoAppendNotice = autoAppended.some(item => item.reason === notice);
        if (isAutoAppendNotice) return null;

        return (
          <div
            key={`notice-${index}`}
            className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">{notice}</p>
            </div>
            {onDismissNotice && (
              <button
                onClick={() => onDismissNotice(index)}
                className="text-amber-600 hover:text-amber-800 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}