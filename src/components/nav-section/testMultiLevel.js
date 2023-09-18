export default MultiLevel = ({ item }) => {
   const { items: children } = item;
   const [open, setOpen] = useState(false);

   const handleClick = () => {
      setOpen((prev) => !prev);
   };

   return (
      <React.Fragment>
         <ListItem button onClick={handleClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
         </ListItem>
         <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
               {children.map((child, key) => (
                  <MenuItem key={key} item={child} />
               ))}
            </List>
         </Collapse>
      </React.Fragment>
   );
};