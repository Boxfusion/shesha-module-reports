import ko from 'knockout';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AsyncExportApproach, PreviewElements } from 'devexpress-reporting/dx-webdocumentviewer';
import { Button, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { IAnyObject, useSheshaApplication } from 'shesha-reactjs';
import { ReportingReportParameterDto } from 'apis/reportingReportParameter';
import { useReportingReportGetParameters } from '../../../../apis/reportingReport';
import { ParametersFilter } from './parametersFilter';

interface IReportViewerPartialProps {
  id: string;
}

const PATH = 'DXXRDV';

export const ReportViewerPartial: FC<IReportViewerPartialProps> = ({ id }) => {
  const { backendUrl } = useSheshaApplication();
  const [isDrawerShown, setIsDrawerShown] = useState(false);
  const [isFilterBtnHidden, setFilterBtnHidden] = useState(false);
  const [reportDesignerBinding, setReportDesignerBinding] = useState<IAnyObject>();
  const { refetch, data } = useReportingReportGetParameters({ queryParams: { reportId: id }, lazy: true });

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const designer = useRef<HTMLDivElement>(null);

  // let reportUrl = id;
  const reportUrl = ko.observable(id);

  const requestOptions = useMemo(() => {
    return {
      host: backendUrl,
      invokeAction: backendUrl?.endsWith('/') ? PATH : `/${PATH}`,
    };
  }, [backendUrl]);

  const callbacks = useMemo(() => {
    return {
      CustomizeElements(_: any, e: any) {
        const panelPart = e.GetById(PreviewElements.RightPanel);
        const index = e.Elements.indexOf(panelPart);
        e.Elements.splice(index, 1);
      },
      BeforeRender(s: IAnyObject) {
        AsyncExportApproach(true);
        setReportDesignerBinding(s);
      },
    };
  }, []);

  useEffect(() => {
    if (isDrawerShown) {
      setFilterBtnHidden(true);
    } else {
      setTimeout(() => {
        setFilterBtnHidden(false);
      }, 400);
    }
  }, [isDrawerShown]);

  useEffect(() => {
    if (designer?.current) {
      ko.applyBindings(
        {
          reportUrl, // : reportUrl + '?incidentType=0a2ef29f-2ccd-4463-9863-8834c0c82643',
          requestOptions,
          callbacks,
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
  }, [callbacks, reportUrl, requestOptions]);

  const showDrawer = () => setIsDrawerShown(true);

  const hideDrawer = () => setIsDrawerShown(false);

  useEffect(() => {
    if (data?.result?.length) {
      setTimeout(() => {
        showDrawer();
      }, 500);
    }
  }, [data?.result]);

  const clearPreviousFilters = () =>
    data?.result?.forEach((val) => {
      if (typeof val?.internalName === 'string') {
        reportDesignerBinding?.GetParametersModel()[val?.internalName](null);
      }
    });

  const onApply = (params: IAnyObject) => {
    hideDrawer();

    clearPreviousFilters();

    if (typeof reportDesignerBinding?.GetParametersModel === 'function') {
      Object.keys(params)?.forEach((key) => {
        reportDesignerBinding.GetParametersModel()[key](params[key]);
      });
    }
    reportDesignerBinding?.StartBuild();
  };

  return (
    <div
      className="dx-report-viewer-container"
      style={{
        height: '100vh',
        position: 'relative',
      }}
    >
      {!!data?.result?.length && (
        <div
          className={classNames('dx-report-filter-btn-container', {
            hidden: isFilterBtnHidden,
          })}
          style={{
            position: 'absolute',
            right: 12,
            zIndex: 10000,
            top: 15,
          }}
        >
          <Button type="link" onClick={showDrawer} icon={<FilterOutlined style={{ fontSize: 26 }} />} />
        </div>
      )}

      <div ref={designer} data-bind="dxReportViewer: $data" />

      <Drawer
        title="Filters"
        placement="right"
        closable={false}
        onClose={hideDrawer}
        visible={isDrawerShown}
        getContainer={false}
        style={{ marginTop: 37.5 }}
        className="report-parameters-drawer"
        width={550}
        mask={false}
      >
        <ParametersFilter
          id={id}
          onApply={onApply}
          onCancel={hideDrawer}
          parameters={data?.result as ReportingReportParameterDto[]}
        />
      </Drawer>
    </div>
  );
};

export default ReportViewerPartial;
