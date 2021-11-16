import React, { FC } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, TimePicker } from 'antd';
import moment, { isMoment } from 'moment';
import { Store } from 'antd/lib/form/interface';
import { orderBy } from 'lodash';
import { EntityDropdown, RefListDropDown, useUi, IAnyObject } from 'shesha-reactjs';
import { ReportingReportParameterDto } from 'apis/reportingReport';

enum FilterDataTypes {
  String = 'string',
  Date = 'date',
  Time = 'time',
  DateTime = 'datetime',
  Number = 'number',
  Boolean = 'boolean',
  ReferenceList = 'refList',
  MultiValueReferenceList = 'multiValueRefList',
  EntityReference = 'entityReference',
}

export interface IParametersFilterProps {
  id: string;
  onApply?: (parameters: any) => void;
  onCancel?: () => void;
  parameters?: ReportingReportParameterDto[];
}

export const ParametersFilter: FC<IParametersFilterProps> = ({ onApply, onCancel, parameters }) => {
  const [form] = Form.useForm();
  const { formItemLayout } = useUi();

  const renderStringParam = () => {
    return <Input allowClear />;
  };

  const renderDateParam = (showTime = false) => {
    return <DatePicker showTime={showTime} allowClear />;
  };

  const renderTimeParam = () => {
    return <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} allowClear />;
  };

  const renderNumberParam = () => {
    return <InputNumber />;
  };

  const renderBooleanParam = (parameter: ReportingReportParameterDto) => {
    return <Checkbox>{parameter?.displayName}</Checkbox>;
  };

  const renderReflistParam = (parameter: ReportingReportParameterDto, multiple = false) => {
    return (
      <RefListDropDown
        listName={parameter?.referenceListName as string}
        listNamespace={parameter?.referenceListNamespace as string}
        mode={multiple ? 'multiple' : undefined}
      />
    );
  };

  const renderEntityDropdownParam = (parameter: ReportingReportParameterDto) => {
    return <EntityDropdown typeShortAlias={parameter?.entityTypeShortAlias as string} />;
  };

  const renderParamter = (parameter: ReportingReportParameterDto) => {
    switch (parameter?.dataType) {
      case FilterDataTypes.String:
        return renderStringParam();
      case FilterDataTypes.Date:
        return renderDateParam();
      case FilterDataTypes.Time:
        return renderTimeParam();
      case FilterDataTypes.DateTime:
        return renderDateParam(true);
      case FilterDataTypes.Number:
        return renderNumberParam();
      case FilterDataTypes.Boolean:
        return renderBooleanParam(parameter);
      case FilterDataTypes.ReferenceList:
        return renderReflistParam(parameter);
      case FilterDataTypes.MultiValueReferenceList:
        return renderReflistParam(parameter, true);
      case FilterDataTypes.EntityReference:
        return renderEntityDropdownParam(parameter);

      default:
        return renderStringParam();
    }
  };

  const onFinish = (store: Store) => {
    console.log('onFinish');

    const response: IAnyObject = {};

    Object.keys(store).forEach((key: string) => {
      if (![null, undefined].includes(store[key]) || (typeof store[key] === 'string' && !store[key].trim())) {
        if (isMoment(store[key])) {
          response[key] = store[key]?.toISOString();
        } else {
          response[key] = store[key];
        }
      }
    });

    if (onApply) {
      onApply(response);
    }
  };

  const ooApplyClick = () => {
    form.submit();
  };

  const ooCancelClick = () => {
    form.resetFields();
    if (onCancel) {
      onCancel();
    }
  };

  const ooResetClick = () => {
    form.resetFields();
  };

  return (
    <div className="parameter-filters">
      <Form {...formItemLayout} form={form} onFinish={onFinish}>
        {orderBy(parameters, ['parameterOrderIndex'])
          ?.filter(({ hideParameter }) => !hideParameter)
          .map((parameter) => (
            <Form.Item label={parameter?.displayName} key={parameter?.id} name={parameter.internalName as string}>
              {renderParamter(parameter)}
            </Form.Item>
          ))}
      </Form>

      <div
        className="parameter-filters-btns"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={ooCancelClick} danger>
          Cancel
        </Button>

        <Button onClick={ooResetClick} style={{ margin: '0 12px' }}>
          Clear Fields
        </Button>

        <Button onClick={ooApplyClick} type="primary">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default ParametersFilter;
