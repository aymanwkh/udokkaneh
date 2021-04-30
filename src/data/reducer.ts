import { State, Action } from './types'

const Reducer = (state: State, action: Action) => {
  let pack, packs
  switch (action.type){
    case 'ADD_TO_BASKET':
      if (state.basket.find(p => p.packId === action.payload.id)) return state
      pack = {
        packId: action.payload.id,
        productId: action.payload.productId,
        productName: action.payload.productName,
        productDescription: action.payload.productDescription,
        packName: action.payload.name,
        imageUrl: action.payload.imageUrl,
        price: action.payload.price,
        quantity: 1,
        isDivided: action.payload.isDivided,
        byWeight: action.payload.byWeight,
        maxQuantity: action.payload.maxQuantity,
        offerId: action.payload.offerId,
        closeExpired: action.payload.closeExpired
      }
      packs = [...state.basket, pack]
      localStorage.setItem('basket', JSON.stringify(packs))
      return {...state, basket: packs}
    case 'CLEAR_BASKET':
      localStorage.setItem('basket', JSON.stringify([]))
      return {...state, basket: []}
    case 'SET_BASKET':
      return {...state, basket: action.payload}
    case 'LOGIN':
      return {...state, user: action.payload}
    case 'LOGOUT':
      return {...state, user: undefined}
    case 'SET_USER_INFO':
      return {...state, userInfo: action.payload}
    case 'SET_NOTIFICATIONS':
      return {...state, notifications: action.payload}
    case 'CLEAR_USER_INFO':
      return {...state, userInfo: undefined}
    case 'SET_PACKS':
      return {...state, packs: action.payload}
    case 'SET_CATEGORIES':
      return {...state, categories: action.payload}
    case 'SET_PACK_PRICES':
      return {...state, packPrices: action.payload}
    case 'SET_ADVERTS':
      return {...state, adverts: action.payload}
    case 'SET_LOCATIONS':
      return {...state, locations: action.payload}
    case 'SET_COUNTRIES':
      return {...state, countries: action.payload}
    case 'SET_UNITS':
      return {...state, units: action.payload}
    case 'SET_PASSWORD_REQUESTS':
      return {...state, passwordRequests: action.payload}
    default:
      return state
  }
}

export default Reducer