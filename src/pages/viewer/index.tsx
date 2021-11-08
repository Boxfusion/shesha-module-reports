import React, { FC, useEffect } from 'react';
import { IndexToolbar, MainLayout, useShaRouting } from 'shesha-reactjs';
import { CloseOutlined } from '@ant-design/icons';
import { useReportingReportGet } from '../../apis/reportingReport';
import { ReportViewerPartial } from '../../components/reports/components/report-viewer';

export interface IReportViewerPageProps {}

export const ReportViewerPage: FC<IReportViewerPageProps> = () => {
  const { router } = useShaRouting();

  const id = router?.query?.id?.toString();

  const { refetch, data } = useReportingReportGet({ queryParams: { id } });

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  const displayName = data?.result?.displayName;

  return (
    <MainLayout
      title={displayName ? `${data?.result?.category?.item} : ${displayName}` : 'Report Viewer'}
      description="This is the Report View Page"
      toolbar={
        <IndexToolbar
          items={[
            {
              title: 'Close',
              onClick: () => router?.push('/reports'),
              icon: <CloseOutlined />,
            },
          ]}
        />
      }
    >
      <div className="sha-report-viewer-page">
        <ReportViewerPartial id={id} />
      </div>
    </MainLayout>
  );
};

export default ReportViewerPage;
