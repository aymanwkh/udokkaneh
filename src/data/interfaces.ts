import firebase from './firebase'
import { firestore } from 'firebase';

export interface iLabel {
    [key: string]: string
}
export interface iCategory {
  id: string,
  name: string,
  parentId: string,
  ordering: number,
  isLeaf: boolean
}
export interface iError {
  code: string,
  message: string
}
export interface iPack {
  id: string,
  name: string,
  productId: string,
  productName: string,
  price: number,
  categoryId: string,
  sales: number,
  rating: number,
  subPackId?: string,
  subQuantity?: number,
  subPercent?: number,
  bonusQuantity?: number,
  bonusPercent?: number,
  isOffer: boolean,
  offerEnd: Date,
  weightedPrice: number
}
export interface iPackPrice {
  storeId: string,
  packId: string,
  price: number

}
export interface iNotification {
  id: string,
  title: string,
  status: string,
  time: Date
}
export interface iUserInfo {
  locationId: string,
  notifications?: iNotification[]
}
export interface iCustomerInfo {
  storeId: string,
  isBlocked: boolean,
  orderLimit: number,
  deliveryFees: number,
  discounts: number,
  specialDiscount: number
}
export interface iBasketPack {
  packId: string,
  productId: string,
  productName: string,
  productAlias: string,
  packName: string,
  imageUrl: string,
  price: number,
  quantity: number,
  offerId: string
  closeExpired: boolean,
  byWeight: boolean,

}
export interface iOrderPack extends iBasketPack {
  gross: number,
  purchased: number,
  status: string,
}
export interface iBigBasketPack extends iBasketPack {
  packInfo?: iPack,
  totalPriceText: string,
  priceText: string,
  otherProducts: number,
  otherOffers: number,
  otherPacks: number
}
export interface iOrder {
  id?: string,
  basket: iOrderPack[],
  status: string,
  total: number,
  fixedFees: number,
  deliveryFees: number,
  discount?: iDiscount,
  fraction: number
}
export interface iAdvert {
  id: string,
  type: string,
  title: string,
  text: string,
  isActive: boolean,
  imageUrl?: string
}
export interface iLocation {
  id: string,
  name: string,
  fees: number

}
export interface iPasswordRequest {

}
export interface iDiscount {
  value: number,
  type: string
}
export interface iState {
  user?: firebase.User,
  userInfo?: iUserInfo,
  customerInfo?: iCustomerInfo,
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