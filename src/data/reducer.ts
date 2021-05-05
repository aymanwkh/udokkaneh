import {State, Action} from './types'

const Reducer = (state: State, action: Action) => {
  let packs
  switch (action.type){
    case 'ADD_TO_BASKET':
      packs = [...state.basket, action.payload]
      localStorage.setItem('basket', JSON.stringify(packs))
      return {...state, basket: packs}
    case 'DELETE_FROM_BASKET':
      packs = state.basket.filter(p => p.storeId !== action.payload.storeId && p.packId === action.payload.packId)
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
    case 'SET_PACK_STORES':
      return {...state, packStores: action.payload}
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
    case 'SET_PACK_REQUESTS':
      return {...state, packRequests: action.payload}
    case 'SET_STORES':
      return {...state, stores: action.payload}
    case 'SET_FAVORITES':
      return {...state, favorites: action.payload}  
    case 'SET_RATINGS':
      return {...state, ratings: action.payload}  
    case 'SET_ALARMS':
      return {...state, alarms: action.payload}    
    case 'SET_PRODUCT_REQUESTS':
      return {...state, productRequests: action.payload}
    default:
      return state
  }
}

export default Reducer