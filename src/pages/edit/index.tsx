import React, { FC } from 'react';
import { GenericEditPage, useShaRouting } from 'shesha-reactjs';
import { useReportingReportGet, useReportingReportUpdate } from '../../apis/reportingReport';

export interface IEditReportPageProps {}

export const EditReportPage: FC<IEditReportPageProps> = () => {
  const { router } = useShaRouting();

  const id = router?.query?.id?.toString();

  return (
    <GenericEditPage
      title={() => 'Edit Report Details'}
      id={id}
      fetcher={useReportingReportGet}
      updater={useReportingReportUpdate}
    />
  );
};

export default EditReportPage;
