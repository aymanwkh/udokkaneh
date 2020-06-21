import { iState, iAction } from './interfaces'

const Reducer = (state: iState, action: iAction) => {
  let pack, packIndex, packs, nextQuantity, i
  const increment = [0.125, 0.25, 0.5, 0.75, 1]
  switch (action.type){
    /*case 'ADD_TO_BASKET':
      if (state.basket.find(p => p.packId === action.pack.id)) return state
      pack = {
        packId: action.pack.id,
        productId: action.pack.productId,
        productName: action.pack.productName,
        productAlias: action.pack.productAlias,
        packName: action.pack.name,
        imageUrl: action.pack.imageUrl,
        price: action.pack.price,
        quantity: 1,
        isDivided: action.pack.isDivided,
        byWeight: action.pack.byWeight,
        maxQuantity: action.pack.maxQuantity,
        offerId: action.pack.offerId,
        closeExpired: action.pack.closeExpired
      }
      packs = [...state.basket, pack]
      localStorage.setItem('basket', JSON.stringify(packs))
      return {...state, basket: packs}
    case 'INCREASE_QUANTITY':
      if (action.pack.maxQuantity && action.pack.quantity >= action.pack.maxQuantity) {
        nextQuantity = action.pack.quantity
      } else {
        if (action.pack.isDivided) {
          if (action.pack.quantity >= 1) {
            nextQuantity = action.pack.quantity + 0.5
          } else {
            i = increment.indexOf(action.pack.quantity)
            nextQuantity = increment[++i]  
          }
        } else {
          nextQuantity = action.pack.quantity + 1
        }  
      }
      pack = {
        ...action.pack,
        quantity: nextQuantity
      }
      packs = state.basket.slice()
      packIndex = packs.findIndex(p => p.packId === action.pack.packId)
      packs.splice(packIndex, 1, pack)
      localStorage.setItem('basket', JSON.stringify(packs))
      return {...state, basket: packs}
    case 'DECREASE_QUANTITY':
      if (action.pack.isDivided) {
        if (action.pack.quantity > 1) {
          nextQuantity = action.pack.quantity - 0.5
        } else {
          i = increment.indexOf(action.pack.quantity)
          nextQuantity = i === 0 ? increment[0] : increment[--i]  
        }
      } else {
        nextQuantity = action.pack.quantity - 1
      }
      packs = state.basket.slice()
      packIndex = packs.findIndex(p => p.packId === action.pack.packId)
      if (nextQuantity === 0) {
        packs.splice(packIndex, 1)
      } else {
        pack = {
          ...action.pack,
          quantity: nextQuantity
        }
        packs.splice(packIndex, 1, pack)
      }
      localStorage.setItem('basket', JSON.stringify(packs))
      return {...state, basket: packs}
    case 'CLEAR_BASKET':
      localStorage.setItem('basket', JSON.stringify([]))
      return {...state, basket: []}
    case 'SET_BASKET':
      return {...state, basket: action.basket}
    case 'LOAD_ORDER_BASKET':
      return {
        ...state,
        orderBasket: action.order.basket.map(p => {
          return {
            ...p,
            oldQuantity: p.quantity
          }
        })
      }
    case 'CLEAR_ORDER_BASKET':
      return {
        ...state,
        orderBasket: []
      }
    case 'INCREASE_ORDER_QUANTITY':
      if (action.pack.packInfo.isDivided) {
        if (action.pack.quantity >= 1) {
          nextQuantity = action.pack.quantity + 0.5
        } else {
          i = increment.indexOf(action.pack.quantity)
          nextQuantity = increment[++i]  
        }
      } else {
        nextQuantity = action.pack.quantity + 1
      }
      pack = {
        ...action.pack,
        quantity: nextQuantity,
        gross: Math.round(action.pack.price * nextQuantity)
      }
      packs = state.orderBasket.slice()
      packIndex = packs.findIndex(p => p.packId === action.pack.packId)
      packs.splice(packIndex, 1, pack)
      return {...state, orderBasket: packs}
    case 'DECREASE_ORDER_QUANTITY':
      if (action.pack.weight) {
        if (action.pack.packInfo.isDivided) {
          if (action.pack.quantity > action.pack.weight) {
            nextQuantity = action.pack.weight
          } else {
            nextQuantity = 0
          }  
        } else {
          if (action.pack.quantity > action.pack.purchased) {
            nextQuantity = action.pack.purchased
          } else {
            nextQuantity = 0
          }  
        }
      } else if (action.pack.packInfo.isDivided) {
        if (action.pack.quantity > 1) {
          nextQuantity = action.pack.quantity - 0.5
        } else {
          i = increment.indexOf(action.pack.quantity)
          nextQuantity = i === 0 ? increment[0] : increment[--i]  
        }
      } else {
        nextQuantity = action.pack.quantity - 1
      }
      pack = {
        ...action.pack,
        quantity: nextQuantity,
        gross: Math.round(action.pack.price * nextQuantity)
      }  
      packs = state.orderBasket.slice()
      packIndex = packs.findIndex(p => p.packId === action.pack.packId)
      packs.splice(packIndex, 1, pack)
      return {...state, orderBasket: packs}*/
    case 'SET_USER_INFO':
      return {
        ...state,
        userInfo: action.payload
      }
    case 'SET_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: action.payload
      }
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload
      }
    case 'SET_PACKS':
      return {
        ...state,
        packs: action.payload
      }
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      }
    case 'SET_PACK_PRICES':
      return {
        ...state,
        packPrices: action.payload
      }
    case 'SET_ADVERTS':
      return {
        ...state,
        adverts: action.payload
      }
    case 'SET_LOCATIONS':
      return {
        ...state,
        locations: action.payload
      }
    case 'SET_PASSWORD_REQUESTS':
      return {
        ...state,
        passwordRequests: action.payload
      }
    default:
      return state
  }
}

export default Reducer