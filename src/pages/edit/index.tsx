import React, { FC } from 'react';
import { GenericEditPage, useShaRouting } from '@shesha/reactjs';
import { useReportingReportGet, useReportingReportUpdate } from 'apis/reportingReport';
import markup from './formMarkup.json';

export interface IEditReportPageProps {
  id?: string;
}

export const EditReportPage: FC<IEditReportPageProps> = ({ id }) => {
  const { router } = useShaRouting();

  const reportId = id || router?.query?.id?.toString();

  return (
    <GenericEditPage
      title={() => 'Edit Report Details'}
      // formPath="/reports/edit"
      markup={markup as any}
      id={reportId}
      fetcher={useReportingReportGet}
      updater={useReportingReportUpdate}
    />
  );
};

export default EditReportPage;
