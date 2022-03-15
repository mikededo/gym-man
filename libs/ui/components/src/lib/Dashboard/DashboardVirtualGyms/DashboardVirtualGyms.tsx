import Link from 'next/link';

import { VirtualGymDTO } from '@hubbl/shared/models/dto';
import { EmptyHandler } from '@hubbl/shared/types';
import { Grid, Stack, styled, Typography } from '@mui/material';

import AddItemPlaceholder from '../../AddItemPlaceholder';
import DashboardVirtualGym from '../DashboardVirtualGym';

export type DashboardVirtualGymsProps = {
  /**
   * List of `VirtualGym`'s to display
   */
  items: VirtualGymDTO[];

  /**
   * Callback to run when the add placeholder has been clicked
   *
   * @default undefined
   */
  onAddVirtualGym?: EmptyHandler;
};

const PlaceholderText = styled(Typography)({
  textAlign: 'center',
  width: '75%'
});

const DashboardVirtualGyms = ({
  items,
  onAddVirtualGym
}: DashboardVirtualGymsProps) => (
  <Stack gap={4}>
    <Typography variant="h5">VIRTUAL GYMS</Typography>

    <Grid direction="row" gap={4} container>
      {items.slice(0, Math.min(items.length, 5)).map((virtualGym) => (
        <Grid key={virtualGym.id} item>
          <Link href={`/virtual-gyms/${virtualGym.id}`} passHref>
            <DashboardVirtualGym virtualGym={virtualGym} />
          </Link>
        </Grid>
      ))}

      <Grid item>
        <AddItemPlaceholder
          title="add-virtual-gym"
          height={25}
          width={44}
          onClick={onAddVirtualGym}
        >
          <PlaceholderText variant="placeholder">
            Click me to create a new virtual gym!
          </PlaceholderText>
        </AddItemPlaceholder>
      </Grid>
    </Grid>
  </Stack>
);

export default DashboardVirtualGyms;
