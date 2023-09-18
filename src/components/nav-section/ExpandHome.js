import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

ExpandHome.propTypes = {
   data: PropTypes.array,
};

export default function ExpandHome({ data }) {
   return (
      <Box style={{ zIndex: '-1' }}>
         <Box style={{ width: '75%', display: 'flex', flexDirection: 'column', padding: '10px', gap: '10px', justifyItems: 'flex-end' }}>
            {data.map((item) => {
               return <NavItem key={item.title} item={item} />
            })}
         </Box>
      </Box>
   )
}

function NavItem({ item }) {

   const { title, path, icon, info } = item;

   return (
      <div>
         <StyledNavItem
            component={RouterLink}
            to={path}
            sx={{
               '&.active': {
                  color: 'text.primary',
                  bgcolor: 'action.selected',
                  fontWeight: 'fontWeightBold',
               },
            }}
         >

            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
            <ListItemText disableTypography primary={title} />

            {info && info}
         </StyledNavItem>
      </div>
   )
}