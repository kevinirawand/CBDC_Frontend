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
   const [users, setUsers] = useState([]);
   const [modalOpen, setModalOpen] = React.useState(false);
   const handleModalOpen = () => setModalOpen(true);
   const handleModalClose = () => setModalOpen(false);

   const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
   };

   const handleCloseMenu = () => {
      setOpen(null);
   };

   const TABLE_HEAD = [
      { id: 'name', label: 'Name', alignRight: false },
      { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
      { id: 'email', label: 'Email', alignRight: false },
      { id: 'role', label: 'Role', alignRight: false },
      { id: 'isValidator', label: 'Is Validator', alignRight: false },
      { id: 'ganeshaPoint', label: 'Ganesha Point', alignRight: false },
      { id: 'rupiahBalance', label: 'Rupiah', alignRight: false },
      { id: 'lastActivity', label: 'Last Activity', alignRight: false }
   ];

   const handleGetUserList = async (page = 1, perPage = 5) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:1337/api/v1/user?page=${page}&perPage=${perPage}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const usersListJson = await response.json();
      setUsers(usersListJson)
      return usersListJson;
   }

   useEffect(() => {
      handleGetUserList();
   }, [])

   const emptyRows = users?.data?.users
      .length == 0;

   const isNotFound = users?.data?.users
      .length == 0;

   const dissabledPaginationStyle = {
      filter: 'contrast(0)'
   }

   async function createUser(credentials) {
      const response = await fetch('http://localhost:1337/api/v1/auth/register', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            name: credentials.name,
            phoneNumber: credentials.phoneNumber,
            email: credentials.email,
            role: credentials.role,
            isValidator: credentials.isValidator,
            password: credentials.password,
            passwordConfirmation: credentials.passwordConfirmation
         })
      });

      return response.json();
   }

   const [showPassword, setShowPassword] = useState(false);
   const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
   const [emailError, setEmailError] = useState('')
   const [nameError, setnameError] = useState('');
   const [phoneNumberError, setPhoneNumberError] = useState('');
   const [roleError, setRoleError] = useState('');
   const [passwordError, setPasswordError] = useState('')
   const [passwordConfirmationError, setPasswordConfirmationError] = useState('');

   const [email, setEmail] = useState();
   const [name, setname] = useState();
   const [phoneNumber, setphoneNumber] = useState();
   const [role, setRole] = useState();
   const [isValidator, setIsValidator] = useState(false);
   const [password, setPassword] = useState();
   const [passwordConfirmation, setPasswordConfirmation] = useState();

   const handleRole = (event) => {
      setRole(event.target.value);
   };

   const handleSubmit = async e => {
      e.preventDefault();

      setEmailError('');
      setnameError('');
      setPhoneNumberError('');
      setRoleError('');
      setPasswordError('');
      setPasswordConfirmationError('');

      const response = await createUser({
         name,
         phoneNumber,
         email,
         role,
         isValidator,
         password,
         passwordConfirmation
      });

      if (response.code !== 200) {
         if (response.errors.email) {
            setEmailError(response.errors.email)
         }

         if (response.errors.name) {
            setnameError(response.errors.name)
         }

         if (response.errors.phoneNumber) {
            setPhoneNumberError(response.errors.phoneNumber)
         }

         if (response.errors.password) {
            setPasswordError(response.errors.password)
         }

         if (response.errors.passwordConfirmation) {
            setPasswordConfirmationError(response.errors.passwordConfirmation)
         }

         console.info(response.errors)
         window.alert(`Error: ${response.errors.messages.toString()}`)

      } else {
         handleModalClose()
         window.alert('Create User Successfuly!')
      }

      handleGetUserList();
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
                        <TextField name="email" label="Email Address" onChange={e => setEmail(e.target.value)} />
                        {emailError ? <div>{emailError[0]}</div> : ''}

                        <TextField name="name" label="name Lengkap" onChange={e => setname(e.target.value)} />
                        {nameError ? <div>{nameError[0]}</div> : ''}


                        <TextField
                           type="number"
                           name="phoneNumber"
                           label="Nomer HP"
                           onChange={(e) => setphoneNumber(e.target.value)}
                        />
                        {phoneNumberError ? <div>{phoneNumberError[0]}</div> : ''}


                        <Stack>
                           <InputLabel id="demo-simple-select-label">Role</InputLabel>
                           <Select
                              labelId="Role"
                              id="role"
                              value={role}
                              label="Role"
                              onChange={handleRole}
                           >
                              <MenuItem value={'Intermediaries'}>Intermediaries</MenuItem>
                              <MenuItem value={'User'}>User</MenuItem>
                           </Select>
                        </Stack>

                        <TextField
                           name="password"
                           label="Password"
                           type={showPassword ? 'text' : 'password'}
                           InputProps={{
                              endAdornment: (
                                 <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                       <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                 </InputAdornment>
                              ),
                           }}
                           onChange={e => setPassword(e.target.value)}
                        />
                        {passwordError ? <div>{passwordError[0]}</div> : ''}

                        <TextField
                           name="passwordConfirmation"
                           label="Konfirmasi Password"
                           type={showPasswordConfirmation ? 'text' : 'password'}
                           InputProps={{
                              endAdornment: (
                                 <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} edge="end">
                                       <Iconify icon={showPasswordConfirmation ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                    </IconButton>
                                 </InputAdornment>
                              ),
                           }}
                           onChange={e => setPasswordConfirmation(e.target.value)}
                        />
                        {passwordConfirmationError ? <div>{passwordConfirmationError[0]}</div> : ''}
                     </Stack>


                     <LoadingButton style={{ marginTop: '25px' }} fullWidth size="large" type="submit" variant="contained">
                        Create
                     </LoadingButton>
                  </form>
               </Box>
            </Fade>
         </Modal>

         <Helmet>
            <title> Users | CBDC ITB </title>
         </Helmet>

         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
               User List
            </Typography>
            <Button onClick={handleModalOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
               Create User
            </Button>
         </Stack>

         <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            <Scrollbar>
               <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                     <UserListHead
                        headLabel={TABLE_HEAD}
                        rowCount={users?.data?.users.length}
                        numSelected={selected.length}
                     />
                     <TableBody>
                        {users?.data?.users.map((row) => {
                           const { id, name, phoneNumber, email, role, profilePicture, ganeshaPoint, rupiahBalance, updatedAt } = row;
                           const selectedUser = selected.indexOf(id) !== -1;

                           return (
                              <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                 <TableCell component="th" scope="row" padding="none">
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                       <Avatar alt={name} src={`http://localhost:1337/static/images/profile/${profilePicture}`} />
                                       <Typography variant="subtitle2" noWrap>
                                          {name}
                                       </Typography>
                                    </Stack>
                                 </TableCell>

                                 <TableCell align="left">{phoneNumber}</TableCell>

                                 <TableCell align="left">{email}</TableCell>
                                 <TableCell align="left">{role}</TableCell>
                                 <TableCell align="left">{'false'}</TableCell>
                                 <TableCell align="left">{row.wallet.ganeshaPoint}</TableCell>
                                 <TableCell align="left">{row.wallet.rupiahBalance}</TableCell>
                                 <TableCell align="left">{updatedAt}</TableCell>
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

               <Iconify cursor={users?.data?.currentPage == 1 ? '' : 'pointer'} width={30} icon={'mingcute:left-line'} style={users?.data?.currentPage == 1 ? dissabledPaginationStyle : ''} onClick={users?.data?.currentPage == 1 ? '' : () => { handleGetUserList(users?.data?.currentPage - 1) }} />
               <Typography variant="p" gutterBottom>
                  {users?.data?.currentPage}  of  {users?.data?.totalPages}
               </Typography>

               <Iconify cursor={users?.data?.currentPage == users?.data?.totalPages ? '' : 'pointer'} width={30} icon={'mingcute:right-line'} style={users?.data?.currentPage == users?.data?.totalPages ? dissabledPaginationStyle : ''} onClick={users?.data?.currentPage == users?.data?.totalPages ? '' : () => { handleGetUserList(users?.data?.currentPage + 1) }} />
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
