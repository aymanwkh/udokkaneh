const Reducer = (state, action) => {
  let pack
  let newQuantity
  let otherPacks
  let newBasket
  switch (action.type){
    case 'ADD_TO_BASKET':
      if (state.basket.find(rec => rec.id === action.pack.id)) return state
      pack = {
        ...action.pack,
        quantity: 1
      }
      newBasket = [...state.basket, pack]
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'ADD_QUANTITY':
      newQuantity = state.basket.find(rec => rec.id === action.pack.id).quantity
      otherPacks = state.basket.filter(rec => rec.id !== action.pack.id)
      pack = {
        ...action.pack,
        quantity: ++newQuantity,
      }
      newBasket = [...otherPacks, pack]
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'REMOVE_QUANTITY':
      newQuantity = state.basket.find(rec => rec.id === action.pack.id).quantity
      otherPacks = state.basket.filter(rec => rec.id !== action.pack.id)
      if (--newQuantity === 0) {
        if (otherPacks.length > 0){
          newBasket = [...otherPacks]
        } else {
          newBasket = []
        }
      } else {
        pack = {
          ...action.pack,
          quantity: newQuantity
        }
        newBasket = [...otherPacks, pack]
      }
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'CLEAR_BASKET':
      newBasket = []
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'LOAD_BASKET':
      newBasket = action.order.basket
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'RATE_PRODUCT':
      return {
        ...state,
        rating: [...state.rating, action.rating]
      }
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
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: action.comments
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