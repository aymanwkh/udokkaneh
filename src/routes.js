import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Categories from './pages/Categories'
import PanelPage from './pages/PanelPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Packs from './pages/Packs'
import PackDetails from './pages/PackDetails'
import Basket from './pages/Basket'
import ConfirmOrder from './pages/ConfirmOrder'
import OrdersList from './pages/OrdersList';
import OrderDetails from './pages/OrderDetails';
import PriceAlarm from './pages/PriceAlarm';
import ForgetPassword from './pages/ForgetPassword';
import InviteFriend from './pages/InviteFriend';
import StoreOwner from './pages/StoreOwner';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    name: 'home',
    path: '/home/',
    component: HomePage,
    options: {
      transition: 'f7-cover-v',
    }
  },
  {
    path: '/panel/',
    component: PanelPage
  },
  {
    path: '/login/:callingPage',
    component: Login
  },
  {
    path: '/forgetPassword/',
    component: ForgetPassword
  },
  {
    path: '/register/:callingPage',
    component: Register
  },
  {
    path: '/storeOwner/',
    component: StoreOwner
  },
  {
    path: '/inviteFriend/',
    component: InviteFriend
  },
  {
    path: '/section/:id',
    component: Categories,
    options: {
      transition: 'f7-cover',
    }
  },
  {
    path: '/category/:id',
    component: Packs,
    options: {
      transition: 'f7-cover',
    }
  },
  {
    path: '/pack/:id',
    component: PackDetails,
    options: {
      transition: 'f7-cover',
    }
  },
  {
    path: '/priceAlarm/:id',
    component: PriceAlarm,
    options: {
      transition: 'f7-cover',
    }
  },
  {
    path: '/basket/',
    component: Basket,
    options: {
      transition: 'f7-cover-v',
    }
  },
  {
    path: '/confirmOrder/',
    component: ConfirmOrder,
    options: {
      transition: 'f7-cover-v',
    }
  },
  {
    path: '/search/',
    component: Packs,
    options: {
      transition: 'f7-cover-v',
    }
  },
  {
    path: '/ordersList/',
    component: OrdersList,
    options: {
      transition: 'f7-cover',
    }
  },
  {
    path: '/order/:id',
    component: OrderDetails,
    options: {
      transition: 'f7-cover',
    }
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },

];
