/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react';

function Love() {
  const clicks = useRef(0);
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    document.addEventListener('click', () => {
      clicks.current += 1;
      if (clicks.current > 10) {
        setShowHearts(true);
        setTimeout(() => {
          setShowHearts(false);
        }, 10000);
      }
    });
  }, []);

  if (!showHearts) return null;

  return Array(200)
    .fill(0)
    .map(() => {
      const offsetYFrom = rand(0, window.innerHeight) + 300;
      const offsetYTo = -window.innerHeight * 2 + offsetYFrom;
      const scale = rand(2, 4);
      const offsetX = rand(-100, 500);
      return (
        <div
          className='pointer-events-none'
          style={{
            transform: `translateX(${Math.random() * window.innerWidth}px)`,
          }}
        >
          <div
            style={{
              // @ts-ignore
              '--scale': scale,
            }}
            className='grow'
          >
            <div
              style={{
                // @ts-ignore
                '--offsetX': offsetX + 'px',
              }}
              className='slalom'
            >
              <div
                style={{
                  // @ts-ignore
                  '--offsetYFrom': offsetYFrom + 'px',
                  '--offsetYTo': offsetYTo + 'px',
                }}
                className='float absolute bottom-4 h-4'
              >
                ❤️
              </div>
            </div>
          </div>
        </div>
      );
    });
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default Love;
