import { EmptyHandler } from '@hubbl/shared/types';
import { CardActionArea, styled } from '@mui/material';

const Li = styled('li')(({ theme }) => ({
  borderBottom: `1px dashed ${theme.palette.divider}`,
  ':last-of-type': { borderBottom: 'none' },
  width: '100%',
  height: theme.spacing(8)
}));

const CalendarSpotArea = styled(CardActionArea)({
  width: '100%',
  height: '100%'
});

type CalendarSpotProps = {
  /**
   * Callback to run when the card area of the spot is clicked
   *
   * @default undefined
   */
  onClick?: EmptyHandler;
};

const CalendarSpot = ({ onClick }: CalendarSpotProps) => (
  <Li>
    <CalendarSpotArea data-testid="calendar-spot" onClick={onClick} />
  </Li>
);
export default CalendarSpot;
