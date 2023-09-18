import { useState, useEffect } from 'react';
// @mui
import {
   Card,
   Table,
   Stack,
   TableRow,
   TableBody,
   TableCell,
   Typography,
   TableContainer,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
// mock
import USERLIST from '../_mock/user';
import UserListHeadWithoutCheckbox from 'src/sections/@dashboard/user/UserListHeadWithoutCheckbox';
import Label from 'src/components/label';
import { sentenceCase } from 'change-case';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
   { id: 'event', label: 'Event', alignRight: false },
   { id: 'amount', label: 'Amount', alignRight: false },
   { id: 'time', label: 'Time', alignRight: false },
   { id: 'status', label: 'Status', alignRight: false },
];

// ----------------------------------------------------------------------
export default function IMExchangeRequestList() {
   const [page, setPage] = useState(0);

   const [order, setOrder] = useState('asc');

   const [selected, setSelected] = useState([]);

   const [orderBy, setOrderBy] = useState('name');

   const [rowsPerPage, setRowsPerPage] = useState(5);

   const [transactionList, setTransactionList] = useState([]);

   useEffect(() => {
      handleTransactionList(1)
   }, [])

   const handleTransactionList = async (page) => {
      const token = sessionStorage.getItem('token')

      const response = await fetch(`http://localhost:1337/api/v1/transaction/interbank-exchange-request-list?page=${page}&perPage=15`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })
      const transactionJson = await response.json();
      console.info(transactionJson)
      setTransactionList(transactionJson)
   }

   const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
   };

   const handleSelectAllClick = (event) => {
      if (event.target.checked) {
         const newSelecteds = USERLIST.map((n) => n.name);
         setSelected(newSelecteds);
         return;
      }
      setSelected([]);
   };

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

   const dissabledPaginationStyle = {
      filter: 'contrast(0)'
   }

   return (
      <>
         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
               Exchange Request Transaction
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
                        rowCount={transactionList?.data?.exchangeRequestList?.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                     />
                     <TableBody>
                        {transactionList?.data?.exchangeRequestList?.map((row) => {
                           const selectedUser = selected.indexOf(name) !== -1;

                           return (
                              <TableRow hover key={row?.id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                 <TableCell align="left">{row?.event}</TableCell>

                                 <TableCell align="left">{row?.amount}</TableCell>

                                 <TableCell align="left">{row?.createdAt}</TableCell>
                                 <TableCell align="left">
                                    <Label color={(row?.status === 'pending' && 'error') || 'success'}>{sentenceCase(row?.status)}</Label>
                                 </TableCell>

                              </TableRow>
                           );
                        })}
                        {emptyRows > 0 && (
                           <TableRow style={{ height: 53 * emptyRows }}>
                              <TableCell colSpan={6} />
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Scrollbar>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', marginBottom: '20px', flexDirection: 'row', alignItems: 'flex-start', gap: '15px', marginRight: '20px' }}>

               <Iconify cursor={transactionList?.data?.currentPage == 1 ? '' : 'pointer'} width={30} icon={'mingcute:left-line'} style={transactionList?.data?.currentPage == 1 ? dissabledPaginationStyle : ''} onClick={transactionList?.data?.currentPage == 1 ? '' : () => { handleTransactionList(transactionList?.data?.currentPage - 1) }} />
               <Typography variant="p" gutterBottom>
                  {transactionList?.data?.currentPage}  of  {transactionList?.data?.totalPages}
               </Typography>

               <Iconify cursor={transactionList?.data?.currentPage == transactionList?.data?.totalPages ? '' : 'pointer'} width={30} icon={'mingcute:right-line'} style={transactionList?.data?.currentPage == transactionList?.data?.totalPages ? dissabledPaginationStyle : ''} onClick={transactionList?.data?.currentPage == transactionList?.data?.totalPages ? '' : () => { handleTransactionList(transactionList?.data?.currentPage + 1) }} />
            </div>
         </Card>
      </>
   );
}
