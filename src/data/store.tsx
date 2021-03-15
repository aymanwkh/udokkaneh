import { createContext, useReducer, useEffect, ReactElement } from 'react'
import Reducer from './reducer'
import firebase from './firebase'
import { State, Context, Category, Pack, PackPrice, Advert, PasswordRequest, Order } from './interfaces'

export const StoreContext = createContext({} as Context)

const Store = ({ children }: { children: ReactElement }) => {
  const initState: State = {
    categories: [], 
    basket: [], 
    orders: [],
    packs: [],
    packPrices: [],
    adverts: [],
    locations: [],
    countries: [],
    trademarks: [],
    passwordRequests: [],
    orderBasket: []
  }
  const [state, dispatch] = useReducer(Reducer, initState)

  useEffect(() => {
    const unsubscribeCategories = firebase.firestore().collection('categories').where('isActive', '==', true).onSnapshot(docs => {
      let categories: Category[] = []
      docs.forEach(doc => {
        categories.push({
          id: doc.id,
          name: doc.data().name,
          ename: doc.data().ename,
          parentId: doc.data().parentId,
          ordering: doc.data().ordering,
          isLeaf: doc.data().isLeaf
        })
      })
      dispatch({type: 'SET_CATEGORIES', payload: categories})
    }, err => {
      unsubscribeCategories()
    })  
    const unsubscribePacks = firebase.firestore().collection('packs').where('price', '>', 0).onSnapshot(docs => {
      let packs: Pack[] = []
      let packPrices: PackPrice[] = []
      docs.forEach(doc => {
        packs.push({
          id: doc.id,
          name: doc.data().name,
          productId: doc.data().productId,
          productName: doc.data().productName,
          productEname: doc.data().productEname,
          productDescription: doc.data().productDescription,
          imageUrl: doc.data().imageUrl,
          price: doc.data().price,
          categoryId: doc.data().categoryId,
          sales: doc.data().sales,
          rating: doc.data().rating,
          ratingCount: doc.data().ratingCount,
          isOffer: doc.data().isOffer,
          offerEnd: doc.data().offerEnd,
          weightedPrice: doc.data().weightedPrice,
          isDivided: doc.data().isDivided,
          trademarkId: doc.data().trademarkId,
          countryId: doc.data().countryId,
          closeExpired: doc.data().closeExpired
        })
        if (doc.data().prices) {
          doc.data().prices.forEach((p: PackPrice) => {
            packPrices.push({...p, packId: doc.id})
          })
        }
      })
      dispatch({type: 'SET_PACKS', payload: packs})
      dispatch({type: 'SET_PACK_PRICES', payload: packPrices})
    }, err => {
      unsubscribePacks()
    })
    const unsubscribeAdverts = firebase.firestore().collection('adverts').where('isActive', '==', true).onSnapshot(docs => {
      let adverts: Advert[] = []
      docs.forEach(doc => {
        adverts.push({
          id: doc.id,
          type: doc.data().type,
          title: doc.data().title,
          text: doc.data().text,
          isActive: doc.data().isActive,
          imageUrl: doc.data().imageUrl
        })
      })
      dispatch({type: 'SET_ADVERTS', payload: adverts})
    }, err => {
      unsubscribeAdverts()
    })  
    const unsubscribeLocations = firebase.firestore().collection('lookups').doc('l').onSnapshot(doc => {
      dispatch({type: 'SET_LOCATIONS', payload: doc.data()?.values})
    }, err => {
      unsubscribeLocations()
    })  
    const unsubscribeCountries = firebase.firestore().collection('lookups').doc('c').onSnapshot(doc => {
      dispatch({type: 'SET_COUNTRIES', payload: doc.data()?.values})
    }, err => {
      unsubscribeCountries()
    })  
    const unsubscribePasswordRequests = firebase.firestore().collection('password-requests').onSnapshot(docs => {
      let passwordRequests: PasswordRequest[] = []
      docs.forEach(doc => {
        passwordRequests.push({
          id: doc.id,
          mobile: doc.data().mobile
        })
      })
      dispatch({type: 'SET_PASSWORD_REQUESTS', payload: passwordRequests})
    }, err => {
      unsubscribePasswordRequests()
    })  
    firebase.auth().onAuthStateChanged(user => {
      dispatch({type: 'LOGIN', payload: user})
      if (user){
        const localData = localStorage.getItem('basket')
        const basket = localData ? JSON.parse(localData) : []
        if (basket) dispatch({type: 'SET_BASKET', payload: basket}) 
        const unsubscribeUser = firebase.firestore().collection('users').doc(user.uid).onSnapshot(doc => {
          if (doc.exists){
            dispatch({type: 'SET_USER_INFO', payload: doc.data()})
          } else {
            firebase.auth().signOut()
          }
        }, err => {
          unsubscribeUser()
        })  
        const unsubscribeCustomer = firebase.firestore().collection('customers').doc(user.uid).onSnapshot(doc => {
          if (doc.exists){
            dispatch({type: 'SET_CUSTOMER_INFO', payload: doc.data()})
          }
        }, err => {
          unsubscribeCustomer()
        })  
        const unsubscribeOrders = firebase.firestore().collection('orders').where('userId', '==', user.uid).onSnapshot(docs => {
          let orders: Order[] = []
          docs.forEach(doc => {
            orders.push({
              id: doc.id,
              basket: doc.data().basket,
              status: doc.data().status,
              total: doc.data().total,
              fixedFees: doc.data().fixedFees,
              deliveryFees: doc.data().deliveryFees,
              discount: doc.data().discount,
              fraction: doc.data().fraction,
              requestType: doc.data().requestType,
              time: doc.data().time
            })
          })
          dispatch({type: 'SET_ORDERS', payload: orders})
        }, err => {
          unsubscribeOrders()
        }) 
      } else {
        dispatch({type: 'CLEAR_USER_INFO'})
        dispatch({type: 'CLEAR_CUSTOMER_INFO'})
        dispatch({type: 'SET_ORDERS', payload: []})
      }
    })
  }, [])
  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}
 
export default Store

