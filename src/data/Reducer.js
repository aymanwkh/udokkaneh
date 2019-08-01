const Reducer = (state, action) => {
    let newQuantity
    let newBasket
    switch (action.type){
      case 'ADD_TO_BASKET':
        if (state.basket.find(product => product.id === action.product.id)) return state
        newBasket = [...state.basket, {...action.product, quantity: 1, netPrice: action.product.price}]
        localStorage.setItem('basket', JSON.stringify(newBasket));
        return {...state, basket: newBasket}
      case 'ADD_QUANTITY':
        newQuantity = state.basket.find(product => product.id === action.product.id).quantity
        newBasket = state.basket.filter(product => product.id !== action.product.id)
        newBasket = [...newBasket, {...action.product, quantity: ++newQuantity, netPrice: newQuantity * action.product.price}]
        localStorage.setItem('basket', JSON.stringify(newBasket));
        return {...state, basket: newBasket}
      case 'REMOVE_QUANTITY':
        newQuantity = state.basket.find(product => product.id === action.product.id).quantity--
        newBasket = state.basket.filter(product => product.id !== action.product.id)
        if (--newQuantity > 0) {
          newBasket = [...newBasket, {...action.product, quantity: newQuantity, netPrice: newQuantity * action.product.price}]
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