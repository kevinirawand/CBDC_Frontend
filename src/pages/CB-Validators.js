import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
// @mui
// import {
//    Card,
//    Table,
//    Stack,
//    Paper,
//    Avatar,
//    Button,
//    Popover,
//    Checkbox,
//    TableRow,
//    MenuItem,
//    TableBody,
//    TableCell,
//    IconButton,
//    TableContainer,
//    TablePagination,
// } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
// sections
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import Iconify from '../components/iconify';
// @mui
// components
import Label from '../components/label';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import CBRecentTransactionPage from './CB-RecentTransactions';
import CBValidatorsList from './CB-Validators-List';
import CBTokenValidatorsList from './CB-Token-Validators-List';

// ----------------------------------------------------------------------

export default function CBValidatorsPage() {
   const [user, setUser] = useState([]);

   const theme = useTheme();

   const handleUser = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      const response = await fetch(`http://103.13.206.208:1337/api/v1/user/${userId}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const userJson = await response.json();
      setUser(userJson)
   }

   useEffect(() => {
      handleUser()
   }, [])

   const TABLE_HEAD = [
      { id: 'intermediaries_name', label: 'Intermediaries Name', alignRight: false },
      { id: 'issuing_idntermediaries_id', label: 'Issuing Intermediaries ID', alignRight: false },
      { id: 'validators_id', label: 'Validators ID', alignRight: false },
      { id: 'status', label: 'Status', alignRight: false },
      { id: '' },
   ];

   // ----------------------------------------------------------------------

   function descendingComparator(a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
         return -1;
      }
      if (b[orderBy] > a[orderBy]) {
         return 1;
      }
      return 0;
   }

   function getComparator(order, orderBy) {
      return order === 'desc'
         ? (a, b) => descendingComparator(a, b, orderBy)
         : (a, b) => -descendingComparator(a, b, orderBy);
   }

   function applySortFilter(array, comparator, query) {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
         const order = comparator(a[0], b[0]);
         if (order !== 0) return order;
         return a[1] - b[1];
      });
      if (query) {
         return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
      }
      return stabilizedThis.map((el) => el[0]);
   }

   return (
      <>
         <Helmet>
            <title> Validators | CBDC ITB </title>
         </Helmet>

         <Container maxWidth="auto">
            <Grid container spacing={3}>
               <Grid item xs={12} md={12} lg={12}>
                  <CBValidatorsList />
               </Grid>
            </Grid>
         </Container>
      </>
   );
}
