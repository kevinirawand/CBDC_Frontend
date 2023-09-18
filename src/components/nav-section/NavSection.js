import { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText, MenuItem } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import ExpandHome from './ExpandHome';
// ----------------------------------------------------------------------

NavSection.propTypes = {
   data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
   return (
      <Box {...other}>
         <List disablePadding sx={{ p: 1 }} >
            {data.map((item) => {
               return <NavItem key={item.title} item={item} />
            })}
         </List>
      </Box>
   );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
   item: PropTypes.object,
};

function NavItem({ item }) {
   const [open, setOpen] = useState(false);

   const handleClick = () => {
      setOpen(!open);

   };

   const { title, path, icon, info } = item;

   return (
      <div>
         <StyledNavItem
            component={RouterLink}
            to={path === '#' ? '' : path}
            onClick={item.items ? handleClick : ''}
         >

            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
            <ListItemText disableTypography primary={title} />

            {info && info}
         </StyledNavItem>
         {open ? <ExpandHome data={item.items} /> : ''}

      </div>
   );
}
