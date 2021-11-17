import React, { FC, useEffect } from 'react';
import { IndexToolbar, MainLayout, useShaRouting } from '@shesha/reactjs';
import { CloseOutlined } from '@ant-design/icons';
import { usePrevious } from 'react-use';
import { useWindow } from 'hooks';
import { useReportingReportGet, useReportingReportGetParameters } from 'apis/reportingReport';
import { ReportViewerPartial } from 'components/reports/components/report-viewer';

export interface IReportViewerPageProps {
  id?: string;
}

export const ReportViewerPage: FC<IReportViewerPageProps> = ({ id: idParam }) => {
  const { router } = useShaRouting();
  const window = useWindow();

  const id: string = idParam || router?.query?.id?.toString() || '';

  const { refetch, data: reportResponse, loading: isFetchingReport } = useReportingReportGet({ queryParams: { id } });
  const { refetch: fetchFetchReportParameters, data: reportParametersResponse } = useReportingReportGetParameters({
    queryParams: { reportId: id },
    lazy: true,
  });

  const prevId = usePrevious(id);

  // When the id changes, fetch the report
  useEffect(() => {
    if (id && prevId !== id) {
      refetch();
    }
  }, [id, refetch, prevId]);

  // When the done fetching the report, fetch the parameters
  useEffect(() => {
    if (!isFetchingReport && reportResponse) {
      fetchFetchReportParameters();
    }
  }, [isFetchingReport, reportResponse, fetchFetchReportParameters]);

  const displayName = reportResponse?.result?.displayName;

  const showDesigner = !!window && !!id && reportResponse?.success;

  return (
    <MainLayout
      title={displayName ? `${reportResponse?.result?.category?.item} : ${displayName}` : 'Report Viewer'}
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
        {showDesigner ? <ReportViewerPartial id={id} parameters={reportParametersResponse?.result || []} /> : null}
      </div>
    </MainLayout>
  );
};

export default ReportViewerPage;
