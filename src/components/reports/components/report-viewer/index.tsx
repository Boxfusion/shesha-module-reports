/* eslint-disable import/no-duplicates */
import ko from 'knockout';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AsyncExportApproach, JSReportViewer, PreviewElements } from 'devexpress-reporting/dx-webdocumentviewer';
import { Button, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { IAnyObject, usePrevious, useSheshaApplication } from 'shesha-reactjs';
import fastDeepEqual from 'fast-deep-equal';
import { memoize } from 'lodash';
import { ReportingReportParameterDto } from 'apis/reportingReportParameter';
import { useReportingReportGetParameters } from 'apis/reportingReport';
import { ParametersFilter } from './parametersFilter';

import { Report } from './report';

interface IReportViewerPartialProps {
  id: string;
}

const PATH = 'DXXRDV';

export const ReportViewerPartial: FC<IReportViewerPartialProps> = ({ id }) => {
  const [isDrawerShown, setIsDrawerShown] = useState(false);
  const [isFilterBtnHidden, setFilterBtnHidden] = useState(false);
  const reportDesignerBindingRef = useRef<JSReportViewer>();

  const { backendUrl } = useSheshaApplication();

  const { refetch, data } = useReportingReportGetParameters({ queryParams: { reportId: id }, lazy: true });

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const designer = useRef<HTMLDivElement>(null);

  const reportUrl = ko?.observable(id);

  const requestOptions = useMemo(() => {
    return {
      host: backendUrl,
      invokeAction: backendUrl?.endsWith('/') ? PATH : `/${PATH}`,
    };
  }, [backendUrl]);

  // const callbacks = useMemo(() => {
  //   return {
  //     CustomizeElements(_: any, e: any) {
  //       const panelPart = e.GetById(PreviewElements.RightPanel);
  //       const index = e.Elements.indexOf(panelPart);
  //       e.Elements.splice(index, 1);
  //     },
  //     BeforeRender(s: JSReportViewer) {
  //       AsyncExportApproach(true);
  //       // console.log('BeforeRender s: ', s);
  //       // console.log('BeforeRender s.previewModel._disposables.length: ', s.previewModel._disposables.length);
  //       // console.log('BeforeRender s.previewModel.rootStyle: ', s.previewModel.rootStyle);
  //       // console.log('BeforeRender s.previewExists(): ', s.previewExists());

  //       // // console.log('BeforeRender Object.keys(s.previewModel): ', Object.keys(s.previewModel));
  //       // console.log('BeforeRender Object.keys(s.previewModel).length: ', Object.keys(s.previewModel).length);

  //       reportDesignerBindingRef.current = s;
  //     },
  //   };
  // }, []);

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
      console.log();

      ko.applyBindings(
        {
          reportUrl, // : reportUrl + '?incidentType=0a2ef29f-2ccd-4463-9863-8834c0c82643',
          requestOptions,
          callbacks: {
            CustomizeElements(_: any, e: any) {
              const panelPart = e.GetById(PreviewElements.RightPanel);
              const index = e.Elements.indexOf(panelPart);
              e.Elements.splice(index, 1);
            },
            BeforeRender(s: JSReportViewer) {
              AsyncExportApproach(true);
              // console.log('BeforeRender s: ', s);
              // console.log('BeforeRender s.previewModel._disposables.length: ', s.previewModel._disposables.length);
              // console.log('BeforeRender s.previewModel.rootStyle: ', s.previewModel.rootStyle);
              // console.log('BeforeRender s.previewExists(): ', s.previewExists());

              // // console.log('BeforeRender Object.keys(s.previewModel): ', Object.keys(s.previewModel));
              // console.log('BeforeRender Object.keys(s.previewModel).length: ', Object.keys(s.previewModel).length);

              reportDesignerBindingRef.current = s;
            },
          },
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
  }, [reportUrl, requestOptions]);

  const showDrawer = () => setIsDrawerShown(true);

  const hideDrawer = () => setIsDrawerShown(false);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        showDrawer();
      }, 500);
    }
  }, [data]);

  const clearPreviousFilters = () => {
    const binding = reportDesignerBindingRef?.current;

    data?.result?.forEach((val) => {
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

    // clearPreviousFilters();

    const binding = reportDesignerBindingRef?.current;

    // console.log('binding?.GetParametersModel', binding?.GetParametersModel());

    if (typeof binding?.GetParametersModel === 'function') {
      Object.keys(params)?.forEach((key) => {
        console.log('onApply In forEach');

        binding.GetParametersModel()[key](params[key]);
      });
    }

    try {
      binding?.StartBuild();
    } catch (error) {
      console.log('error: ', error);
    }
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

      {/* <Report designer={designer} /> */}

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
