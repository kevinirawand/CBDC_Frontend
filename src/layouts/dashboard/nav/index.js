import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import useResponsive from '../../../hooks/useResponsive';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import centralBankConfig from './centralBankConfig'
import intermediariesConfig from './intermediariesConfig';
import forbiddenConfig from './forbiddenConfig';
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
   display: 'flex',
   alignItems: 'center',
   padding: theme.spacing(2, 2.5),
   borderRadius: Number(theme.shape.borderRadius) * 1.5,
   backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
   openNav: PropTypes.bool,
   onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
   const { pathname } = useLocation();
   const [user, setUser] = useState([]);

   const isDesktop = useResponsive('up', 'lg');

   useEffect(() => {
      handleUser()
   }, [])

   useEffect(() => {
      if (openNav) {
         onCloseNav();
      }
   }, [pathname]);


   const handleUser = async () => {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')

      const response = await fetch(`http://103.13.206.208:1337/api/v1/user/${userId}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'X-Auth': `Bearer ${token}`
         }
      })

      const userJson = await response.json();
      setUser(userJson)
   }


   const renderContent = (
      <Scrollbar
         sx={{
            height: 1,
            '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
         }}
      >
         <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
            <img src="/assets/images/Logo_Institut_Teknologi_Bandung.png" alt="logo" />
         </Box>

         <Box sx={{ mb: 5, mx: 2.5 }}>
            <Link underline="none">
               <StyledAccount>

                  <img width="50" src={`/static/images/profile/${user?.data?.profilePicture}`} alt="photoURL" />

                  <Box sx={{ ml: 2 }}>
                     <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                        {user?.data?.name}
                     </Typography>

                     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user?.data?.role}
                     </Typography>
                  </Box>
               </StyledAccount>
            </Link>
         </Box>

         <NavSection data={user?.data?.role === 'Intermediaries' ? intermediariesConfig : user?.data?.role === 'Central Bank' ? centralBankConfig : forbiddenConfig} />
         {/* <NavSection data={intermediariesConfig} /> */}

      </Scrollbar>
   );

   return (
      <Box
         component="nav"
         sx={{
            flexShrink: { lg: 0 },
            width: { lg: NAV_WIDTH },
         }}
      >
         {isDesktop ? (
            <Drawer
               open
               variant="permanent"
               PaperProps={{
                  sx: {
                     width: NAV_WIDTH,
                     bgcolor: 'background.default',
                     borderRightStyle: 'dashed',
                  },
               }}
            >
               {renderContent}
            </Drawer>
         ) : (
            <Drawer
               open={openNav}
               onClose={onCloseNav}
               ModalProps={{
                  keepMounted: true,
               }}
               PaperProps={{
                  sx: { width: NAV_WIDTH },
               }}
            >
               {renderContent}
            </Drawer>
         )}
      </Box>
   );
}
