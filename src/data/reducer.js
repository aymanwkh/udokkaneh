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
    case 'LOAD_BASKET':
      localStorage.setItem('basket', JSON.stringify(action.basket))
      return {...state, basket: action.basket}
    case 'SET_BASKET':
      return {...state, basket: action.basket}
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
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.products
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
    case 'SET_SECTIONS':
      return {
        ...state,
        sections: action.sections
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
        storePacks: action.storePacks
      }
    case 'SET_PRICE_ALARMS':
      return {
        ...state,
        priceAlarms: action.priceAlarms
      }    
    case 'SET_CANCEL_ORDERS':
      return {
        ...state,
        cancelOrders: action.cancelOrders
      }    
    case 'SET_FORGET_PASSWORDS':
      return {
        ...state,
        forgetPasswords: action.forgetPasswords
      }    
    default:
      return state
  }
}

export default Reducer