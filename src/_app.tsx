import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Store from './data/store'
import Home from './pages/_home'
import Basket from './pages/_basket'
import Search from './pages/_search'
import Header from './pages/_header'
import Footer from './pages/_footer'

const app = () => {
  return (
    <Store>
      <>
        <CssBaseline />
        <Header />
        <Footer />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/search" component={Search} />
            <Route path="/basket" component={Basket} />
          </Switch>
        </BrowserRouter>
      </>
    </Store>
  )
}

export default app