/* eslint-disable import/no-duplicates */
import ko from 'knockout';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AsyncExportApproach, JSReportViewer, PreviewElements } from 'devexpress-reporting/dx-webdocumentviewer';
import { Button, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { IAnyObject, useSheshaApplication } from '@shesha/reactjs';
import { useEffectOnce } from 'react-use';
import { ReportingReportParameterDto } from 'apis/reportingReportParameter';
import { ParametersFilter } from './parametersFilter';
import 'devexpress-reporting/dx-webdocumentviewer';

interface IReportViewerPartialProps {
  id: string;
  parameters: ReportingReportParameterDto[];
}

const PATH = 'DXXRDV';

interface IReportViewerPartialState {
  isDrawerShown?: boolean;
}

export const ReportViewerPartial: FC<IReportViewerPartialProps> = ({ id, parameters }) => {
  const [state, setState] = useState<IReportViewerPartialState>({ isDrawerShown: false });
  const reportDesignerBindingRef = useRef<JSReportViewer>();

  const { backendUrl } = useSheshaApplication();

  const designer = useRef<HTMLDivElement>(null);

  const reportUrl = ko?.observable(id);

  const requestOptions = useMemo(() => {
    return {
      host: backendUrl,
      invokeAction: backendUrl?.endsWith('/') ? PATH : `/${PATH}`,
    };
  }, [backendUrl]);

  const showDrawer = () => setState((prevState) => ({ ...prevState, isDrawerShown: true }));

  const hideDrawer = () => setState((prevState) => ({ ...prevState, isDrawerShown: false }));

  const callbacks = useMemo(() => {
    return {
      CustomizeElements(_: any, e: any) {
        const panelPart = e.GetById(PreviewElements.RightPanel);
        const index = e.Elements.indexOf(panelPart);
        e.Elements.splice(index, 1);
      },
      BeforeRender(s: JSReportViewer) {
        AsyncExportApproach(true);

        reportDesignerBindingRef.current = s;
      },
      DocumentReady(s: any, e: any) {
        console.log('DocumentReady s, e: ', s, e);
        hideDrawer();
      },
      ServerError(s: any, e: any) {
        console.log('ServerError s, e: ', s, e);
        hideDrawer();
      },
    };
  }, []);

  useEffectOnce(() => {
    if (designer?.current) {
      ko.applyBindings(
        {
          reportUrl, // : reportUrl + '?incidentType=0a2ef29f-2ccd-4463-9863-8834c0c82643',
          requestOptions,
          callbacks,
        },
        designer?.current,
      );
    }

    const designerRef = designer?.current;

    return function cleanup() {
      if (designerRef) {
        ko?.cleanNode(designerRef);
      }
    };
  });

  useEffect(() => {
    if (parameters) {
      setTimeout(() => {
        showDrawer();
      }, 500);
    }
  }, [parameters]);

  const clearPreviousFilters = () => {
    const binding = reportDesignerBindingRef?.current;

    parameters?.forEach((val) => {
      if (
        typeof binding?.GetParametersModel === 'function' &&
        typeof val?.internalName === 'string' &&
        binding.GetParametersModel() &&
        binding.GetParametersModel()[val?.internalName]
      ) {
        binding.GetParametersModel()[val?.internalName](null);
      }
    });
  };

  const onApply = (params: IAnyObject) => {
    hideDrawer();

    clearPreviousFilters();

    const binding = reportDesignerBindingRef?.current;

    if (typeof binding?.GetParametersModel === 'function') {
      Object.keys(params)?.forEach((key) => {
        console.log('onApply In forEach');

        binding.GetParametersModel()[key](params[key]);
      });
    }

    binding?.StartBuild();
  };

  return (
    <div
      className="dx-report-viewer-container"
      style={{
        height: '100vh',
        position: 'relative',
      }}
    >
      {!!parameters?.length && (
        <div
          className={classNames('dx-report-filter-btn-container', {
            hidden: state?.isDrawerShown,
          })}
          style={{
            position: 'absolute',
            right: 12,
            // zIndex: 10000,
            top: 15,
          }}
        >
          <Button type="link" onClick={showDrawer} icon={<FilterOutlined style={{ fontSize: 26 }} />} />
        </div>
      )}

      {/* <Report designer={designer} /> */}

      <div ref={designer} data-bind="dxReportViewer: $data" />

      <Drawer
        title="Filters"
        placement="right"
        closable={false}
        onClose={hideDrawer}
        visible={state?.isDrawerShown}
        getContainer={false}
        style={{ marginTop: 55 }}
        className="report-parameters-drawer"
        width={550}
        mask={false}
      >
        <ParametersFilter id={id} onApply={onApply} onCancel={hideDrawer} parameters={parameters} />
      </Drawer>
    </div>
  );
};

export default ReportViewerPartial;
