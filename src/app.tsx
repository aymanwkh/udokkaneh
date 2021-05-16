import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import StateProvider from './data/state-provider'


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './css/variables.css';
import './css/app.css';

import Panel from './pages/panel';
import Home from './pages/home';
import Login from './pages/login';
import PasswordRequest from './pages/password-request';
import Register from './pages/register';
import ChangePassword from './pages/change-password';
import Categories from './pages/categories';
import Packs from './pages/packs';
import PackDetails from './pages/pack-details';

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
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </StateProvider>
  );
};

export default app;

