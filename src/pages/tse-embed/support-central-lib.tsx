import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import {
  Action,
  EmbedEvent,
  HostEvent,
  LiveboardEmbed,
  RuntimeFilterOp,
  useEmbedRef,
} from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { startTseInitialization, tseSlice } from '@app/store/slices/tseSlice';
import './tse-embed.css';
import { BaseRow } from '../../components/common/BaseRow/BaseRow';
import { Select } from '../../components/common/selects/BaseSelect/BaseSelect.styles';
import { FilterButton } from '../../components/apps/newsFeed/NewsFilter/NewsFilter.styles';
import Input from 'antd/lib/input/Input';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { BaseButton } from '../../components/common/BaseButton/BaseButton';
import * as S from '@app/pages/uiComponentsPages//UIComponentsPage.styles';
import { BaseModal } from '../../components/common/BaseModal/BaseModal';
import { FilterIcon } from '../../components/common/icons/FilterIcon';
import { BlankIcon } from '../../components/common/icons/BlankIcon';
import { Col, Form, Row } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { BaseCol } from '../../components/common/BaseCol/BaseCol';
import { BaseFormItem } from '../../components/common/forms/components/BaseFormItem/BaseFormItem';
import { BaseButtonsForm } from '../../components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect } from '../../components/common/selects/BaseSelect/BaseSelect';
import { BaseForm } from '../../components/common/forms/BaseForm/BaseForm';
import axios from 'axios';
import { DefaultOptionType } from 'antd/lib/select';
import { fetchUserAndToken } from '@app/api/getUserAndToken';

function SuperSelect({
  columnName,
  defaultValues,
  updateValues,
}: {
  columnName: string;
  defaultValues?: string[];
  updateValues?: (values: string[]) => void;
}) {
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues || []);
  const { t } = useTranslation();

  const updateOptions = (data: string[]) => {
    const allValues = [...new Set([...data, ...options])];
    setOptions(allValues);
    console.log('Inside update options : ', allValues);
  };

  useEffect(() => {
    searchData({ query: '', columnName }).then(([data]) => updateOptions(data));
  }, []);

  return (
    <BaseButtonsForm.Item
      name={columnName}
      label={columnName}
      rules={[{ required: false, message: t('forms.validationFormLabels.colorError'), type: 'array' }]}
    >
      <Select
        mode="multiple"
        popupClassName="popup-styles"
        options={options.map((e) => ({ value: e, label: e }))}
        onSearch={async (query) => {
          if (isLoading) return;
          setIsLoading(true);
          try {
            const [values, error] = await searchData({ query, columnName });
            if (!values || error) {
              console.error(error);
              setIsLoading(false);
              return;
            }
            updateOptions(values);
          } catch (e) {
            console.error(e);
          }
          setIsLoading(false);
        }}
        onSelect={(e: any) => {
          const newValues = [...selectedValues, e];
          updateValues?.(newValues);
          setSelectedValues(newValues);
          console.log('onselect function : ', newValues);
        }}
        value={selectedValues}
        loading={isLoading}
      />
    </BaseButtonsForm.Item>
  );
}

export function SupportCentral() {
  const tseState = useAppSelector((state) => state.tse);

  const dispatch = useAppDispatch();
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);

  const [accountNames, setAccountNames] = useState<string[]>([]);
  const [caseNumbers, setCaseNumbers] = useState<string[]>([]);

  const [editAccountNames, setEditAccountNames] = useState<string[]>([]);
  const [editCaseNumbers, setEditCaseNumbers] = useState<string[]>([]);

  const embedRef = useEmbedRef();

  if (!tseState.tseInitialized) {
    dispatch(startTseInitialization());
  }

  return (
    <BaseRow className="test">
      <BaseButton style={{ marginBottom: '2em' }} type="primary" onClick={() => setIsBasicModalOpen(true)}>
        <FilterIcon />
      </BaseButton>
      <BaseModal
        title={'Filter'}
        open={isBasicModalOpen}
        onOk={() => {
          setAccountNames(editAccountNames);
          setCaseNumbers(editCaseNumbers);
          setIsBasicModalOpen(false);
          console.log('Account names : ', editAccountNames);
          console.log('Case Numbers : ', editCaseNumbers);
          if (embedRef.current) {
            embedRef.current.trigger(HostEvent.UpdateRuntimeFilters, [
              {
                columnName: 'Account Name',
                operator: 'EQ',
                values: editAccountNames,
              },
              {
                columnName: 'Case Number',
                operator: 'EQ',
                values: editCaseNumbers,
              },
            ]);
          }
        }}
        onCancel={() => setIsBasicModalOpen(false)}
      >
        <BaseForm>
          <SuperSelect columnName="Account Name" defaultValues={accountNames} updateValues={setEditAccountNames} />
          <SuperSelect columnName="Case Number" defaultValues={caseNumbers} updateValues={setEditCaseNumbers} />
        </BaseForm>
      </BaseModal>

      <div className="tseEmbed">
        <LiveboardEmbed
          disabledActions={[
            Action.DownloadAsPdf,
            Action.Edit,
            Action.ExportTML,
            Action.Share,
            Action.RenameModalTitleDescription,
            Action.SpotIQAnalyze,
          ]}
          fullHeight={true}
          hiddenActions={[Action.SyncToOtherApps, Action.SyncToSheets, Action.ManagePipelines]}
          visibleTabs={['f897c5de-ee38-46e0-9734-d9ed5d4ecc83', 'bf1d15f4-3690-4b37-8cd1-5f0967cf588c']}
          ref={embedRef as any}
          preRenderId={tseState.supportCentralLiveboard + '-support-central'}
          liveboardId={tseState.supportCentralLiveboard}
        />
      </div>
    </BaseRow>
  );
}

interface SearchDataParam {
  query: string;
  columnName: string;
}

const cachedData: { [key: string]: { data: string[] } } = {};

async function searchData({ query, columnName }: SearchDataParam): Promise<[string[], any]> {
  let result: string[] = [];
  let error = null;

  if (cachedData[columnName + query]?.data !== undefined) {
    return [cachedData[columnName + query].data, error];
  }

  const url = 'https://champagne.thoughtspotstaging.cloud/api/rest/2.0/searchdata';

  const { token } = await fetchUserAndToken();

  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const data = {
    query_string: `[${columnName}]`,
    logical_table_identifier: '54beb173-d755-42e0-8f73-4d4ec768114f',
    data_format: 'COMPACT',
    record_offset: 0,
    record_size: 500,
  };

  try {
    const response = await axios.post(url, data, { headers });
    result = response.data.contents[0].data_rows.map((e: any) => e[0]);

    cachedData[columnName + query] = {
      data: result,
    };
  } catch (e) {
    error = e;
  }

  return [result, error];
}
