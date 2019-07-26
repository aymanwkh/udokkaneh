import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FormPage from './pages/FormPage';
import DynamicRoutePage from './pages/DynamicRoutePage';
import NotFoundPage from './pages/NotFoundPage';
import Categories from './pages/Categories'
import PanelPage from './pages/PanelPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Basket from './pages/Basket'
import ConfirmOrder from './pages/ConfirmOrder'
import OrdersList from './pages/OrdersList';
import OrderDetails from './pages/OrderDetails';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/home/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
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
    component: Products
  },
  {
    path: '/product/:id',
    component: ProductDetails
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
    component: Products,
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
