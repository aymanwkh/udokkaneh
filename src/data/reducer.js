const Reducer = (state, action) => {
  let pack, packIndex, packs, nextQuantity, i
  const increment = [0.125, 0.25, 0.5, 0.75, 1]
  switch (action.type){
    case 'ADD_TO_BASKET':
      if (state.basket.find(p => p.packId === action.pack.id)) return state
      pack = {
        packId: action.pack.id,
        productName: action.pack.productName,
        productAlias: action.pack.productAlias,
        packName: action.pack.name,
        imageUrl: action.pack.imageUrl,
        subQuantity: action.pack.subQuantity,
        bonusPackId: action.pack.bonusPackId,
        bonusImageUrl: action.pack.bonusImageUrl,
        bonusQuantity: action.pack.bonusQuantity,
        price: action.pack.price,
        quantity: 1,
        isDivided: action.pack.isDivided,
        byWeight: action.pack.byWeight,
        maxQuantity: action.pack.maxQuantity,
        offerId: action.pack.offerId,
        withBestPrice: false
      }
      packs = [...state.basket, pack]
      localStorage.setItem('basket', JSON.stringify(packs))
      return {...state, basket: packs}
    case 'TOGGLE_BEST_PRICE':
      pack = {
        ...action.pack,
        withBestPrice: !action.pack.withBestPrice
      }
      packs = state.basket.slice()
      packIndex = packs.findIndex(p => p.packId === action.pack.packId)
      packs.splice(packIndex, 1, pack)
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
            oldQuantity: p.quantity,
            oldWithBestPrice: p.withBestPrice
          }
        })
      }
    case 'CLEAR_ORDER_BASKET':
      return {
        ...state,
        orderBasket: []
      }
      case 'TOGGLE_ORDER_BEST_PRICE':
        pack = {
          ...action.pack,
          withBestPrice: !action.pack.withBestPrice
        }
        packs = state.orderBasket.slice()
        packIndex = packs.findIndex(p => p.packId === action.pack.packId)
        packs.splice(packIndex, 1, pack)
        return {...state, orderBasket: packs}
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
        gross: Math.trunc(action.pack.price * nextQuantity)
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
        gross: Math.trunc(action.pack.price * nextQuantity)
      }  
      packs = state.orderBasket.slice()
      packIndex = packs.findIndex(p => p.packId === action.pack.packId)
      packs.splice(packIndex, 1, pack)
      return {...state, orderBasket: packs}
    case 'SET_USER_INFO':
      return {
        ...state,
        userInfo: action.userInfo
      }
    case 'SET_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: action.customerInfo
      }
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.orders
      }
    case 'SET_PACKS':
      return {
        ...state,
        packs: action.packs
      }
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.categories
      }
    case 'SET_PACK_PRICES':
      return {
        ...state,
        packPrices: action.packPrices
      }
    case 'SET_ADVERTS':
      return {
        ...state,
        adverts: action.adverts
      }
    case 'SET_LOCATIONS':
      return {
        ...state,
        locations: action.locations
      }
    default:
      return state
  }
}

export default Reducer