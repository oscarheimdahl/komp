'use client';

import { Label } from '@/components/shadcn/Label';
import * as React from 'react';
import { TimePickerInput } from './TimePickerInput';

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePickerDemo({ date, setDate }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className='flex items-end gap-2'>
      <div className='grid gap-1 text-center'>
        <Label htmlFor='hours' className='text-xs'>
          Timmar
        </Label>
        <TimePickerInput
          className='font-sans text-sm'
          picker='hours'
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className='grid gap-1 text-center'>
        <Label htmlFor='minutes' className='text-xs'>
          Minuter
        </Label>
        <TimePickerInput
          className='font-sans text-sm'
          picker='minutes'
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
    </div>
  );
}
