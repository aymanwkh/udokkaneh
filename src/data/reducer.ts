import {State, Action, Region, Country, Trademark} from './types'

const initState: State = {
  categories: [], 
  basket: [], 
  packs: [],
  packStores: [],
  adverts: [],
  regions: [],
  countries: [],
  trademarks: [],
  passwordRequests: [],
  notifications: [],
  storeRequests: [],
  stores: [],
  ratings: [],
  productRequests: [],
  searchText: '',
  cachedPacks: []
}

const reducer = (state: State = initState, action: Action) => {
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
    case 'SET_REGIONS':
      const regions: Region[] = action.payload
      return {...state, regions: regions.sort((r1, r2) => r1.ordering - r2.ordering)}
    case 'SET_COUNTRIES':
      const countries: Country[] = action.payload
      return {...state, countries: countries.sort((c1, c2) => c1.name > c2.name ? 1 : -1)}
    case 'SET_TRADEMARKS':
      const trademarks: Trademark[] = action.payload
      return {...state, trademarks: trademarks.sort((t1, t2) => t1.name > t2.name ? 1 : -1)}
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
    case 'SET_CACHED_PACKS':
      return {...state, cachedPacks: action.payload}
    default:
      return state
  }
}

export default reducer