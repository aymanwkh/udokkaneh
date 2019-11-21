const Reducer = (state, action) => {
  let pack
  let otherPacks
  let newBasket
  switch (action.type){
    case 'ADD_TO_BASKET':
      if (state.basket.find(p => p.packId === action.pack.id)) return state
      pack = {
        packId: action.pack.id,
        price: action.pack.price,
        quantity: 1,
        purchasedQuantity: 0,
        time: new Date()
      }
      newBasket = [...state.basket, pack]
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'ADD_QUANTITY':
      pack = state.basket.find(p => p.packId === action.pack.packId)
      otherPacks = state.basket.filter(p => p.packId !== action.pack.packId)
      pack = {
        ...pack,
        quantity: pack.quantity + 1
      }
      newBasket = [...otherPacks, pack]
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'REMOVE_QUANTITY':
      pack = state.basket.find(p => p.packId === action.pack.packId)
      otherPacks = state.basket.filter(p => p.packId !== action.pack.packId)
      if (pack.quantity - 1 === 0) {
        if (otherPacks.length > 0){
          newBasket = [...otherPacks]
        } else {
          newBasket = []
        }
      } else {
        pack = {
          ...pack,
          quantity: pack.quantity - 1
        }
        newBasket = [...otherPacks, pack]
      }
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'CLEAR_BASKET':
      localStorage.setItem('basket', JSON.stringify([]));
      return {...state, basket: []}
    case 'LOAD_BASKET':
      localStorage.setItem('basket', JSON.stringify(action.basket));
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
    default:
      return state
  }
}

export default Reducer