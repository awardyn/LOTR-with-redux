import React from 'react';
import Select from 'react-select';
import { selectStyle } from '../../../utils/selectStyle';

const SelectField = ({ options, field, form, placeholder, disabled }) => {
  return (
    <Select
      isDisabled={disabled}
      placeholder={placeholder || 'placeholder'}
      options={options}
      name={field.name}
      value={options?.find((option) => option?.value === field?.value) ?? ''}
      onChange={(option) => form.setFieldValue(field.name, option?.value)}
      onBlur={field.onBlur}
      menuPortalTarget={document.body}
      isClearable
      isSearchable={true}
      styles={selectStyle}
    />
  );
};

export default SelectField;
