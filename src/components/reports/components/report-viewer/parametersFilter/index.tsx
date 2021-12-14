import React, { FC } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, TimePicker } from 'antd';
import moment, { isMoment } from 'moment';
import { Store } from 'antd/lib/form/interface';
import { orderBy } from 'lodash';
import {
  RefListDropDown,
  useUi,
  IAnyObject,
  Autocomplete,
  IGuidNullableEntityWithDisplayNameDto,
  IReferenceListItemValueDto,
} from '@shesha/reactjs';
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
        listName={parameter?.referenceListName || ''}
        listNamespace={parameter?.referenceListNamespace || ''}
        mode={multiple ? 'multiple' : undefined}
      />
    );
  };

  const renderEntityDropdownParam = (parameter: ReportingReportParameterDto) => {
    return <Autocomplete dataSourceType="entitiesList" typeShortAlias={parameter?.entityTypeShortAlias || ''} />;
  };

  const renderParamter = (parameter: ReportingReportParameterDto) => {
    switch (parameter?.dataType) {
      case FilterDataTypes.String: // Default => ""
        return renderStringParam();
      case FilterDataTypes.Date:
        return renderDateParam();
      case FilterDataTypes.Time:
        return renderTimeParam();
      case FilterDataTypes.DateTime:
        return renderDateParam(true);
      case FilterDataTypes.Number:
        return renderNumberParam();
      case FilterDataTypes.Boolean: // false
        return renderBooleanParam(parameter);
      case FilterDataTypes.ReferenceList: // ""
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
    const response: IAnyObject = {};

    Object.keys(store).forEach((key) => {
      const foundDate = parameters?.find(
        ({ internalName, dataType }) => internalName === key && dataType === FilterDataTypes.Date,
      );

      const storeValue = store[key];

      if (foundDate && !storeValue) {
        store[key] = new Date('1900-01-01').toISOString();
      }

      if (![null, undefined].includes(storeValue) || (typeof storeValue === 'string' && !storeValue.trim())) {
        if (isMoment(store[key])) {
          response[key] = storeValue?.toISOString();
        } else if (typeof storeValue === 'object') {
          const dataType = parameters?.find(({ internalName }) => internalName === key)?.dataType;

          if (dataType === FilterDataTypes?.EntityReference) {
            response[key] = (storeValue as IGuidNullableEntityWithDisplayNameDto)?.displayText;
          } else if (dataType === FilterDataTypes?.ReferenceList) {
            response[key] = (storeValue as IReferenceListItemValueDto)?.item;
          }
        } else {
          response[key] = storeValue;
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
            <Form.Item label={parameter?.displayName} key={parameter?.id} name={parameter.internalName || ''}>
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
