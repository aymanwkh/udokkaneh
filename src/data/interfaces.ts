import firebase from './firebase'
import { firestore } from 'firebase';

export interface iCategory {
  id: string,
  name: string,
  parentId: string,
  ordering: number
}
export interface iPack {

}
export interface iPackPrice {

}
export interface iNotification {
  status: string
}
export interface iUserInfo {
  notifications?: iNotification[]
}
export interface iCustomerInfo {

}
export interface iBasketPack {

}
export interface iOrder {

}
export interface iAdvert {
  id: string,
  title: string,
  isActive: boolean
}
export interface iLocation {

}
export interface iPasswordRequest {

}
export interface iState {
  user?: firebase.User,
  userInfo: iUserInfo,
  customerInfo: iCustomerInfo,
  categories: iCategory[],
  basket: iBasketPack[],
  orders: iOrder[],
  packs: iPack[],
  packPrices: iPackPrice[],
  adverts: iAdvert[],
  locations: iLocation[],
  passwordRequests: iPasswordRequest[]
}

export interface iAction {
  type: string
  payload?: any
}

export interface iContext {
  state: iState;
  dispatch: React.Dispatch<iAction>
}