'use client';

import { sv } from 'date-fns/locale';

import { Button } from '@/components/shadcn/Button';
import { Calendar } from '@/components/shadcn/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/Popover';
import { TimePickerDemo } from '@/components/shadcn/TimePicker/TimePicker';
import { cn } from '@/helpers/cn';
import { useAtom } from 'jotai';
import moment from 'moment';
import { startDateAtom } from '@/helpers/store';

export function DateTimePicker() {
  const [startDate, setStartDate] = useAtom(startDateAtom);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            ' justify-start text-black text-left font-normal',
            !startDate && 'text-muted-foreground'
          )}
        >
          {/* <CalendarIcon className='mr-2 h-4 w-4' /> */}
          {startDate ? (
            startDate.format('DD MMMM - HH:mm')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          ISOWeek
          locale={sv}
          selected={startDate.toDate()}
          onSelect={(date) => setStartDate(moment(date))}
          initialFocus
        />
        <div className='p-3 border-t border-border'>
          <TimePickerDemo
            setDate={(date) => setStartDate(moment(date))}
            date={startDate.toDate()}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
