import { Col, List, Row, Tooltip } from 'antd';
import _ from 'lodash';
import React, { FC, useEffect } from 'react';
import { CollapsiblePanel, MainLayout, SectionSeparator, ShaSpin, useUi, ValidationErrors } from 'shesha-reactjs';
import { nanoid } from 'nanoid';
import { ReportingReportDto, useReportingReportGetAll } from 'apis/reportingReport';

export interface IReportsDefinitionsPageProps {
  reportViewerPageUrl?: string;
}

export const ReportsDefinitionsPage: FC<IReportsDefinitionsPageProps> = ({
  reportViewerPageUrl = '/reports/viewer',
}) => {
  const { gutter } = useUi();

  const { refetch, data, loading, error } = useReportingReportGetAll({ lazy: true });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const allReportingReports = data?.result?.items;

  const result = _.chunk(
    _.chain(allReportingReports)
      .groupBy((x) => x.category.item)
      .map((v: any, i: any) => {
        return {
          name: i as string,
          reports: v as ReportingReportDto[],
        };
      })
      .value(),
    2,
  );

  return (
    <MainLayout title="Reports">
      <ValidationErrors error={error as any} />

      <ShaSpin spinning={loading}>
        <CollapsiblePanel>
          <>
            {result.map((item, index) => (
              <Row gutter={gutter} id={`row_${index}`} key={nanoid()}>
                {item.map(({ name, reports }, i) => (
                  <Col span={12} id={`col_${i}_row_${index}`} key={nanoid()}>
                    <List
                      key={nanoid()}
                      header={
                        <h2>
                          <SectionSeparator sectionName={name} />
                        </h2>
                      }
                      dataSource={reports?.filter(({ showInReportsMenu }) => showInReportsMenu)}
                      bordered={false}
                      renderItem={({ id, displayName, description }: any) => (
                        <List.Item key={nanoid()}>
                          <Tooltip placement="right" title={description}>
                            <a
                              href={
                                reportViewerPageUrl?.includes('?')
                                  ? `${reportViewerPageUrl}&id=${id}`
                                  : `${reportViewerPageUrl}?id=${id}`
                              }
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
      </ShaSpin>
    </MainLayout>
  );
};

export default ReportsDefinitionsPage;
