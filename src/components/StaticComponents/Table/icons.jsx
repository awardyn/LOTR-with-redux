import React, { forwardRef } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ClearIcon from '@material-ui/icons/Clear';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import SearchIcon from '@material-ui/icons/Search';
import SortArrow from '@material-ui/icons/Sort';

export const tableIcons = {
  FirstPage: forwardRef((props, ref) => <FirstPage ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage />),
  NextPage: forwardRef((props, ref) => <ChevronRight />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft />),
  ResetSearch: forwardRef((props, ref) => <ClearIcon />),
  Search: forwardRef((props, ref) => <SearchIcon />),
  SortArrow: forwardRef((props, ref) => <SortArrow />),
};
