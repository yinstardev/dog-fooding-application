import React, { useState } from 'react';
import { Button, Modal, Space, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';

/* Props Selection Options */
const options: SelectProps<string>['options'] = [];
for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (selectedFilters: string[]) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApplyFilter }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleChange = (value: string[]) => {
    setSelectedFilters(value);
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedFilters);
    onClose();
  };

  return (
    <Modal
      title="Apply Filters"
      visible={visible}
      onCancel={onClose}
      onOk={handleApplyFilter}
    >
      <Space direction="vertical">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Please select filters"
          onChange={handleChange}
          options={options}
        />
      </Space>
    </Modal>
  );
};
