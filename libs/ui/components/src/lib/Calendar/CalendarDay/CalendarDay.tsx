import { EventDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler, Hour, SingleHandler } from '@hubbl/shared/types';
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import CalendarDayColumn from '../CalendarDayColumn';
import CalendarEvent from '../CalendarEvent';
import CalendarSpot from '../CalendarSpot';
import CalendarSpotHeader from '../CalendarSpotHeader';

export type CalendarDayProps = {
  /**
   * Name ofhte calendar day
   */
  day:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';

  /**
   * Events of the given date
   *
   * @default []
   */
  events?: EventDTO[];

  /**
   * Initial spot hour
   */
  initialHour: Hour;

  /**
   * Final spot hour
   */
  finalHour: Hour;

  /**
   * Whether the calendar day is the current day
   *
   * @default false
   */
  today?: boolean;

  /**
   * Callback to run when the card area of the spot is clicked. It passes
   * the hour of the spot clicked.
   *
   * @default undefined
   */
  onSpotClick?: SingleHandler<number>;
};

const CalendarDay = ({
  day,
  events = [],
  finalHour,
  initialHour,
  today = false,
  onSpotClick
}: CalendarDayProps): JSX.Element => {
  const hourSpots = useMemo<number[]>(
    () =>
      Array.from(Array(Math.max(finalHour - initialHour, 9)).keys()).map(
        (hour) => hour + initialHour
      ),
    [initialHour, finalHour]
  );

  const handleOnSpotClick: SingleHandler<number, EmptyHandler> =
    (hour) => () => {
      onSpotClick?.(hour);
    };

  return (
    <CalendarDayColumn title={day}>
      <CalendarSpotHeader>
        <Typography
          color={today ? 'primary' : 'textPrimary'}
          variant="calendarHeader"
        >
          {day}
        </Typography>
      </CalendarSpotHeader>

      {hourSpots.map((hour) => (
        <CalendarSpot key={hour} onClick={handleOnSpotClick(hour)} />
      ))}

      {events.map((event, i) => (
        <CalendarEvent
          key={event.id}
          initialDayHour={initialHour}
          event={event}
          index={i}
        />
      ))}
    </CalendarDayColumn>
  );
};

export default CalendarDay;
