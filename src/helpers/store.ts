import { atom } from 'jotai';
import moment from 'moment';

type Handle = {
  id: string;
  x: number;
  active: boolean;
};

export const startDateAtom = atom(moment());
export const sliderWidthAtom = atom(0);
export const handlesAtom = atom<Handle[]>([
  {
    id: crypto.randomUUID(),
    x: 60,
    active: true,
  },
]);
