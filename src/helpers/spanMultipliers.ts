import moment from 'moment';

// Aktiv tid vardag:
// 17-21: x1
// 21-24: x1.5
// 24-06: x2
// 06-08: x1
// När sover: x0.25

// Helg (fredag 17.00-måndag 07.00):
// Aktiv tid: x2
// När sover: x0.5

// Det som ska gångras är då TID

// Så tex mitt senaste pass: Aktiv tid (vardag) 17.00 till 04.40, passiv tid 04.40-05.00, aktiv tid 05.00-06.10, passiv tid 06.10-07.00, aktiv tid 07.00-08.00
// Skulle ju då bli:
// 4x1 + 3x1.5 + 4.66x2+0.33x0.25 + 1x2+0.1666x1 + 0.83333x0.25 + 1x1 = 21.28 timmar
// Behöver MINST ta ut 16 h komp en vardagsnatt (dagen innan + efter) =
// i detta fall 5.28 timmar som jag hade kunnat ta ut i pengar = hade kunnat sätta 75% ersättning tid och 25% pengar

// 4x1 + 3x1.5 + 4.66x2 = 17,82 (17:00 - 04:40)
// 0.33x0.25 = 0.08325 (04:40 - 05:00)
// 1*2 + 0.1666*1 = 2.1666 (05:00 - 06:10)
// 0.8333*0.25=0,208325 (06:10 - 07:00)
// 1*1 = 1 (07:00 - 08:00)
// Totalt: 21,28

function isWeekEnd(date: moment.Moment) {
  function weekdayIndexToEu(index: number) {
    return index === 0 ? 6 : index - 1;
  }

  const weekend = weekdayIndexToEu(date.weekday()) >= 4;
  return weekend;
}

export function activeSpanMultiplier(
  _start: moment.Moment,
  _end: moment.Moment
) {
  const start = _start.clone();
  const end = _end.clone();
  if (start.isAfter(end)) throw new Error('Start is after end');

  let sum = 0;
  while (start.isBefore(end)) {
    let toAdd = 0;
    if (!isWeekEnd(start)) {
      const hour = start.hour();
      if (hour >= 17 && hour < 21) toAdd += 1;
      else if (hour >= 21 && hour < 24) toAdd += 1.5;
      else if (hour >= 0 && hour < 6) toAdd += 2;
      else if (hour >= 6 && hour < 8) toAdd += 1;
    } else {
      toAdd += 2;
    }
    sum += toAdd / 60;

    start.add(1, 'minute');
  }
  return sum;
}

export function inactiveSpanMultiplier(
  _start: moment.Moment,
  _end: moment.Moment
) {
  const start = _start.clone();
  const end = _end.clone();
  if (start.isAfter(end)) throw new Error('Start is after end');

  let sum = 0;
  while (start.isBefore(end)) {
    let toAdd = 0;
    if (!isWeekEnd(start)) toAdd += 0.25;
    else toAdd += 0.5;

    sum += toAdd / 60;
    start.add(1, 'minute');
  }
  return sum;
}
