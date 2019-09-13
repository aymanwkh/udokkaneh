import HomePage from './pages/HomePage';
import DynamicRoutePage from './pages/DynamicRoutePage';
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
import LessPrice from './pages/LessPrice';
import ForgetPassword from './pages/ForgetPassword';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    name: 'home',
    path: '/home/',
    component: HomePage,
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
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/section/:id',
    component: Categories
  },
  {
    path: '/category/:id',
    component: Packs
  },
  {
    path: '/pack/:id',
    component: PackDetails
  },
  {
    path: '/lessPrice/:id',
    component: LessPrice
  },
  {
    path: '/basket/',
    component: Basket
  },
  {
    path: '/confirmOrder/',
    component: ConfirmOrder
  },
  {
    path: '/search/',
    component: Packs,
  },
  {
    path: '/ordersList/',
    component: OrdersList
  },
  {
    path: '/order/:id',
    component: OrderDetails
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },

];
