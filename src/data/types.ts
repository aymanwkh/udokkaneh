import firebase from './firebase'

export type Label = {
    [key: string]: string
}
export type Category = {
  id: string,
  name: string,
  parentId: string,
  ordering: number,
  isLeaf: boolean
}
export type Error = {
  code: string,
  message: string
}
export type Pack = {
  id: string,
  name: string,
  productId: string,
  productName: string,
  productDescription?: string,
  imageUrl: string,
  price: number,
  categoryId: string,
  rating: number,
  subPackId?: string,
  subQuantity?: number,
  subPercent?: number,
  subPackName?: string,
  isOffer: boolean,
  offerEnd: Date,
  weightedPrice: number,
  trademarkId?: string,
  countryId: string,
  ratingCount: number,
  categoryName?: string,
  trademarkName?: string,
  countryName?: string
}
export type PackPrice = {
  storeId: string,
  packId: string,
  price: number,
  packInfo?: Pack
  time: Date
}
export type Notification = {
  id: string,
  title: string,
  message: string,
  status: string,
  time: Date
}
export type Friend = {
  mobile: string,
  name: string,
  status: string
}
export type Rating = {
  productId: string
}
export type Alarm = {
  packId?: string,
  type: string,
  price?: number,
  quantity?: number,
  alternative?: string,
  offerDays?: number,
  status: string
}
export type UserInfo = {
  mobile: string,
  locationId: string,
  notifications?: Notification[],
  friends?: Friend[],
  ratings?: Rating[],
  favorites?: string[],
  alarms?: Alarm[]
}
export type CustomerInfo = {
  storeId: string,
  isBlocked: boolean,
  orderLimit: number,
  deliveryFees: number,
  discounts: number,
  specialDiscount: number
}
export type BasketPack = {
  packId: string,
  productId: string,
  productName: string,
  productDescription: string,
  packName: string,
  imageUrl: string,
  price: number,
  quantity: number,
  offerId: string
  closeExpired: boolean,
  byWeight: boolean,
  weight?: number,
  purchased?: number,
  returned?: number
}
export type BigBasketPack = BasketPack & {
  packInfo?: Pack,
  totalPriceText: string,
  priceText: string,
  otherProducts: number,
  otherOffers: number,
  otherPacks: number
}
export type Advert = {
  id: string,
  type: string,
  title: string,
  text: string,
  isActive: boolean,
  imageUrl?: string
}
export type Location = {
  id: string,
  name: string,
  fees: number,
  ordering: number
}
export type Country = {
  id: string,
  name: string,
}
export type Trademark = {
  id: string,
  name: string,
}
export type PasswordRequest = {
  id: string,
  mobile: string
}
export type Discount = {
  value: number,
  type: string
}
export type State = {
  user?: firebase.User,
  userInfo?: UserInfo,
  customerInfo?: CustomerInfo,
  categories: Category[],
  basket: BasketPack[],
  packs: Pack[],
  packPrices: PackPrice[],
  adverts: Advert[],
  locations: Location[],
  countries: Country[],
  trademarks: Trademark[],
  passwordRequests: PasswordRequest[],
}

export type Action = {
  type: string
  payload?: any
}

export type Context = {
  state: State;
  dispatch: React.Dispatch<Action>
}