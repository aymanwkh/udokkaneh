import { useState, useContext, MouseEvent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import LockOpen from '@material-ui/icons/LockOpen';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom'
import { StoreContext } from '../data/store'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
 
  }),
);

const MyAppBar = () => {
  const classes = useStyles();
  const history = useHistory()
  const { state, dispatch } = useContext(StoreContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
  }
  const handleLogout = () => {
    logout()
    setAnchorEl(null);
  };
  const handleLogin = async () => {
    if (state.user) logout()
    else history.push('/login')
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Dokknaeh
          </Typography>
          {state.user ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={menuOpen}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : <Button color="inherit" aria-label="login" onClick={() => history.push('/login')}>Login</Button>}
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(!drawerOpen)}>
        <div
          className={classes.list}
          onClick={() => setDrawerOpen(!drawerOpen)}
          onKeyDown={() => setDrawerOpen(!drawerOpen)}
          >
          <List>
            <ListItem button onClick={handleLogin}>
              <ListItemIcon>{<LockOpen />}</ListItemIcon>
              <ListItemText primary={state.user ? 'Logout' : 'Login'} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default MyAppBar




