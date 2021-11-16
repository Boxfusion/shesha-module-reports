import React, { FC, useEffect, useMemo, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import 'devexpress-reporting/dx-reportdesigner';
import ko from 'knockout';
import { IndexToolbar, MainLayout, useShaRouting, useSheshaApplication } from 'shesha-reactjs';

const PATH = 'api/ReportDesigner/GetReportDesignerModel';

export interface IReportDesignerPageProps {}

export const ReportDesignerPage: FC<IReportDesignerPageProps> = () => {
  const { router } = useShaRouting();
  const { backendUrl } = useSheshaApplication();
  const designer = useRef<HTMLDivElement>(null);
  const { push, query } = router;

  console.log('ko: ', ko);

  const id = query?.id?.toString();

  const reportUrl = ko?.observable(id);

  const requestOptions = useMemo(() => {
    return {
      host: backendUrl,
      getDesignerModelAction: backendUrl?.endsWith('/') ? PATH : `/${PATH}`,
    };
  }, [backendUrl]);

  useEffect(() => {
    if (designer?.current) {
      ko.applyBindings(
        {
          reportUrl, // : reportUrl + '?incidentType=0a2ef29f-2ccd-4463-9863-8834c0c82643',
          requestOptions,
        },
        designer.current,
      );
    }

    const designerRef = designer?.current;

    return function cleanup() {
      if (designerRef) {
        ko?.cleanNode(designerRef);
      }
    };
  }, [reportUrl, requestOptions]);

  return (
    <MainLayout
      title="Report designer"
      description="This is the Report designer Page"
      toolbar={
        <IndexToolbar
          items={[
            {
              title: 'Close',
              onClick: () => push('/reports'),
              icon: <CloseOutlined />,
            },
          ]}
        />
      }
    >
      <div style={{ width: '100%', height: '1000px' }}>
        <div ref={designer} data-bind="dxReportDesigner: $data" />
      </div>
    </MainLayout>
  );
};

export default ReportDesignerPage;
