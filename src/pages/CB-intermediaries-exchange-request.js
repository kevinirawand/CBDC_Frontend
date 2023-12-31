import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
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
   TextField,
   Backdrop,
   TableContainer,
   Box,
   Modal,
   Fade,
   TablePagination,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------
const modalStyle = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 400,
   bgcolor: 'background.paper',
   borderRadius: '10px',
   boxShadow: 24,
   p: 4,
};


// ----------------------------------------------------------------------


export default function CBIntermediariesExchangeRequest() {
   const [open, setOpen] = useState(null);
   const [page, setPage] = useState(0);
   const [selected, setSelected] = useState([]);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [exchangeRequest, setExchangeRequest] = useState([]);

   const handleAcceptRequest = async (transactionId, isApprove) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://103.13.206.208:1337/api/v1/transaction/exchange/confirmation?transactionId=${transactionId}&isApprove=${isApprove}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const result = await response.json()
      console.info(result)
      if (result.code === 200) {
         window.alert('Redeem Request Approved')
      } else {
         window.alert(`Redeem Request Error ${result.errors.message}`)
      }
      handleGetRedeemRequestList()
   }

   const handleCloseMenu = () => {
      setOpen(null);
   };

   const handleSelectAllClick = (event) => {
      if (event.target.checked) {
         const newSelecteds = USERLIST.map((n) => n.name);
         setSelected(newSelecteds);
         return;
      }
      setSelected([]);
   };

   const handleGetRedeemRequestList = async (page = 1, perPage = 5) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://103.13.206.208:1337/api/v1/transaction/exchange?page=${page}&perPage=${perPage}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const exchangeRequestListJson = await response.json();
      setExchangeRequest(exchangeRequestListJson)
      return exchangeRequestListJson;
   }

   useEffect(() => {
      handleGetRedeemRequestList();
   }, [])

   const emptyRows = exchangeRequest?.data?.exchangeRequestList
      .length == 0;

   const isNotFound = exchangeRequest?.data?.exchangeRequestList
      .length == 0;

   const dissabledPaginationStyle = {
      filter: 'contrast(0)'
   }

   const TABLE_HEAD = [
      { id: 'id', label: 'Transaction ID', alignRight: false },
      { id: 'intermediaries_id', label: 'Intermediaries ID', alignRight: false },
      { id: 'amount', label: 'Amount', alignRight: false },
      { id: 'createdAt', label: 'Request at', alignRight: false },
      { id: 'action', label: 'Action', alignRight: false },
   ];

   return (
      <>
         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
               Intermediaries Exchange Request
            </Typography>
         </Stack>

         <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            <Scrollbar>
               <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                     <UserListHead
                        headLabel={TABLE_HEAD}
                        rowCount={exchangeRequest?.data?.exchangeRequestList.length}
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                     />
                     <TableBody>
                        {exchangeRequest?.data?.exchangeRequestList.map((row) => {
                           const { id, userId, amount, createdAt } = row;
                           const selectedUser = selected.indexOf(id) !== -1;

                           return (
                              <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                 <TableCell align="left">{id}</TableCell>

                                 <TableCell align="left">{userId}</TableCell>
                                 <TableCell align="left">{amount}</TableCell>
                                 <TableCell align="left">{createdAt}</TableCell>

                                 <TableCell style={{ display: 'flex', gap: '15px' }}>
                                    <Button style={{ backgroundColor: '#16FF00' }} variant="contained" startIcon={<Iconify icon="fluent-mdl2:accept" />} onClick={() => handleAcceptRequest(id, true)}>
                                       Accept
                                    </Button>

                                    <Button style={{ backgroundColor: '#FE0000' }} variant="contained" startIcon={<Iconify icon="octicon:x-12" />} onClick={() => handleAcceptRequest(id, false)}>
                                       Decline
                                    </Button>
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

                     {isNotFound && (
                        <TableBody>
                           <TableRow>
                              <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                 <Paper
                                    sx={{
                                       textAlign: 'center',
                                    }}
                                 >
                                    <Typography variant="h6" paragraph>
                                       Empty Request
                                    </Typography>
                                 </Paper>
                              </TableCell>
                           </TableRow>
                        </TableBody>
                     )}
                  </Table>
               </TableContainer>
            </Scrollbar>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', marginBottom: '20px', flexDirection: 'row', alignItems: 'flex-start', gap: '15px', marginRight: '20px' }}>

               <Iconify cursor={exchangeRequest?.data?.currentPage == 1 ? '' : 'pointer'} width={30} icon={'mingcute:left-line'} style={exchangeRequest?.data?.currentPage == 1 ? dissabledPaginationStyle : ''} onClick={exchangeRequest?.data?.currentPage == 1 ? '' : () => { handleGetRedeemRequestList(exchangeRequest?.data?.currentPage - 1) }} />
               <Typography variant="p" gutterBottom>
                  {exchangeRequest?.data?.currentPage}  of  {exchangeRequest?.data?.totalPages}
               </Typography>

               <Iconify cursor={exchangeRequest?.data?.currentPage == exchangeRequest?.data?.totalPages ? '' : 'pointer'} width={30} icon={'mingcute:right-line'} style={exchangeRequest?.data?.currentPage == exchangeRequest?.data?.totalPages ? dissabledPaginationStyle : ''} onClick={exchangeRequest?.data?.currentPage == exchangeRequest?.data?.totalPages ? '' : () => { handleGetRedeemRequestList(exchangeRequest?.data?.currentPage + 1) }} />
            </div>
         </Card >

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
         </Popover>
      </>
   );
}
