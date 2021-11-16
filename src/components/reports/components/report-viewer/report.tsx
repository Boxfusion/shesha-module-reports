import React, { FC, memo } from 'react';
import 'devexpress-reporting/dx-webdocumentviewer';

interface IReport {
  designer?: React.RefObject<HTMLDivElement>;
}

export const Report: FC<IReport> = memo(({ designer }) => {
  return <div ref={designer} data-bind="dxReportViewer: $data" />;
});
