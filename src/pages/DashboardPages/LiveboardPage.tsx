import React, { useEffect, useState, RefObject, MutableRefObject, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './DashboardPage.styles';
import './LiveboardPage.css';

import { Select, Space, Button } from 'antd';

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

import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { getAPIFilterData } from './FilterComponent/APIRequest';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { startTseInitialization, tseSlice } from '@app/store/slices/tseSlice';

const { Option } = Select;

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
  const { t } = useTranslation();
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const [selectedValue, setSelectedValue] = useState({});
  const [filterData, setFilterData] = useState([] as any);

  const tseState = useAppSelector((state) => state.tse);

  const dispatch = useAppDispatch();
  const embedRef = useEmbedRef();
  useEffect(() => {
    const container = document.getElementById('lb-embed');
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }
  }, []);

  if (!tseState.tseInitialized) {
    dispatch(startTseInitialization());
    return <div>Tse not initialized yet</div>;
  }

  const LB_ONE = '1d8000d8-6225-4202-b56c-786fd73f95ad';

  const handleChange = (value: string[]) => {
    setSelectedValue(value);
  };

  const reload = async () => {
    const apiFilterData = await getAPIFilterData();
    setFilterData(apiFilterData);
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

  return (
    <S.FullScreenCol id="lb-embed">
      <PageTitle>{t('common.liveboard')}</PageTitle>
      <Button onClick={reload}>Get Columns Data </Button>

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
            Action.SyncToSheets,
            Action.SyncToOtherApps,
          ]}
          ref={embedRef as any}
          hiddenActions={[Action.SyncToOtherApps, Action.SyncToSheets, Action.ManagePipelines]}
          // hideLiveboardHeader={true}
          // hideTabPanel={true}
          visibleTabs={['f897c5de-ee38-46e0-9734-d9ed5d4ecc83', 'bf1d15f4-3690-4b37-8cd1-5f0967cf588c']}
          liveboardId={tseState.supportCentralLiveboard}
          preRenderId={tseState.supportCentralLiveboard + '-liveboard-page'}
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
