import React, { useEffect, useState, RefObject, MutableRefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './DashboardPage.styles';
import './LiveboardPage.css';

import { Select, Space, Button, CheckboxOptionType } from 'antd';
import type { SelectProps } from 'antd';

import { FilterModal } from './FilterComponent/FilterPopup';

/* 
  Imports for TS-LB embed
*/
import {
  Action,
  HostEvent,
  LiveboardEmbed,
  RuntimeFilterOp,
  useEmbedRef,
} from '@thoughtspot/visual-embed-sdk/lib/src/react';
// import * as TSV from '@thoughtspot/visual-embed-sdk/lib/src/react';
// const { Action, HostEvent, useEmbedRef } = TSV;
// type LiveboardEmbed = typeof TSV.LiveboardEmbed;

import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import styled, { css } from 'styled-components';
import { FilterOutlined } from '@ant-design/icons';
import { getAPIFilterData } from './FilterComponent/APIRequest';
import { JsxEmit } from 'typescript';

const { Option } = Select;

/* Props Selection Options */
const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
    color: 'orange',
  });
}

/*
  Dummy Data for Application for Filters
*/
const dummyData = {
  data: {
    getPinboardDataSources: [
      {
        id: '4dcfc755-87ea-439c-843d-44d9d9df9276',
        name: 'Case Customer Count',
        type: 'WORKSHEET',
        columns: [
          {
            id: '836fc082-92c9-40a3-9cef-a71fd3314954',
            name: 'Quarter FY',
            type: 'ATTRIBUTE',
            dataType: 'CHAR',
            values: ['Q1', 'Q2', 'Q3', 'Q4'],
            description: '',
            __typename: 'PinboardSourceColumn',
          },
          {
            id: 'ccb6432c-f972-433d-a24a-730eda700171',
            name: 'Case Count',
            type: 'MEASURE',
            dataType: 'INT64',
            values: [12, 13, 14],
            description: '',
            __typename: 'PinboardSourceColumn',
          },
          {
            id: 'c170e33e-5482-4088-a746-804d4ab5a19e',
            name: 'Customer Count',
            type: 'MEASURE',
            dataType: 'INT64',
            values: [11, 12, 13],
            description: '',
            __typename: 'PinboardSourceColumn',
          },
          {
            id: '23772a8f-1c16-4e77-bb75-dbdf71b2ddff',
            name: 'Case Segment',
            type: 'ATTRIBUTE',
            dataType: 'CHAR',
            values: ['Segment A', 'Segment B', 'Segment C'],
            description: '',
            __typename: 'PinboardSourceColumn',
          },
        ],
        __typename: 'PinboardSourceDetail',
      },
    ],
  },
};

/* 
    FetchData for Filters : 
      - Get columns & row values after data cleaning.
      - Render the Filters component with Search functionality.
  */

/*
    Operations based on the column type to display in the filter 
  */
const getOperationsForDataType = (dataType: string): string[] => {
  const dataTypeOperations: Record<string, string[]> = {
    CHAR: ['EQ', 'NEQ'],
    INT64: ['EQ', 'NEQ', 'LEQ', 'GEQ'],
    DOUBLE: ['EQ', 'NEQ', 'LEQ', 'GEQ'],
    DATE: ['EQ', 'NEQ', 'LT', 'GT'],
    DATE_TIME: ['EQ', 'NEQ', 'LT', 'GT'],
  };
  return dataTypeOperations[dataType] || [];
};

/* 
  Liveboard Embed Page : 
    - Full Page Liveboard Embed
*/

