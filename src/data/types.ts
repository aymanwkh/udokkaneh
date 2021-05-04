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
export type ProductRequest = {
  id?: string,
  storeId: string,
  name: string,
  country: string,
  weight: string,
  price: number,
  imageUrl: string,
  time?: Date
}
export type Product = {
  id: string,
  name: string,
  alias?: string,
  description?: string,
  categoryId: string,
  countryId: string,
  trademarkId?: string,
  unit: string,
  rating: number,
  ratingCount: number
}
export type Pack = {
  id?: string,
  name: string,
  product: Product,
  imageUrl: string,
  price?: number,
  subPackId?: string,
  subQuantity?: number,
  weightedPrice?: number,
  unitsCount: number,
  byWeight: boolean
}
export type PackPrice = {
  storeId: string,
  packId: string,
  price: number,
  time: Date
}
export type Notification = {
  id: string,
  title: string,
  message: string,
  time: Date
}
export type Rating = {
  productId: string,
  value: number
}
export type Alarm = {
  packId: string,
  storeId: string,
  type: string,
  time: Date
}
export type Position = {
  lat: number, 
  lng: number
}
export type UserInfo = {
  name: string,
  password?: string,
  mobile: string,
  position: Position,
  address?: string,
  storeId?: string,
  storeName?: string,
  lastSeen?: Date,
  time?: Date
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
  byWeight: boolean,
  weight?: number,
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
export type Store = {
  id?: string,
  name: string,
  mobile: string,
  address: string,
  position: Position,
  locationId?: string
}
export type PackRequest = {
  storeId: string,
  packId: string
}
export type State = {
  user?: firebase.User,
  userInfo?: UserInfo,
  categories: Category[],
  basket: BasketPack[],
  packs: Pack[],
  packPrices: PackPrice[],
  adverts: Advert[],
  locations: Location[],
  countries: Country[],
  trademarks: Trademark[],
  passwordRequests: PasswordRequest[],
  notifications: Notification[],
  alarms: Alarm[],
  packRequests: PackRequest[],
  stores: Store[],
  favorites: string[],
  ratings: Rating[],
  productRequests: ProductRequest[]
}

export type Action = {
  type: string
  payload?: any
}

export type Context = {
  state: State;
  dispatch: React.Dispatch<Action>
}