const Reducer = (state, action) => {
  let pack
  let otherPacks
  let newBasket
  let nextQuantity
  const increment = [0.125, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  switch (action.type){
    case 'ADD_TO_BASKET':
      if (state.basket.find(p => p.packId === action.pack.id)) return state
      pack = {
        packId: action.pack.id,
        price: action.pack.price,
        quantity: 1,
        isDivided: action.pack.isDivided,
        byWeight: action.pack.byWeight,
        orderLimit: action.pack.orderLimit,
        maxQuantity: action.pack.maxQuantity,
        offerId: action.pack.offerId,
        time: new Date()
      }
      newBasket = [...state.basket, pack]
      localStorage.setItem('basket', JSON.stringify(newBasket))
      return {...state, basket: newBasket}
    case 'INCREASE_QUANTITY':
      pack = state.basket.find(p => p.packId === action.pack.packId)
      otherPacks = state.basket.filter(p => p.packId !== action.pack.packId)
      if (pack.isDivided) {
        nextQuantity = increment.filter(i => i > pack.quantity)
        nextQuantity = Math.min(...nextQuantity)
        nextQuantity = nextQuantity === Infinity ? pack.quantity : nextQuantity
      } else if (pack.maxQuantity && pack.quantity >= pack.maxQuantity) {
        nextQuantity = pack.quantity
      } else {
        nextQuantity = pack.quantity + 1
      }
      pack = {
        ...pack,
        quantity: nextQuantity
      }
      newBasket = [...otherPacks, pack]
      localStorage.setItem('basket', JSON.stringify(newBasket))
      return {...state, basket: newBasket}
    case 'DECREASE_QUANTITY':
      pack = state.basket.find(p => p.packId === action.pack.packId)
      otherPacks = state.basket.filter(p => p.packId !== action.pack.packId)
      if (pack.isDivided) {
        nextQuantity = increment.filter(i => i < pack.quantity)
        nextQuantity = Math.max(...nextQuantity)
        nextQuantity = nextQuantity === -Infinity ? 0 : nextQuantity
      } else {
        nextQuantity = pack.quantity - 1
      }
      if (nextQuantity === 0) {
        if (otherPacks.length > 0){
          newBasket = [...otherPacks]
        } else {
          newBasket = []
        }
      } else {
        pack = {
          ...pack,
          quantity: nextQuantity
        }
        newBasket = [...otherPacks, pack]
      }
      localStorage.setItem('basket', JSON.stringify(newBasket))
      return {...state, basket: newBasket}
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
      pack = state.orderBasket.find(p => p.packId === action.pack.packId)
      otherPacks = state.orderBasket.filter(p => p.packId !== action.pack.packId)
      if (pack.isDivided) {
        nextQuantity = increment.filter(i => i > pack.quantity)
        nextQuantity = Math.min(...nextQuantity)
        nextQuantity = nextQuantity === Infinity ? pack.quantity : nextQuantity
      } else {
        nextQuantity = pack.quantity + 1
      }
      pack = {
        ...pack,
        quantity: nextQuantity,
        gross: parseInt(pack.price * nextQuantity)
      }
      return {...state, orderBasket: [...otherPacks, pack]}
    case 'DECREASE_ORDER_QUANTITY':
      pack = state.orderBasket.find(p => p.packId === action.pack.packId)
      otherPacks = state.orderBasket.filter(p => p.packId !== action.pack.packId)
      if (pack.weight) {
        if (pack.isDivided) {
          if (pack.quantity > pack.weight) {
            nextQuantity = pack.weight
          } else {
            nextQuantity = 0
          }  
        } else {
          if (pack.quantity > pack.purchased) {
            nextQuantity = pack.purchased
          } else {
            nextQuantity = 0
          }  
        }
      } else if (pack.isDivided) {
        nextQuantity = increment.filter(i => i < pack.quantity)
        nextQuantity = Math.max(...nextQuantity)
        nextQuantity = nextQuantity === -Infinity ? 0 : nextQuantity
      } else {
        nextQuantity = pack.quantity - 1
      }
      pack = {
        ...pack,
        quantity: nextQuantity,
        gross: parseInt(pack.price * nextQuantity)
      }  
      return {...state, orderBasket: [...otherPacks, pack]}
    case 'SET_CUSTOMER':
      return {
        ...state,
        customer: action.customer
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
    case 'SET_RATINGS':
      return {
        ...state,
        ratings: action.ratings
      }    
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.categories
      }
    case 'SET_TRADEMARKS':
      return {
        ...state,
        trademarks: action.trademarks
      }
    case 'SET_COUNTRIES':
      return {
        ...state,
        countries: action.countries
      }
    case 'SET_STORES':
      return {
        ...state,
        stores: action.stores
      }
    case 'SET_INVITATIONS':
      return {
        ...state,
        invitations: action.invitations
      }
    case 'SET_LOCATIONS':
      return {
        ...state,
        locations: action.locations
      }
    case 'SET_STORE_PACKS':
      return {
        ...state,
        storePacks: action.storePacks,
        lastRetreive: new Date()
      }
    case 'SET_ALARMS':
      return {
        ...state,
        alarms: action.alarms
      }    
    case 'SET_ORDER_REQUESTS':
      return {
        ...state,
        orderRequests: action.orderRequests
      }    
    case 'SET_PASSWORD_REQUESTS':
      return {
        ...state,
        passwordRequests: action.passwordRequests
      }    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.notifications
      }
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.favorites
      }
    case 'SET_ADVERTS':
      return {
        ...state,
        adverts: action.adverts
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