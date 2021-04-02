import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { ReactNode } from 'react'
import Toast from './toast_'
import Header from './header_'
import Footer from './footer_'

const useStyles = makeStyles((theme) => ({
  page: {
    background: '#f9f9f9',
    width: '100%',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5)
  },
}));
interface Props {
  children: ReactNode;
}
const Layout = ({ children }: Props) => {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <Header />
      <div className={classes.page}>
        {children}
      </div>
      <Footer />
      <Toast />
    </>
  )

}

export default Layout