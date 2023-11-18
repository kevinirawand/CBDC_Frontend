import * as React from 'react';
import { Helmet } from 'react-helmet-async';
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
   InputLabel,
   Select,
   InputAdornment
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


export default function CBUserPage() {
   const [open, setOpen] = useState(null);
   const [page, setPage] = useState(0);
   const [selected, setSelected] = useState([]);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const [validators, setValidators] = useState([]);
   const [intermediariesUser, setIntermediariesUser] = useState([]);
   const [intermediariesList, setIntermediariesList] = useState([]);
   const [validatorToken, setValidatorToken] = useState([]);
   const [modalOpen, setModalOpen] = React.useState(false);
   const handleModalOpen = () => {
      handleGetIntermediariesList()
      setModalOpen(true)
   };
   const handleModalClose = () => setModalOpen(false);

   const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
   };

   const handleCloseMenu = () => {
      setOpen(null);
   };

   const TABLE_HEAD = [
      { id: 'id', label: 'Intermediaries ID', alignRight: false },
      { id: 'name', label: 'Name', alignRight: false },
      { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
      { id: 'email', label: 'Email', alignRight: false },
      { id: 'validators_token', label: 'Validators ID', alignRight: false },
   ];

   const handleGetIntermediariesList = async (page = 1, perPage = 5) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:1337/api/v1/user/?page=${page}&perPage=${perPage}&role=IntermediariesALL`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const intermediariesJson = await response.json();
      setIntermediariesList(intermediariesJson)
      return intermediariesJson;
   }

   const handleGetValidatorList = async (page = 1, perPage = 5) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:1337/api/v1/user/validators?page=${page}&perPage=${perPage}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const validatorsListJson = await response.json();
      setValidators(validatorsListJson)
      return validatorsListJson;
   }

   useEffect(() => {
      handleGetValidatorList();
   }, [])

   const emptyRows = validators?.data?.validatorList
      .length == 0;

   const isNotFound = validators?.data?.validatorList
      .length == 0;

   const dissabledPaginationStyle = {
      filter: 'contrast(0)'
   }

   async function setValidator() {
      const token = localStorage.getItem('token')

      const response = await fetch(`http://localhost:1337/api/v1/user/validators/${intermediariesUser}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         },
         body: JSON.stringify({
            isValidator: true,
            validatorToken: validatorToken
         })
      });

      return response.json();
   }

   const handleIntermediariesUser = (event) => {
      setIntermediariesUser(event.target.value);
   };

   const handleSubmit = async e => {
      e.preventDefault();

      const response = await setValidator();
      console.info(response)

      handleModalClose()

      window.alert('Set Validator Successfuly!')
      handleGetValidatorList();
   }

   return (
      <>
         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modalOpen}
            onClose={handleModalClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
               backdrop: {
                  timeout: 500,
               },
            }}
         >
            <Fade in={modalOpen}>
               <Box sx={modalStyle}>
                  <form onSubmit={handleSubmit}>
                     <Stack spacing={3}>
                        <Stack>
                           <InputLabel id="demo-simple-select-label">Intermediaries User</InputLabel>
                           <Select
                              labelId="Intermediaries User"
                              id="intermediariesUser"
                              value={intermediariesUser}
                              label="intermediariesUser"
                              onChange={handleIntermediariesUser}
                           >
                              {intermediariesList?.data?.users.map((row) => {
                                 return (
                                    <MenuItem value={row.id}>{row.name}</MenuItem>
                                 )
                              })}
                           </Select>
                        </Stack>

                        <TextField
                           name="validatorToken"
                           label="Validator Token"
                           type='text'
                           onChange={e => setValidatorToken(e.target.value)}
                        />

                        <LoadingButton style={{ marginTop: '25px' }} fullWidth size="large" type="submit" variant="contained">
                           Create
                        </LoadingButton>
                     </Stack>
                  </form>
               </Box>
            </Fade>
         </Modal>

         <Helmet>
            <title> Validators | CBDC ITB </title>
         </Helmet>

         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
               Validator List
            </Typography>
            <Button onClick={handleModalOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
               Set Validator
            </Button>
         </Stack>

         <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            <Scrollbar>
               <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                     <UserListHead
                        headLabel={TABLE_HEAD}
                        rowCount={validators?.data?.validatorList.length}
                        numSelected={selected.length}
                     />
                     <TableBody>
                        {validators?.data?.validatorList.map((row) => {
                           const { id, name, phoneNumber, email, validatorToken } = row;
                           const selectedUser = selected.indexOf(id) !== -1;

                           return (
                              <TableRow hover key={id} tabIndex={-1} intermediariesUser="checkbox" selected={selectedUser}>
                                 <TableCell align="left">{id}</TableCell>

                                 <TableCell align="left">{name}</TableCell>
                                 <TableCell align="left">{phoneNumber}</TableCell>
                                 <TableCell align="left">{'false'}</TableCell>
                                 <TableCell align="left">{email}</TableCell>
                                 <TableCell align="left">{validatorToken}</TableCell>
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

               <Iconify cursor={validators?.data?.currentPage == 1 ? '' : 'pointer'} width={30} icon={'mingcute:left-line'} style={validators?.data?.currentPage == 1 ? dissabledPaginationStyle : ''} onClick={validators?.data?.currentPage == 1 ? '' : () => { handleGetValidatorList(validators?.data?.currentPage - 1) }} />
               <Typography variant="p" gutterBottom>
                  {validators?.data?.currentPage}  of  {validators?.data?.totalPages}
               </Typography>

               <Iconify cursor={validators?.data?.currentPage == validators?.data?.totalPages ? '' : 'pointer'} width={30} icon={'mingcute:right-line'} style={validators?.data?.currentPage == validators?.data?.totalPages ? dissabledPaginationStyle : ''} onClick={validators?.data?.currentPage == validators?.data?.totalPages ? '' : () => { handleGetValidatorList(validators?.data?.currentPage + 1) }} />
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
