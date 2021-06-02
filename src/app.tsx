import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { Route } from 'react-router-dom'
import StateProvider from './data/state-provider'


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './css/variables.css'
import './css/app.css'

import Panel from './pages/panel'
import Home from './pages/home'
import Login from './pages/login'
import PasswordRequest from './pages/password-request'
import Register from './pages/register'
import ChangePassword from './pages/change-password'
import Categories from './pages/categories'
import Packs from './pages/packs'
import PackDetails from './pages/pack-details'
import AddPackRequest from './pages/add-pack-request'
import Basket from './pages/basket'
import ProductRequests from './pages/product-requests'
import Notifications from './pages/notifications'
import StoreDetails from './pages/store-details'
import AddProductRequest from './pages/add-product-request'
import Advert from './pages/advert'
import Claims from './pages/claims'
import Map from './pages/map'
import Help from './pages/help'

const app = () => {
  const href = window.location.href
  if (href.length - href.replaceAll('/', '').length !== (href.endsWith('/') ? 3 : 2)) {
    window.location.href = window.location.hostname === 'localhost' ? href.substr(0, 21) : href.substr(0, 28)
  }
  return (
    <StateProvider>
      <IonApp dir="rtl">
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Panel />
            <IonRouterOutlet id="main" mode="ios">
              <Route path="/" exact={true} component={Home} />
              <Route path="/login" exact={true} component={Login} />
              <Route path="/register" exact={true} component={Register} />
              <Route path="/password-request" exact={true} component={PasswordRequest} />
              <Route path="/change-password" exact={true} component={ChangePassword} />
              <Route path="/categories/:id" exact={true} component={Categories} />
              <Route path="/packs/:type/:id/:storeId" exact={true} component={Packs} />
              <Route path="/pack-details/:id" exact={true} component={PackDetails} />
              <Route path="/add-pack-request/:id" exact={true} component={AddPackRequest} />
              <Route path="/basket" exact={true} component={Basket} />
              <Route path="/product-requests" exact={true} component={ProductRequests} />
              <Route path="/notifications" exact={true} component={Notifications} />
              <Route path="/store-details/:storeId/:packId" exact={true} component={StoreDetails} />
              <Route path="/add-product-request" exact={true} component={AddProductRequest} />
              <Route path="/advert" exact={true} component={Advert} />
              <Route path="/claims" exact={true} component={Claims} />
              <Route path="/map/:lat/:lng/:updatable" exact={true} component={Map} />
              <Route path="/help" exact={true} component={Help} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </StateProvider>
  );
};

export default app;

