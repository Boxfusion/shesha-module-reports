declare module 'react-xml-viewer' {
  import * as React from 'react';

  interface IXmlTheme {
    attributeKeyColor?: string;
    attributeValueColor?: string;
    cdataColor?: string;
    commentColor?: string;
    separatorColor?: string;
    tagColor?: string;
    textColor?: string;
    overflowBreak?: boolean;
  }

  export interface IXMLViewerProps {
    xml: string;
    indentSize?: number;
    invalidXml?: React.ReactNode;
    collapsible?: boolean;
    theme?: IXmlTheme;
  }

  const XMLViewer: React.FC<IXMLViewerProps>;

  export default XMLViewer;
}
