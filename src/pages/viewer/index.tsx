import React, { FC, useEffect } from 'react';
import { IndexToolbar, MainLayout, useShaRouting } from 'shesha-reactjs';
import { CloseOutlined } from '@ant-design/icons';
import { usePrevious } from 'react-use';
import { useQueryParams } from 'hooks';
import { useReportingReportGet } from 'apis/reportingReport';
import { ReportViewerPartial } from 'components/reports/components/report-viewer';

export interface IReportViewerPageProps {
  id?: string;
}

export const ReportViewerPage: FC<IReportViewerPageProps> = ({ id: idParam }) => {
  const { router } = useShaRouting();

  const id: string = router?.query?.id?.toString() || idParam;

  const { refetch, data } = useReportingReportGet({ queryParams: { id } });

  const prevId = usePrevious(id);

  useEffect(() => {
    if (id && prevId !== id) {
      refetch();
    }
  }, [id, refetch, prevId]);

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
        {typeof window !== undefined && id ? <ReportViewerPartial id={id} /> : null}
      </div>
    </MainLayout>
  );
};

export default ReportViewerPage;
