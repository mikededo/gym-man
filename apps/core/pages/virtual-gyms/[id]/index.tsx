import { PageHeader } from '@hubbl/ui/components';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

import { BaseLayout, GeneralPages } from '../../../components';

const VirtualGym = () => {
  const router = useRouter();
  

  console.log(router.query.id)

    return <>
      <PageHeader
        title="Virtual gym"
        breadcrumbs={[
          { href: '/virtual-gyms', label: 'Virtual gyms' },
          { href: '/virtual-gyms/id', label: 'Virtual gym name' }
        ]}
      />
    </>;
};

VirtualGym.getLayout = (page: ReactElement) => (
  <GeneralPages>
    <BaseLayout header="Gym name" selected="virtualGyms">
      {page}
    </BaseLayout>
  </GeneralPages>
);

export default VirtualGym;
