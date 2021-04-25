import { createContext, useReducer, useEffect } from 'react'
import Reducer from './reducer'
import firebase from './firebase'
import { State, Context, Category, Pack, PackPrice, Advert, PasswordRequest } from './types'

export const StateContext = createContext({} as Context)

type Props = {
  children: React.ReactElement
}
const StateProvider = ({ children }: Props) => {
  const initState: State = {
    categories: [], 
    basket: [], 
    packs: [],
    packPrices: [],
    adverts: [],
    locations: [],
    countries: [],
    trademarks: [],
    passwordRequests: [],
  }
  const [state, dispatch] = useReducer(Reducer, initState)

  useEffect(() => {
    const unsubscribeCategories = firebase.firestore().collection('categories').where('isActive', '==', true).onSnapshot(docs => {
      let categories: Category[] = []
      docs.forEach(doc => {
        categories.push({
          id: doc.id,
          name: doc.data().name,
          parentId: doc.data().parentId,
          ordering: doc.data().ordering,
          isLeaf: doc.data().isLeaf
        })
      })
      dispatch({type: 'SET_CATEGORIES', payload: categories})
    }, err => {
      unsubscribeCategories()
    })  
    const unsubscribePacks = firebase.firestore().collection('packs').where('isArchived', '==', false).onSnapshot(docs => {
      let packs: Pack[] = []
      let packPrices: PackPrice[] = []
      docs.forEach(doc => {
        let prices, minPrice = 0
        if (doc.data().prices) {
          prices = doc.data().prices.map((p: PackPrice) => p.price)
          minPrice = prices.length > 0 ? Math.min(...prices) : 0
        }
        packs.push({
          id: doc.id,
          name: doc.data().name,
          product: doc.data().product,
          imageUrl: doc.data().imageUrl,
          price: minPrice,
          isOffer: doc.data().isOffer,
          offerEnd: doc.data().offerEnd,
          weightedPrice: Math.floor(minPrice / doc.data().standardUnits),
        })
        if (doc.data().prices) {
          doc.data().prices.forEach((p: PackPrice) => {
            packPrices.push({...p, packId: doc.id})
          })
        }
      })
      console.log('packs = ', packs)
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
      } else {
        dispatch({type: 'CLEAR_USER_INFO'})
        dispatch({type: 'CLEAR_CUSTOMER_INFO'})
        dispatch({type: 'SET_ORDERS', payload: []})
      }
    })
  }, [])
  return (
    <StateContext.Provider value={{state, dispatch}}>
      {children}
    </StateContext.Provider>
  )
}
 
export default StateProvider

