import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Store from './data/store'
import Home from './pages/home_'
import Basket from './pages/_basket'
import Header from './pages/header_'
import Footer from './pages/footer_'
import Packs from './pages/packs_'

const app = () => {
  return (
    <Store>
      <>
        <CssBaseline />
        <BrowserRouter>
          <Header />
          <Footer />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/search" component={Packs} />
            <Route path="/basket" component={Basket} />
          </Switch>
        </BrowserRouter>
      </>
    </Store>
  )
}

export default app