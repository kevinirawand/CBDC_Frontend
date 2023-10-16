import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
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
   TextField,
   Backdrop,
   TableContainer,
   Box,
   Modal,
   Fade,
   TablePagination,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
   { id: 'intermediaries_name', label: 'Issuing Intermediaries Name', alignRight: false },
   { id: 'issuing_idntermediaries_id', label: 'Issuing Intermediaries ID', alignRight: false },
   { id: 'validators_id', label: 'Validators ID', alignRight: false },
   { id: '' },
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

export default function CBValidatorsList() {
   const [open, setOpen] = useState(null);
   const [page, setPage] = useState(0);
   const [order, setOrder] = useState('asc');
   const [selected, setSelected] = useState([]);
   const [orderBy, setOrderBy] = useState('name');
   const [filterName, setFilterName] = useState('');
   const [rowsPerPage, setRowsPerPage] = useState(5);

   const [tokenID, setTokenID] = useState("");
   const handleSubmit = async e => {
         e.preventDefault();
         handleModalClose();
      }


   const [modalOpen, setModalOpen] = useState(false);
   const [modalFormOpen, setModalFormOpen] = useState(false);
   const handleModalOpen = () => setModalOpen(true);
   const handleModalClose = () => setModalOpen(false);

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


   useEffect(() => {
       (async () => {
           const token = localStorage.getItem('token')
           const response = await fetch(`http://103.13.206.208:1337/api/v1/token-validator?page=1&perPage=25`, {
               method: 'GET',
               headers: {
                   'Content-Type': 'application/json',
                   'X-Auth': `Bearer ${token}`
               }
           })

           console.info("T::", response)
           const json = await response.json();
           console.info("T::", json)
       })();
   }, [])

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
                        <TextField name="token-validator" label="Token Validator ID" onChange={(e) => setTokenID(e.target.value)} />
                     </Stack>
                     <LoadingButton style={{ marginTop: '25px' }} fullWidth size="large" type="submit" variant="contained">
                        Set
                     </LoadingButton>
                  </form>
               </Box>
            </Fade>
         </Modal>

         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modalFormOpen}
            onClose={handleModalClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
               backdrop: {
                  timeout: 500,
               },
            }}
         >
            <Fade in={modalFormOpen}>
               <Box sx={modalStyle}>
                <form onSubmit={(e) => {e.preventDefault(); setModalFormOpen(false)}}>
                     <Stack spacing={3}>
                        <TextField name="token-validator" label="Token Validator ID" onChange={(e) => setTokenID(e.target.value)} />
                     </Stack>
                     <LoadingButton style={{ marginTop: '25px' }} fullWidth size="large" type="submit" variant="contained">
                        Delete
                     </LoadingButton>
                  </form>
               </Box>
            </Fade>
         </Modal>

         <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
               Token Validators List
            </Typography>
            <Button onClick={handleModalOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
               Set Validators
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


                                 {/* <TableCell align="left">
                                    <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                                 </TableCell> */}

                                 <TableCell align="right">
                                    <IconButton size="large" color="inherit" onClick={() => setModalFormOpen(true)}>
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
      </>
   );
}