const LiveboardPage: React.FC = () => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const columns = dummyData.data.getPinboardDataSources[0].columns;
  const [filter, setFilter] = useState({} as any);
  const [selectedColumn, setSelectedColumn] = useState({});
  const [selectedOperation, setSelectedOperation] = useState({});
  const [selectedValue, setSelectedValue] = useState({});
  const [filterData, setFilterData] = useState([] as any);

  /*change handling for Filter Values*/
  const handleColumnChange = (value: string) => {
    setSelectedColumn(value);
    setSelectedOperation(''); // Reset operation when column changes
    setSelectedValue(''); // Reset value when column changes
  };

  const handleOperationChange = (value: string) => {
    setSelectedOperation(value);
    setSelectedValue(''); // Reset value when operation changes
  };

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  /* Filter modal popup for Filters Selection */
  const [modalVisible, setModalVisible] = useState(false);

  const ts_ref = useEmbedRef();
  const normal_ref = useRef();
  const type_ts_ref = JSON.stringify(ts_ref);
  const type_normal_ref = JSON.stringify(normal_ref);
  // const new_type = typeof useRef<LiveboardEmbed | null>;
  // Use MutableRefObject as a workaround
  const embedRef = useEmbedRef();

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleApplyFilter = (selectedFilters: string[]) => {
    // Perform actions with selected filters
    console.log('Selected Filters kyebhai:', selectedFilters);
    console.log(`normal type: ${type_normal_ref}`);
    console.log(`ts ref type: ${type_ts_ref}`);
  };

  const { t } = useTranslation();

  const LB_ONE = '1d8000d8-6225-4202-b56c-786fd73f95ad';

  useEffect(() => {
    const container = document.getElementById('lb-embed');
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }
  }, []);

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
    console.log(`normal type: ${type_normal_ref}`);
    console.log(`ts ref type: ${type_ts_ref}`);
  };

  const reload = async () => {
    const apiFilterData = await getAPIFilterData();
    setFilterData(apiFilterData);
    console.log(`Api Filter Data : ${filterData}`);

    // embedRef.current.trigger(HostEvent.Reload, {});

    // const userInput = 'australia';
    // embedRef.current.trigger(HostEvent.UpdateRuntimeFilters,[
    //   {

    //   }
    // ])
  };

  const resetFilter = () => {
    embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
      {
        columnName: 'state',
        operator: 'EQ',
        values: [],
      },
      {
        columnName: 'product type',
        operator: 'EQ',
        values: [],
      },
    ]);
  };

  // const handleColumnSelectChange = (e) => {

  // }

  return (
    <S.FullScreenCol id="lb-embed">
      <PageTitle>{t('common.liveboard')}</PageTitle>
      <Button onClick={reload}>Reload Host Event </Button>
      {/* <S.FilterComponent>
        <S.Label>Select Column:</S.Label>
        <select onChange={(event) => handleChange(event.target.value)}>
          <S.Options value="">Select</S.Options>
          {filterData.map((column: any) => (
            <S.Options value={column}>
              {column.name}
            </S.Options>
          ))}
        </select>
        {selectedColumn && (
          <div>
            <S.Label>Select Operation:</S.Label>
            <select onChange={(value : any) => handleOperationChange(value)}>
              <S.Options value="">Select</S.Options>
              {getOperationsForDataType(
                columns.find((col) => col.name === selectedColumn)?.dataType || ''
              ).map((operation, index) => (
                <S.Options key={index} value={operation}>
                  {operation}
                </S.Options>
              ))}
            </select>
          </div>
        )}

        {selectedOperation && (
          <div>
            <S.Label>Select Value:</S.Label>
            <select onChange={(value : any) => handleValueChange(value)}>
              <S.Options value="">Select</S.Options>
              {/* You may customize the options based on the selected column's values */}
      {/* {(columns.find((col) => col.name === selectedColumn)?.values || []).map(
                (value, index) => (
                  <S.Options key={index} value={value}>
                    {value}
                  </S.Options>
                )
              )}
            </select>
          </div>
        )}
      </S.FilterComponent> */}
      {/* <S.FilterComponent>
        <S.Label>Select Column:</S.Label>
        <S.Select onChange={(e) => setFilter(JSON.parse(e.target.value))}>
          <S.Options value="">Select</S.Options>
          {columns.map((column, index) => (
            <S.Options style={{ background: 'red' }} key={index} value={JSON.stringify(column)}>
              {column.name}
            </S.Options>
          ))}
        </S.Select>
        {filter?.dataType && (
          <div>
            <S.Label>Select Operation:</S.Label>
            <S.Select onChange={(e) => setSelectedOperation(e.target.value)}>
              <S.Options value="">Select</S.Options>
              {getOperationsForDataType(filter.dataType).map((operation, index) => (
                <S.Options key={index} value={operation}>
                  {operation}
                </S.Options>
              ))}
            </S.Select>
          </div>
        )}

        {selectedOperation && (
          <div>
            <S.Label>Select Value:</S.Label>
            <S.Select onChange={(e) => setSelectedValue(e.target.value)}>
              <S.Options value="">Select</S.Options>
              {columns
                .find((column) => column.name === filter.name)
                ?.values?.map((value, index) => (
                  <S.Options key={index} value={value}>
                    {value}
                  </S.Options>
                ))}
            </S.Select>
          </div>
        )}
      </S.FilterComponent> */}
      <div>
        <Button onClick={handleOpenModal} icon={<FilterOutlined />}>
          Open Filters
        </Button>
        <FilterModal visible={modalVisible} onClose={handleCloseModal} onApplyFilter={handleApplyFilter} />
        {/* Rest of your page */}
      </div>

      <Space style={{ width: '100%' }} direction="vertical">
        <Select
          popupClassName="popup-styles"
          dropdownStyle={{ background: 'white' }}
          className="select-bg"
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          onChange={(e) => handleChange(JSON.parse(e.target.value))}
        >
          <Select.Option value="">Select Value</Select.Option>
          {filterData?.map((column: any) => (
            <Select.Option key={column.id} value={JSON.stringify(column)}>
              {column.name}
            </Select.Option>
          ))}
        </Select>
        {}

        <Select
          className="select-bg"
          mode="multiple"
          disabled
          style={{ width: '100%', background: 'white' }}
          placeholder="Please select"
          defaultValue={['a10', 'c12']}
          onChange={handleChange}
          options={options}
        />
      </Space>
      <S.LiveboardComponent>
        <LiveboardEmbed
          disabledActions={[
            Action.DownloadAsPdf,
            Action.Edit,
            Action.ExportTML,
            Action.Share,
            Action.RenameModalTitleDescription,
            Action.SpotIQAnalyze,
          ]}
          ref={embedRef as any}
          hiddenActions={[Action.SyncToOtherApps, Action.SyncToSheets, Action.ManagePipelines]}
          // hideLiveboardHeader={true}
          // hideTabPanel={true}
          visibleTabs={['f897c5de-ee38-46e0-9734-d9ed5d4ecc83', 'bf1d15f4-3690-4b37-8cd1-5f0967cf588c']}
          liveboardId={LB_ONE}
          frameParams={{ height: `${containerDimensions.height * 0.8}px` }}
          runtimeFilters={[
            {
              columnName: 'Account State',
              operator: RuntimeFilterOp.EQ,
              values: ['Alabama'],
            },
          ]}
        />
      </S.LiveboardComponent>
    </S.FullScreenCol>
  );
};

export default LiveboardPage;
