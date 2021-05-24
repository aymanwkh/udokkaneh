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
import AddPack from './pages/add-pack'
import Basket from './pages/basket'
import ProductRequests from './pages/product-requests'
import Notifications from './pages/notifications'
import StoreDetails from './pages/store-details'
import Hints from './pages/hints'
import AddProductRequest from './pages/add-product-request'
import Advert from './pages/advert'
import Claims from './pages/claims'

const app = () => {
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
              <Route path="/packs/:id/:type" exact={true} component={Packs} />
              <Route path="/pack-details/:id" exact={true} component={PackDetails} />
              <Route path="/add-pack/:id" exact={true} component={AddPack} />
              <Route path="/basket" exact={true} component={Basket} />
              <Route path="/product-requests" exact={true} component={ProductRequests} />
              <Route path="/notifications" exact={true} component={Notifications} />
              <Route path="/store-details/:storeId/:packId" exact={true} component={StoreDetails} />
              <Route path="/hints/:id/:type" exact={true} component={Hints} />
              <Route path="/add-product-request" exact={true} component={AddProductRequest} />
              <Route path="/advert" exact={true} component={Advert} />
              <Route path="/claims" exact={true} component={Claims} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </StateProvider>
  );
};

export default app;

