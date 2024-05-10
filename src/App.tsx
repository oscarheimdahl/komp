import {
  MouseEvent as ReactMouseEvent,
  // TouchEvent as ReactTouchEvent,
  useEffect,
  useRef,
} from 'react';

import { Plus } from 'lucide-react';

import { useAtom } from 'jotai';
import {
  activeSpanMultiplier,
  inactiveSpanMultiplier,
} from './helpers/spanMultipliers';

import { DateTimePicker } from './components/DateTimePicker';
import { handlesAtom, sliderWidthAtom, startDateAtom } from './helpers/store';

function App() {
  const [handles] = useAtom(handlesAtom);
  const [, setSliderWidth] = useAtom(sliderWidthAtom);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current) return;

    const newSliderWidth = sliderRef.current.getBoundingClientRect().width;
    setSliderWidth(newSliderWidth);
  }, [setSliderWidth]);

  return (
    <>
      <div className='scale-50 sm:scale-100 size-full flex flex-col gap-4 justify-center items-center'>
        <div className='flex gap-8'>
          <div className='flex gap-2 items-center'>
            <div className='size-4 rounded-sm bg-emerald-500'></div>
            <span className='text-gray-800 text-sm'>Aktiv tid</span>
          </div>
          <div className='flex gap-2 items-center'>
            <div className='size-4 rounded-sm bg-gray-500'></div>
            <span className='text-gray-800 text-sm'>Passiv tid</span>
          </div>
        </div>
        <div className='p-8 border bg-white w-fit border-zinc-200 rounded-md flex gap-4 items-center'>
          <DateTimePicker />
          <div
            ref={sliderRef}
            className='h-[1px] rounded-full flex w-[1000px] bg-zinc-400 relative'
          >
            {handles.map((_, i) => {
              return <SliderHandle key={i} handleIndex={i} />;
            })}
          </div>
          <NewHandleButton />
        </div>

        <Total />
      </div>
    </>
  );
}

function Total() {
  const [startDate] = useAtom(startDateAtom);
  const [handles] = useAtom(handlesAtom);

  let sum = 0;
  handles.forEach((handle, i) => {
    const previousHandle = handles[i - 1];
    const date1 = previousHandle
      ? startDate.clone().add(previousHandle.x, 'minutes')
      : startDate.clone();
    const date2 = startDate.clone().add(handle.x, 'minutes');
    let toAdd = 0;
    if (handle.active) toAdd += activeSpanMultiplier(date1, date2);
    else toAdd += inactiveSpanMultiplier(date1, date2);

    sum += toAdd;
  });

  const hours = Math.floor(sum);
  const minutesRaw = Math.round((sum - hours) * 60);
  const minutes = minutesRaw === 60 ? 0 : minutesRaw;

  return (
    <div className='flex flex-col justify-center items-center gap-1'>
      <span className='text-gray-500'>Totalt:</span>
      <span className='text-2xl h-4'>
        {hours > 0 && `${hours} ${hours > 1 ? 'timmar' : 'timme'}`}{' '}
        {minutes > 0 &&
          `${minutes.toFixed(0)} ${minutes > 1 ? 'minuter' : 'minut'}`}
      </span>
    </div>
  );
}

function NewHandleButton() {
  const [handles, setHandles] = useAtom(handlesAtom);

  return (
    <button
      onClick={() => {
        let x = 60;
        const previousHandle = handles[handles.length - 1];
        if (previousHandle) x = previousHandle.x + 60;
        return setHandles([
          ...handles,
          {
            id: crypto.randomUUID(),
            x: x,
            active: !previousHandle?.active,
          },
        ]);
      }}
      className='rounded-md p-1 border text-white shadow-sm'
    >
      <Plus className='text-gray-800' strokeWidth={2} size={16} />
    </button>
  );
}

interface SliderHandleProps {
  handleIndex: number;
}

function SliderHandle({ handleIndex }: SliderHandleProps) {
  const [startDate] = useAtom(startDateAtom);
  const [handles, setHandles] = useAtom(handlesAtom);
  const handle = handles[handleIndex];
  const [sliderWidth] = useAtom(sliderWidthAtom);
  const mouseDragStart = useRef<number | undefined>(undefined);
  const previousHandle = handles[handleIndex - 1];
  const nextHandle = handles[handleIndex + 1];
  const dragStarted = useRef(false);

  const stepSize = 15;

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (mouseDragStart.current === undefined) return;
      dragStarted.current = true;
      const spacing = 10;
      const dragX = e.pageX - mouseDragStart.current;

      function getMinX() {
        if (previousHandle) return previousHandle.x + spacing;
        return 0;
      }
      function getMaxX() {
        if (nextHandle) return nextHandle.x - spacing;
        return sliderWidth;
      }
      const minX = getMinX();
      const maxX = getMaxX();

      const offsetX = clamp(minX, dragX, maxX);

      setHandles([
        ...handles.map((h, i) =>
          i === handleIndex ? { ...h, x: offsetX } : h
        ),
      ]);
    }

    function handleMouseUp() {
      mouseDragStart.current = undefined;
      dragStarted.current = false;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    handleIndex,
    handles,
    nextHandle,
    previousHandle,
    setHandles,
    sliderWidth,
  ]);

  function handleMouseDown(e: ReactMouseEvent<HTMLButtonElement>) {
    mouseDragStart.current = e.pageX - handle.x;
  }

  function handleMouseUp() {
    if (dragStarted.current) return;

    setHandles([
      ...handles.map((h, i) =>
        i === handleIndex ? { ...h, active: !h.active } : h
      ),
    ]);
  }

  if (!handle) return null;

  let bg = 'bg-emerald-500';
  let border = 'border-emerald-500';
  if (!handle.active) {
    bg = 'bg-gray-500';
    border = 'border-gray-500';
  }
  const displayTime = startDate
    .clone()
    .add((handle.x / stepSize) * 15, 'minutes')
    .format('HH:mm');

  return (
    <>
      <LineToHandle handleOffset={handle.x} bg={bg} handleIndex={handleIndex} />
      <div
        style={{
          transform: `translateX(${handle.x}px)`,
        }}
        className='w-fit z-20 select-none'
      >
        <span
          className={`${
            handleIndex % 2 === 0 ? 'top-4' : 'bottom-4'
          } text-black text-sm absolute w-fit text-center -translate-x-1/2 px-1 rounded-md bg-white`}
        >
          {displayTime}
        </span>

        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`
            bg-white ${border} shadow-md rounded-full absolute -top-3 -left-3 size-6 border-4`}
        ></button>
      </div>
    </>
  );
}
interface LineToHandleProps {
  handleIndex: number;
  handleOffset: number;
  bg: string;
}

function LineToHandle({ handleIndex, handleOffset, bg }: LineToHandleProps) {
  const [handles] = useAtom(handlesAtom);
  const previousHandle = handles[handleIndex - 1];

  let startX = 0;
  if (previousHandle) startX = previousHandle.x;

  return (
    <div
      style={{
        transform: `translateX(${startX}px) translateY(-50%)`,
        width: `${handleOffset - startX}px`,
      }}
      className={`absolute z-10 h-2 rounded-full ${bg} `}
    ></div>
  );
}

function clamp(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

export default App;
