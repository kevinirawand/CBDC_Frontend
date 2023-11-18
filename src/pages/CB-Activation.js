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

const TABLE_HEAD = [
   { id: 'name', label: 'Name', alignRight: false },
   { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
   { id: 'email', label: 'Email', alignRight: false },
   { id: 'role', label: 'Role', alignRight: false },
   { id: 'action', label: 'Action', alignRight: false },
];

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


export default function CBActivation() {
   const [open, setOpen] = useState(null);
   const [page, setPage] = useState(0);
   const [selected, setSelected] = useState([]);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [userActivationRequestList, setUserActivationRequestList] = useState([]);

   const handleAcceptRequest = async (userId, isApprove) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://103.13.206.208:1337/api/v1/user/activation?userId=${userId}&isApprove=${isApprove}`, {
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
      handleGetUserActivationRequestList()
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

   const handleGetUserActivationRequestList = async (page = 1, perPage = 5) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://103.13.206.208:1337/api/v1/user/activation?page=${page}&perPage=${perPage}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const userActivationRequestListJson = await response.json();
      console.info(userActivationRequestListJson)
      setUserActivationRequestList(userActivationRequestListJson)
      return userActivationRequestListJson;
   }

   useEffect(() => {
      handleGetUserActivationRequestList();
   }, [])

   const emptyRows = userActivationRequestList?.data?.userActivationRequestList
      .length == 0;

   const isNotFound = userActivationRequestList?.data?.userActivationRequestList
      .length == 0;

   const dissabledPaginationStyle = {
      filter: 'contrast(0)'
   }

   return (
      <>
         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
               User Activation Request
            </Typography>
         </Stack>

         <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            <Scrollbar>
               <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                     <UserListHead
                        headLabel={TABLE_HEAD}
                        rowCount={userActivationRequestList?.data?.userActivationRequestList.length}
                        numSelected={selected.length}
                        onSelectAllClick={handleSelectAllClick}
                     />
                     <TableBody>
                        {userActivationRequestList?.data?.userActivationRequestList.map((row) => {
                           const { id, name, phoneNumber, email, role } = row;
                           const selectedUser = selected.indexOf(id) !== -1;

                           return (
                              <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                 <TableCell align="left">{name}</TableCell>
                                 <TableCell align="left">{phoneNumber}</TableCell>
                                 <TableCell align="left">{email}</TableCell>
                                 <TableCell align="left">{role}</TableCell>

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

               <Iconify cursor={userActivationRequestList?.data?.currentPage == 1 ? '' : 'pointer'} width={30} icon={'mingcute:left-line'} style={userActivationRequestList?.data?.currentPage == 1 ? dissabledPaginationStyle : ''} onClick={userActivationRequestList?.data?.currentPage == 1 ? '' : () => { handleGetUserActivationRequestList(userActivationRequestList?.data?.currentPage - 1) }} />
               <Typography variant="p" gutterBottom>
                  {userActivationRequestList?.data?.currentPage}  of  {userActivationRequestList?.data?.totalPages}
               </Typography>

               <Iconify cursor={userActivationRequestList?.data?.currentPage == userActivationRequestList?.data?.totalPages ? '' : 'pointer'} width={30} icon={'mingcute:right-line'} style={userActivationRequestList?.data?.currentPage == userActivationRequestList?.data?.totalPages ? dissabledPaginationStyle : ''} onClick={userActivationRequestList?.data?.currentPage == userActivationRequestList?.data?.totalPages ? '' : () => { handleGetUserActivationRequestList(userActivationRequestList?.data?.currentPage + 1) }} />
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
