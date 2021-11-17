import {
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import React, { FC, useState, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import XMLViewer from 'react-xml-viewer';
import { useMutate } from 'restful-react';
import {
  ChildTable,
  DataTableProvider,
  GenericCreateModal,
  GenericDetailsPage,
  GenericEditModal,
  IDataTableInstance,
  useShaRouting,
} from '@shesha/reactjs';
import { ReportingReportDto, ReportingReportParameterDto, useReportingReportGet } from 'apis/reportingReport';
import {
  useReportingReportParameterCreate,
  useReportingReportParameterGet,
  useReportingReportParameterUpdate,
} from 'apis/reportingReportParameter';
import markup from './formMarkup.json';

export interface IReportingReportDetailsProps {
  /**
   * Report index page url
   *
   * @default - '/reports/reporting-report'
   */
  reportPageUrl?: string;

  /**
   * Reporting report edit page
   *
   * @default - '/reports/reporting-report/edit'
   */
  reportEditPageUrl?: string;

  id?: string;
}

interface IDetailsReportPageState {
  isModalOpen?: boolean;
  selectedReportParamId?: string;
  report?: ReportingReportDto;
  reportModalMode?: 'edit' | 'create';
}

const INITIAL_STATE: IDetailsReportPageState = {
  isModalOpen: false,
  selectedReportParamId: '',
  reportModalMode: undefined,
};

const customTheme = {
  attributeKeyColor: '#0074D9',
  attributeValueColor: '#2ECC40',
};

export const ReportingReportDetailsPage: FC<IReportingReportDetailsProps> = ({
  id: reportId,
  reportPageUrl = '/reports',
  reportEditPageUrl = '/reports/edit',
}) => {
  const { router } = useShaRouting();
  const { query, push } = router || { push: (_) => null };
  const [state, setState] = useState<IDetailsReportPageState>(INITIAL_STATE);
  const { mutate: deleteParameterHttp } = useMutate({
    verb: 'DELETE',
    path: '/api/services/Reporting/ReportingReportParameter/Delete',
  });

  const id = reportId || query?.id?.toString();

  const tableRef = useRef<IDataTableInstance>(null);

  const onAddClick = () => setState((prev) => ({ ...prev, isModalOpen: true, reportModalMode: 'create' }));

  const onEditClick = (selectedReportParamId: string) =>
    setState((prev) => ({ ...prev, isModalOpen: true, reportModalMode: 'edit', selectedReportParamId }));

  const onCloseModalClick = () =>
    setState((prev) => ({ ...prev, isModalOpen: false, reportModalMode: undefined, selectedReportParamId: undefined }));

  const onDeleteParam = (_id: string, _: any, data: any) => {
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
        deleteParameterHttp(`?id=${_id}`).then(() => {
          tableRef?.current?.refreshTable();
        }),
    });
  };

  const onSuccess = () => {
    tableRef?.current?.refreshTable();
    onCloseModalClick();
  };

  const isCreateModalOpen = state?.isModalOpen && state?.reportModalMode === 'create';

  const isEditModalOpen = state?.isModalOpen && state?.reportModalMode === 'edit';

  const prepareValues = (values: any) => {
    const prepared: ReportingReportParameterDto = {
      ...values,
      reportingReport: { id },
    };

    return prepared;
  };

  const onCopyToClipboard = (data: ReportingReportDto) => {
    navigator?.clipboard?.writeText(data?.reportDefinitionXml as string);

    message.success('Text copied successfully!');
  };

  const onDataLoaded = (report: ReportingReportDto) => setState((prev) => ({ ...prev, report }));

  return (
    <>
      <GenericDetailsPage
        id={id}
        title={(data) => `${data?.category?.item}: ${data?.displayName}`}
        toolbarItems={[
          {
            title: 'Edit',
            icon: <EditOutlined />,
            onClick: () => push(`${reportEditPageUrl}?id=${id}`),
          },
          {
            title: 'Cancel',
            icon: <CloseOutlined />,
            onClick: () => push(reportPageUrl),
          },
        ]}
        onDataLoaded={onDataLoaded}
        fetcher={useReportingReportGet}
        markup={markup as any}
        formPath="/reports/reporting-report/details"
        formSections={{
          reportingReportsChildTable: () => (
            <DataTableProvider tableId="ReportingReportParameter_ChildTable_Index" parentEntityId={id}>
              <ChildTable
                id="ReportingReportParameter_ChildTable_Index"
                header="Parameters"
                toolbarItems={[
                  {
                    title: 'Add',
                    icon: <PlusOutlined />,
                    onClick: onAddClick,
                  },
                ]}
                actionColumns={[
                  {
                    onClick: onEditClick,
                    icon: <SearchOutlined />,
                  },
                  {
                    onClick: onDeleteParam,
                    icon: <DeleteOutlined />,
                  },
                ]}
                tableRef={tableRef}
              />
            </DataTableProvider>
          ),
          reportXmlDefinition: (data: ReportingReportDto) => {
            console.log('data.reportDefinitionXml: ', data.reportDefinitionXml);

            return (
              <div>
                <div style={{ marginBottom: 6 }}>
                  <Button icon={<CopyOutlined />} size="small" onClick={() => onCopyToClipboard(data)}>
                    Copy to clipboard
                  </Button>
                </div>
                <Space />
                <div style={{ overflow: 'auto', width: '100%', maxHeight: 560 }}>
                  <XMLViewer xml={data.reportDefinitionXml || ''} theme={customTheme} indentSize={4} collapsible />
                </div>
              </div>
            );
          },
        }}
      />

      <GenericCreateModal
        visible={isCreateModalOpen as boolean}
        onCancel={onCloseModalClick}
        onSuccess={onSuccess}
        updater={useReportingReportParameterCreate}
        title="Reporting Reports Parameter"
        formPath="/reports/reporting-report/add-parameter"
        prepareValues={prepareValues}
      />

      {isEditModalOpen && (
        <GenericEditModal
          id={state?.selectedReportParamId as string}
          visible={isEditModalOpen && !!state?.selectedReportParamId}
          onCancel={onCloseModalClick}
          fetcher={useReportingReportParameterGet}
          onSuccess={onSuccess}
          updater={useReportingReportParameterUpdate}
          title={() => 'Reporting Reports Parameter'}
          formPath="/reports/reporting-report/add-parameter"
          prepareValues={prepareValues}
        />
      )}
    </>
  );
};

export default ReportingReportDetailsPage;
