import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

export default function TemporaryDrawer({toggleDrawer,content,drawerOpen}) {
  return (
    <div>
      <Drawer
        anchor="left"
        open={drawerOpen.left}
        onClose={toggleDrawer(false)}
      >
        <div className='px-2 w-[250px]'>
        {content}
        </div>
      </Drawer>
    </div>
  );
}
