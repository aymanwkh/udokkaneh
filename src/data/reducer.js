const Reducer = (state, action) => {
  let pack, packIndex, packs, nextQuantity
  const increment = [0.125, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  switch (action.type){
    case 'ADD_TO_BASKET':
      if (state.basket.find(p => p.packId === action.pack.id)) return state
      pack = {
        packId: action.pack.id,
        productName: action.pack.productName,
        packName: action.pack.name,
        price: action.pack.price,
        quantity: 1,
        isDivided: action.pack.isDivided,
        byWeight: action.pack.byWeight,
        maxQuantity: action.pack.maxQuantity,
        offerId: action.pack.offerId,
        time: new Date()
      }
      packs = [...state.basket, pack]
      localStorage.setItem('basket', JSON.stringify(packs))
      return {...state, basket: packs}
    case 'INCREASE_QUANTITY':
      if (action.pack.isDivided) {
        nextQuantity = increment.filter(i => i > action.pack.quantity)
        nextQuantity = Math.min(...nextQuantity)
        nextQuantity = nextQuantity === Infinity ? action.pack.quantity : nextQuantity
      } else if (action.pack.maxQuantity && action.pack.quantity >= pack.maxQuantity) {
        nextQuantity = action.pack.quantity
      } else {
        nextQuantity = action.pack.quantity + 1
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
        nextQuantity = increment.filter(i => i < action.pack.quantity)
        nextQuantity = Math.max(...nextQuantity)
        nextQuantity = nextQuantity === -Infinity ? 0 : nextQuantity
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
        orderBasket: action.order.basket
      }
    case 'CLEAR_ORDER_BASKET':
      return {
        ...state,
        orderBasket: []
      }
    case 'INCREASE_ORDER_QUANTITY':
      if (action.pack.packInfo.isDivided) {
        nextQuantity = increment.filter(i => i > action.pack.quantity)
        nextQuantity = Math.min(...nextQuantity)
        nextQuantity = nextQuantity === Infinity ? action.pack.quantity : nextQuantity
      } else {
        nextQuantity = action.pack.quantity + 1
      }
      pack = {
        ...action.pack,
        quantity: nextQuantity,
        gross: parseInt(action.pack.price * nextQuantity)
      }
      packs = state.orderBasket.slice()
      packIndex = packs.findIndex(p => p.packId === action.pack.packId)
      packs.splice(packIndex, 1, pack)
      return {...state, orderBasket: packs}
    case 'DECREASE_ORDER_QUANTITY':
      if (action.pack.weight) {
        if (action.pack.isDivided) {
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
      } else if (action.pack.isDivided) {
        nextQuantity = increment.filter(i => i < action.pack.quantity)
        nextQuantity = Math.max(...nextQuantity)
        nextQuantity = nextQuantity === -Infinity ? 0 : nextQuantity
      } else {
        nextQuantity = action.pack.quantity - 1
      }
      pack = {
        ...action.pack,
        quantity: nextQuantity,
        gross: parseInt(action.pack.price * nextQuantity)
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
    case 'SET_STORE_PACKS':
      return {
        ...state,
        storePacks: action.storePacks
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
    case 'SET_POSITION_ORDERS':
      return {
        ...state,
        positionOrders: action.orders
      }
    case 'SET_CUSTOMERS':
      return {
        ...state,
        customers: action.customers
      }
    default:
      return state
  }
}

export default Reducer