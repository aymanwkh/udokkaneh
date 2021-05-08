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
  subCount?: number,
  weightedPrice?: number,
  unitsCount?: number,
  byWeight: boolean,
  withGift?: boolean,
  forSale: boolean
}
export type PackStore = {
  storeId: string,
  isRetail: boolean,
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
  time?: Date,
  type: string
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
export type StoreRequest = {
  id?: string,
  storeId: string,
  packId: string
}
export type State = {
  user?: firebase.User,
  userInfo?: UserInfo,
  categories: Category[],
  basket: Pack[],
  packs: Pack[],
  packStores: PackStore[],
  adverts: Advert[],
  locations: Location[],
  countries: Country[],
  trademarks: Trademark[],
  passwordRequests: PasswordRequest[],
  notifications: Notification[],
  alarms: Alarm[],
  storeRequests: StoreRequest[],
  stores: Store[],
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