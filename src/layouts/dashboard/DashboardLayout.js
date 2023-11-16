import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Header from './header';
import Nav from './nav'

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
   display: 'flex',
   minHeight: '100%',
   overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
   flexGrow: 1,
   overflow: 'auto',
   minHeight: '100%',
   paddingTop: APP_BAR_MOBILE + 24,
   paddingBottom: theme.spacing(10),
   [theme.breakpoints.up('lg')]: {
      paddingTop: APP_BAR_DESKTOP + 24,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
   },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
   const [user, setUser] = useState([]);

   useEffect(() => {
      handleUser()
   }, [])

   const handleUser = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      const response = await fetch(`http://localhost:1337/api/v1/user/${userId}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const userJson = await response.json();
      setUser(userJson)
   }

   const [open, setOpen] = useState(false);


   return (
      <StyledRoot>
         <Header onOpenNav={() => setOpen(true)} user={user} />

         <Nav openNav={open} onCloseNav={() => setOpen(false)} />

         <Main>
            <Outlet />
         </Main>
      </StyledRoot>
   );
}
