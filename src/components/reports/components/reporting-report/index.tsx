import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  QrcodeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Modal } from 'antd';
import React, { FC, useRef, useState } from 'react';
import { GenericCreateModal, IShaDataTableProps, IToolbarItem, SimpleIndexPage } from '@shesha/reactjs';
// import { DataTableFullInstance } from '@shesha/reactjs/dist/providers/dataTable/contexts';
import { useReportingReportDelete, useReportingReportCreate } from 'apis/reportingReport';

interface IReportingReportProps {
  /**
   * Report designer child table id
   */
  tableConfigId?: string;

  /**
   * Reporting report details page
   *
   * @default - '/reports/reporting-report/details'
   */
  reportsDetailsPageUrl?: string;

  /**
   * Reporting report edit page
   *
   * @default - '/reports/reporting-report/edit'
   */
  reportEditPageUrl?: string;

  /**
   * Report designer page
   *
   * @default - '/reports/report-designer'
   */
  reportDesignerPageUrl?: string;

  /**
   * Report viewer page
   *
   * @default - '/reports/report-viewer'
   */
  reportViewerPageUrl?: string;
}

const ReportingReport: FC<IReportingReportProps> = ({
  tableConfigId = 'ReportingReport_Index',
  reportsDetailsPageUrl = '/reports/details',
  reportEditPageUrl = '/reports/edit',
  reportDesignerPageUrl = '/reports/designer',
  reportViewerPageUrl = '/reports/viewer',
}) => {
  const { mutate } = useReportingReportDelete({});

  const [showCreateModal, setShowCreateModal] = useState(false);

  const tableRef = useRef<any>();

  const toggleCreateModalVisibility = () => setShowCreateModal((visible) => !visible);

  const onDelete = (id: string, _: any, data: any) => {
    Modal.confirm({
      title: (
        <span>
          Delete <strong>{data?.DisplayName}</strong>
        </span>
      ),
      content: (
        <span>
          Please note that this action will delete <strong>{data?.DisplayName}</strong> from the Database and this
          action is not reversible
        </span>
      ),
      okText: 'Delete Anyway',
      onOk: () =>
        mutate(undefined, { queryParams: { id } }).then(() => {
          tableRef?.current?.refreshTable();
        }),
    });
  };

  const onSuccess = () => {
    tableRef?.current?.refreshTable();
    setShowCreateModal(false);
  };

  const tableProps: IShaDataTableProps = {
    id: tableConfigId,
    header: 'All Reports',
    actionColumns: [
      {
        icon: <SearchOutlined />,
        onClick: (id: string) => `${reportsDetailsPageUrl}?id=${id}`,
      },
      {
        icon: <EditOutlined />,
        onClick: (id: string) => `${reportEditPageUrl}?id=${id}`,
      },
      {
        icon: <QrcodeOutlined />,
        onClick: (id: string) => `${reportDesignerPageUrl}?id=${id}`,
      },
      {
        icon: <EyeOutlined />,
        onClick: (id: string) => `${reportViewerPageUrl}?id=${id}`,
      },
      {
        icon: <DeleteOutlined />,
        onClick: onDelete,
      },
    ],
  };

  const toolbarItems: IToolbarItem[] = [
    {
      title: 'Add New',
      icon: <PlusOutlined />,
      onClick: toggleCreateModalVisibility,
    },
  ];

  return (
    <>
      <SimpleIndexPage title="All Reports" tableConfigId={tableConfigId} toolbarItems={toolbarItems} {...tableProps} />

      <GenericCreateModal
        title="Create New Report"
        visible={showCreateModal}
        formPath="/reports/reporting-report/create"
        updater={useReportingReportCreate}
        onCancel={toggleCreateModalVisibility}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default ReportingReport;
