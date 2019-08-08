const Reducer = (state, action) => {
  let product
  let newQuantity
  let otherProducts
  let newBasket
  let time
  switch (action.type){
    case 'ADD_TO_BASKET':
      if (state.basket.find(product => product.id === action.product.id)) return state
      product = {
        id: action.product.id,
        name: action.product.name,
        country: action.product.country,
        price: action.product.price,
        imageUrl: action.product.imageUrl,
        quantity: 1,
        purchasedQuantity: 0,
        netPrice: parseFloat(action.product.price).toFixed(3),
        time: new Date()
      }
      newBasket = [...state.basket, product]
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'ADD_QUANTITY':
      newQuantity = state.basket.find(product => product.id === action.product.id).quantity
      time = state.basket.find(product => product.id === action.product.id).time
      otherProducts = state.basket.filter(product => product.id !== action.product.id)
      product = {
        id: action.product.id,
        name: action.product.name,
        country: action.product.country,
        imageUrl: action.product.imageUrl,
        price: action.product.price,
        quantity: ++newQuantity,
        purchasedQuantity: 0,
        netPrice: parseFloat(newQuantity * action.product.price).toFixed(3),
        time: time
      }
      newBasket = [...otherProducts, product]
      localStorage.setItem('basket', JSON.stringify(newBasket));
      return {...state, basket: newBasket}
    case 'REMOVE_QUANTITY':
      newQuantity = state.basket.find(product => product.id === action.product.id).quantity
      time = state.basket.find(product => product.id === action.product.id).time
      otherProducts = state.basket.filter(product => product.id !== action.product.id)
      if (--newQuantity === 0) {
        if (otherProducts.length > 0){
          newBasket = [...otherProducts]
        } else {
          newBasket = []
        }
      } else {
        product = {
          id: action.product.id,
          name: action.product.name,
          country: action.product.country,
          imageUrl: action.product.imageUrl,
          price: action.product.price,
          quantity: newQuantity,
          purchasedQuantity: 0,
          netPrice: parseFloat(newQuantity * action.product.price).toFixed(3),
          time: time
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