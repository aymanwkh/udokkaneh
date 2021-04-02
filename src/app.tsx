import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Store from './data/store'
import Home from './pages/home_'
import Packs from './pages/packs_'
import PackDetails from './pages/pack-details_'
import Layout from './pages/layout_'

const app = () => {
  return (
    <Store>
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/search" component={Packs} />
            <Route path="/pack-details/:id/type/:type" component={PackDetails} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </Store>
  )
}

export default app