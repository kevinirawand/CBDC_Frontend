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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
   { id: 'from_account', label: 'From Account', alignRight: false },
   { id: 'to_account', label: 'To Account', alignRight: false },
   { id: 'event', label: 'Event', alignRight: false },
   { id: 'amount', label: 'Amount', alignRight: false },
   { id: 'time', label: 'Time', alignRight: false },
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

export default function IMRecentTransactionPage() {
   const [open, setOpen] = useState(null);

   const [page, setPage] = useState(0);

   const [order, setOrder] = useState('asc');

   const [selected, setSelected] = useState([]);

   const [orderBy, setOrderBy] = useState('name');

   const [filterName, setFilterName] = useState('');

   const [rowsPerPage, setRowsPerPage] = useState(5);

   const [transactionList, setTransactionList] = useState([]);

   useEffect(() => {
      handleTransactionList(1)
   }, [])

   const handleTransactionList = async (page) => {
      const token = localStorage.getItem('token')

      const response = await fetch(`http://localhost:1337/api/v1/transaction/interbank-history/?page=${page}&perPage=10`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })
      const transactionJson = await response.json();
      setTransactionList(transactionJson)
   }

   const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
   };

   const handleCloseMenu = () => {
      setOpen(null);
   };

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

   const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];
      if (selectedIndex === -1) {
         newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
         newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
         newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      }
      setSelected(newSelected);
   };

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

   const dissabledPaginationStyle = {
      filter: 'contrast(0)'
   }

   return (
      <>
         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
               Recent Transaction
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
                        rowCount={transactionList?.data?.transactionHistories?.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                     />
                     <TableBody>
                        {transactionList?.data?.transactionHistories?.map((row) => {
                           const selectedUser = selected.indexOf(name) !== -1;

                           return (
                              <TableRow hover key={row?.id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                 <TableCell align="left">{row?.fromAccount}</TableCell>

                                 <TableCell align="left">{row?.toAccount}</TableCell>

                                 <TableCell align="left">{row?.event}</TableCell>

                                 <TableCell align="left">{row?.amount}</TableCell>

                                 <TableCell align="left">{row?.createdAt}</TableCell>
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
