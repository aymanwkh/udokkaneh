import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { StoreContext } from '../data/store'
import { useContext, SyntheticEvent } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Toast = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(StoreContext)

  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({type: 'CLOSE_ALERT'})
  };

  return (
    <div className={classes.root}>
      <Snackbar open={state.toast?.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert elevation={6} variant="filled" onClose={handleClose} severity={state.toast?.alertType}>
          {state.toast?.alertText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Toast