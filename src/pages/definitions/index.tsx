import { Col, List, Row, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useEffect } from 'react';
import {
  CollapsiblePanel,
  getDefaultLayout,
  Page,
  PageWithLayout,
  SectionSeparator,
  useShaRouting,
  useUi,
  ValidationErrors,
} from '@shesha/reactjs';
import { nanoid } from 'nanoid';
import { ReportingReportDto, useReportingReportGetAll } from 'apis/reportingReport';

export interface IReportsDefinitionsPageProps {
  reportViewerPageUrl?: string;
}

export const ReportsDefinitionsPage: PageWithLayout<IReportsDefinitionsPageProps> = ({
  reportViewerPageUrl = '/reports/viewer',
}) => {
  const { gutter } = useUi();
  const { router } = useShaRouting();

  const { refetch, data, loading, error } = useReportingReportGetAll({ lazy: true });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const allReportingReports = data?.result?.items?.filter(({ showInReportsMenu }) => showInReportsMenu);

  const result = _.chunk(
    _.chain(allReportingReports)
      .groupBy((x) => x?.category?.item)
      .map((v: any, i: any) => {
        return {
          name: i as string,
          reports: v as ReportingReportDto[],
        };
      })
      .value(),
    2,
  );

  const getRedirectUrl = (reportId: string) =>
    reportViewerPageUrl?.includes('?')
      ? `${reportViewerPageUrl}&id=${reportId}`
      : `${reportViewerPageUrl}?id=${reportId}`;

  const redirectToReportViewerPage = (reportId: string) => {
    const url = getRedirectUrl(reportId);

    if (router?.push) {
      router?.push(url);
    } else {
      window.location.assign(url);
    }
  };

  return (
    <Page title="Reports" loading={loading}>
      <ValidationErrors error={error as any} />

      <CollapsiblePanel>
        <>
          {result.map((item, index) => (
            <Row gutter={gutter} id={`row_${index}`} key={nanoid()}>
              {item.map(({ name, reports }, i) => (
                <Col span={12} id={`col_${i}_row_${index}`} key={nanoid()}>
                  <List
                    key={`col_row_${name}`}
                    header={
                      <h2>
                        <SectionSeparator sectionName={name} />
                      </h2>
                    }
                    dataSource={reports}
                    bordered={false}
                    renderItem={({ id, displayName, description }: any) => (
                      <List.Item key={nanoid()}>
                        <Tooltip placement="right" title={description}>
                          <a
                            href={getRedirectUrl(id)}
                            onClick={(e) => {
                              e.preventDefault();
                              redirectToReportViewerPage(id);
                            }}
                          >
                            {displayName}
                          </a>
                        </Tooltip>
                      </List.Item>
                    )}
                  />
                </Col>
              ))}
            </Row>
          ))}
        </>
      </CollapsiblePanel>
    </Page>
  );
};

ReportsDefinitionsPage.getLayout = getDefaultLayout;

export default ReportsDefinitionsPage;
