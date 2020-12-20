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
import PasswordRequest from './pages/password-request'
import InviteFriend from './pages/invite-friend'
import StoreSummary from './pages/store-summary'
import StorePacks from './pages/store-packs'
import ChangePassword from './pages/change-password'
import Hints from './pages/hints'
import Help from './pages/help'
import Notifications from './pages/notifications'
import NotificationDetails from './pages/notification-details'
import PurchasedPacks from './pages/purchased-packs'
import Advert from './pages/advert'
import EditOrder from './pages/edit-order'
import Friends from './pages/friends'

const routes = [
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
    path: '/password-request/',
    component: PasswordRequest
  },
  {
    path: '/change-password/',
    component: ChangePassword
  },
  {
    path: '/register/:type',
    component: Register,
    options: {
      reloadCurrent: true,
    },
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
    path: '/packs/:id/type/:type',
    component: Packs,
  },
  {
    path: '/pack-details/:id/type/:type',
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
    path: '/store-summary/',
    component: StoreSummary,
  },
  {
    path: '/store-packs/:type',
    component: StorePacks,
  },
  {
    path: '/hints/:id/type/:type',
    component: Hints
  },

  {
    path: '/help/:id',
    component: Help
  },
  {
    path: '/notifications/',
    component: Notifications
  },
  {
    path: '/notification-details/:id',
    component: NotificationDetails
  },
  {
    path: '/purchased-packs/',
    component: PurchasedPacks
  },
  {
    path: '/advert/',
    component: Advert
  },
  {
    path: '/edit-order/:id',
    component: EditOrder
  },
  {
    path: '/friends/',
    component: Friends
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
]


export default routes