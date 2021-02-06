import React from 'react';
import MaterialTable from 'material-table';
import { tableIcons } from './icons';

const Table = (props) => {
  return <MaterialTable {...props} icons={{ ...tableIcons }} />;
};

export default Table;
