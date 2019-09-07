const Reducer = (state, action) => {
  let product
  let newQuantity
  let otherProducts
  let newBasket
  switch (action.type){
    case 'ADD_TO_BASKET':
      if (state.basket.find(product => product.id === action.product.id)) return state
      product = {
        ...action.product,
        quantity: 1
      }
      newBasket = [...state.basket, product]
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'ADD_QUANTITY':
      newQuantity = state.basket.find(product => product.id === action.product.id).quantity
      otherProducts = state.basket.filter(product => product.id !== action.product.id)
      product = {
        ...action.product,
        quantity: ++newQuantity,
      }
      newBasket = [...otherProducts, product]
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'REMOVE_QUANTITY':
      newQuantity = state.basket.find(product => product.id === action.product.id).quantity
      otherProducts = state.basket.filter(product => product.id !== action.product.id)
      if (--newQuantity === 0) {
        if (otherProducts.length > 0){
          newBasket = [...otherProducts]
        } else {
          newBasket = []
        }
      } else {
        product = {
          ...action.product,
          quantity: newQuantity
        }
        newBasket = [...otherProducts, product]
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
    case 'DONE':
      return {
        ...state,
        result: {message: '', finished: true}
      }
    case 'ERROR':
      return {
        ...state,
        result: {message: action.message, finished: true}
      }
    case 'CLEAR_ERRORS':
      return {
        ...state,
        result: {message: '', finished: false}
      }
    default:
      return state
  }
}

export default Reducer