import {State, Action} from './types'

const Reducer = (state: State, action: Action) => {
  switch (action.type){
    case 'SET_MAP_POSITION':
      return {...state, mapPosition: action.payload}
    case 'CLEAR_MAP_POSITION':
      return {...state, mapPosition: undefined}
    case 'CLEAR_BASKET':
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
    case 'SET_TRADEMARKS':
      return {...state, trademarks: action.payload}
    case 'SET_PASSWORD_REQUESTS':
      return {...state, passwordRequests: action.payload}
    case 'SET_STORE_REQUESTS':
      return {...state, storeRequests: action.payload}
    case 'SET_STORES':
      return {...state, stores: action.payload}
    case 'SET_RATINGS':
      return {...state, ratings: action.payload}  
    case 'SET_PRODUCT_REQUESTS':
      return {...state, productRequests: action.payload}
    case 'SET_PACK_REQUESTS':
      return {...state, packRequests: action.payload}
    case 'SET_SEARCH':
      return {...state, searchText: action.payload}
    case 'CLEAR_SEARCH':
      return {...state, searchText: ''}
    default:
      return state
  }
}

export default Reducer