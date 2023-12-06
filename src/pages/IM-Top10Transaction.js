import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import {
   Card,
   Table,
   Stack,
   Paper,
   Avatar,
   Button,
   Popover,
   Checkbox,
   TableRow,
   MenuItem,
   TableBody,
   TableCell,
   Container,
   Typography,
   IconButton,
   TableContainer,
   TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import UserListHeadWithoutCheckbox from 'src/sections/@dashboard/user/UserListHeadWithoutCheckbox';


export default function IMTopTransaction() {
   const [open, setOpen] = useState(null);

   const [page, setPage] = useState(0);

   const [order, setOrder] = useState('asc');

   const [selected, setSelected] = useState([]);

   const [orderBy, setOrderBy] = useState('name');

   const [filterName, setFilterName] = useState('');

   const [rowsPerPage, setRowsPerPage] = useState(5);

   const [userList, setUserList] = useState([]);

   useEffect(() => {
      handleUser()
   }, [])

   const handleCloseMenu = () => {
      setOpen(null);
   };

   const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
   };

   const handleUser = async () => {
      const token = localStorage.getItem('token')

      const response = await fetch(`http://103.13.206.208:1337/api/v1/transaction/interbank-top-history`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const userJson = await response.json();
      setUserList(userJson)
   }

   const TABLE_HEAD = [
      { id: 'from_account', label: 'From Account', alignRight: false },
      { id: 'to_account', label: 'To Account', alignRight: false },
      { id: 'event', label: 'Event', alignRight: false },
      { id: 'amount', label: 'Amount', alignRight: false },
      { id: 'time', label: 'Time', alignRight: false },
   ];


   return (
      <>
         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
               Top 10 Transaction
            </Typography>
         </Stack>

         <Card>
            <Scrollbar>
               <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                     <UserListHeadWithoutCheckbox
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={userList.length}
                        // numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                     // onSelectAllClick={handleSelectAllClick}
                     />
                     <TableBody>                        {userList?.data?.transactionHistories?.map((row) => {

                        return (
                           <TableRow hover key={row?.id} tabIndex={-1}>
                              <TableCell align="left">{row?.fromAccount}</TableCell>

                              <TableCell align="left">{row?.toAccount}</TableCell>

                              <TableCell align="left">{row?.event}</TableCell>

                              <TableCell align="left">{row?.amount}</TableCell>

                              <TableCell align="left">{row?.createdAt}</TableCell>
                           </TableRow>
                        );
                     })}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Scrollbar>
         </Card>

         <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
               sx: {
                  p: 1,
                  width: 140,
                  '& .MuiMenuItem-root': {
                     px: 1,
                     typography: 'body2',
                     borderRadius: 0.75,
                  },
               },
            }}
         >
            <MenuItem>
               <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
               Edit
            </MenuItem>

            <MenuItem sx={{ color: 'error.main' }}>
               <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
               Delete
            </MenuItem>
         </Popover>
      </>
   );
}
