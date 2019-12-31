import Home from './pages/home'
import NotFoundPage from './pages/not-found-page'
import Categories from './pages/categories'
import Panel from './pages/panel'
import Login from './pages/login'
import Register from './pages/register'
import Packs from './pages/packs'
import PackDetails from './pages/pack-details'
import Basket from './pages/basket'
import ConfirmOrder from './pages/confirm-order'
import OrdersList from './pages/orders-list'
import OrderDetails from './pages/order-details'
import AddAlarm from './pages/add-alarm'
import ForgetPassword from './pages/forget-password'
import InviteFriend from './pages/invite-friend'
import StoreOwner from './pages/store-owner'
import OwnerPacks from './pages/owner-packs'
import ChangePassword from './pages/change-password'
import OtherOffers from './pages/other-offers'
import ContactUs from './pages/contact-us'
import RateProduct from './pages/rate-product'
import Ratings from './pages/ratings'
import Help from './pages/help'

export default [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/home/',
    component: Home,
  },
  {
    path: '/panel/',
    component: Panel
  },
  {
    path: '/login/',
    component: Login,
    options: {
      reloadCurrent: true,
    },
  },
  {
    path: '/panel-login/',
    component: Login,
  },
  {
    path: '/forget-password/',
    component: ForgetPassword
  },
  {
    path: '/change-password/',
    component: ChangePassword
  },
  {
    path: '/register/',
    component: Register,
    options: {
      reloadCurrent: true,
    },
  },
  {
    path: '/store-owner/',
    component: StoreOwner
  },
  {
    path: '/invite-friend/',
    component: InviteFriend
  },
  {
    path: '/categories/:id',
    component: Categories,
  },
  {
    path: '/packs/:id',
    component: Packs,
  },
  {
    path: '/pack/:id',
    component: PackDetails,
  },
  {
    path: '/add-alarm/:packId/type/:alarmType',
    component: AddAlarm,
  },
  {
    path: '/basket/',
    component: Basket,
  },
  {
    path: '/confirm-order/',
    component: ConfirmOrder,
  },
  {
    path: '/search/',
    component: Packs,
  },
  {
    path: '/orders-list/',
    component: OrdersList,
  },
  {
    path: '/order-details/:id',
    component: OrderDetails,
  },
  {
    path: '/owner-packs/:id',
    component: OwnerPacks,
  },
  {
    path: '/other-offers/:id',
    component: OtherOffers
  },
  {
    path: '/contact-us/',
    component: ContactUs
  },
  {
    path: '/rate-product/:productId/value/:value',
    component: RateProduct
  },
  {
    path: '/ratings/:id',
    component: Ratings
  },
  {
    path: '/help/:id',
    component: Help
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },

]
