import * as React from 'react';

import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
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
   IconButton,
   TableContainer,
   TablePagination,
   TextField,
   InputAdornment,
   Grid, Container, Typography,
   Backdrop,
   Box,
   Modal,
   Fade,
   Select,
   InputLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
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


export default function CBUsersPage() {
   const [modalOpen, setModalOpen] = React.useState(false);
   const handleModalOpen = () => setModalOpen(true);
   const handleModalClose = () => setModalOpen(false);

   const TABLE_HEAD = [
      { id: 'name', label: 'Name', alignRight: false },
      { id: 'email', label: 'Email', alignRight: false },
      { id: 'role', label: 'Role', alignRight: false },
      { id: 'is_validator', label: 'Is Validator', alignRight: false },
      { id: 'last_activity', label: 'Last Activity', alignRight: false },
      { id: '' },
   ];

   // ----------------------------------------------------------------------

   const [open, setOpen] = useState(null);
   const [page, setPage] = useState(0);
   const [order, setOrder] = useState('asc');
   const [selected, setSelected] = useState([]);
   const [orderBy, setOrderBy] = useState('name');
   const [filterName, setFilterName] = useState('');
   const [rowsPerPage, setRowsPerPage] = useState(5);

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

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setPage(0);
      setRowsPerPage(parseInt(event.target.value, 10));
   };

   const handleFilterByName = (event) => {
      setPage(0);
      setFilterName(event.target.value);
   };

   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

   const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

   const isNotFound = !filteredUsers.length && !!filterName;

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

   async function createUser(credentials) {
      console.info(credentials)
      const response = await fetch('/api/v1/auth/register', {
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
   const [nameError, setNameError] = useState('');
   const [phoneNumberError, setPhoneNumberError] = useState('');
   const [roleError, setRoleError] = useState('');
   const [passwordError, setPasswordError] = useState('')
   const [passwordConfirmationError, setPasswordConfirmationError] = useState('');

   const [email, setEmail] = useState();
   const [name, setName] = useState();
   const [phoneNumber, setphoneNumber] = useState();
   const [role, setRole] = useState();
   const [isValidator, setIsValidator] = useState(false);
   const [password, setPassword] = useState();
   const [passwordConfirmation, setPasswordConfirmation] = useState();


   const handleSubmit = async e => {
      e.preventDefault();

      setEmailError('');
      setNameError('');
      setPhoneNumberError('');
      setRoleError('');
      setPasswordError('');
      setPasswordConfirmationError('');

      const response = await createUser({
         name: name,
         phoneNumber,
         email,
         role,
         isValidator,
         password,
         passwordConfirmation
      });

      console.info(response)

      if (response.code !== 200) {
         if (response.errors.email) {
            setEmailError(response.errors.email)
         }

         if (response.errors.name) {
            setNameError(response.errors.name)
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

      } else {
         handleModalClose()
         window.alert('Create User Successfuly!')
      }
   }

   const handleRole = (event) => {
      setRole(event.target.value);
   };

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

                        <TextField name="name" label="Name" onChange={e => setName(e.target.value)} />
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
                              <MenuItem value={'Merchan'}>Merchant</MenuItem>
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

         <Container maxWidth="auto">
            <Grid container spacing={3}>
               <Grid item xs={12} md={12} lg={12}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                     <Typography variant="h4" gutterBottom>
                        User List
                     </Typography>
                     <Button onClick={handleModalOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                        Create User
                     </Button>
                  </Stack>

                  <Card>
                     <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                     <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                           <Table>
                              <UserListHead
                                 order={order}
                                 orderBy={orderBy}
                                 headLabel={TABLE_HEAD}
                                 rowCount={USERLIST.length}
                                 numSelected={selected.length}
                                 onRequestSort={handleRequestSort}
                                 onSelectAllClick={handleSelectAllClick}
                              />
                              <TableBody>
                                 {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { id, name, role, status, company, avatarUrl, isVerified } = row;
                                    const selectedUser = selected.indexOf(name) !== -1;

                                    return (
                                       <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                          <TableCell padding="checkbox">
                                             <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                                          </TableCell>

                                          <TableCell component="th" scope="row" padding="none">
                                             <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar alt={name} src={avatarUrl} />
                                                <Typography variant="subtitle2" noWrap>
                                                   {name}
                                                </Typography>
                                             </Stack>
                                          </TableCell>

                                          <TableCell align="left">{company}</TableCell>

                                          <TableCell align="left">{role}</TableCell>

                                          <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                                          <TableCell align="left">
                                             <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                                          </TableCell>

                                          <TableCell align="right">
                                             <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                <Iconify icon={'eva:more-vertical-fill'} />
                                             </IconButton>
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
                                                Not found
                                             </Typography>

                                             <Typography variant="body2">
                                                No results found for &nbsp;
                                                <strong>&quot;{filterName}&quot;</strong>.
                                                <br /> Try checking for typos or using complete words.
                                             </Typography>
                                          </Paper>
                                       </TableCell>
                                    </TableRow>
                                 </TableBody>
                              )}
                           </Table>
                        </TableContainer>
                     </Scrollbar>

                     <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={USERLIST.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                     />
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
               </Grid>
            </Grid>
         </Container>
      </>
   );
}
