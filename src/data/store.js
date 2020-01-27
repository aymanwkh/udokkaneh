import React, { createContext, useReducer, useEffect, useState } from 'react'
import Reducer from './reducer'
import firebase from './firebase'

export const StoreContext = createContext()

const Store = props => {
  const [user, setUser] = useState(null)
  const initState = {
    categories: [], 
    basket: [], 
    userInfo: {},
    customerInfo: {},
    orders: [],
    packs: [],
    locations: [],
    storePacks: [],
    adverts: [],
    positionOrders: [],
    customers: []
  }
  const [state, dispatch] = useReducer(Reducer, initState)

  useEffect(() => {
    const unsubscribeCategories = firebase.firestore().collection('categories').onSnapshot(docs => {
      let categories = []
      docs.forEach(doc => {
        categories.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_CATEGORIES', categories})
    }, err => {
      unsubscribeCategories()
    })  
    const unsubscribePacks = firebase.firestore().collection('packs').where('price', '>', 0).onSnapshot(docs => {
      let packs = []
      docs.forEach(doc => {
        packs.push({...doc.data(), id: doc.id})
      })
      dispatch({type: 'SET_PACKS', packs})
    }, err => {
      unsubscribePacks()
    })
    const unsubscribeAdverts = firebase.firestore().collection('adverts').where('isActive', '==', true).onSnapshot(docs => {
      let adverts = []
      docs.forEach(doc => {
        adverts.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_ADVERTS', adverts})
    }, err => {
      unsubscribeAdverts()
    })  

    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      if (user){
        const localData = localStorage.getItem('basket')
        const basket = localData ? JSON.parse(localData) : []
        if (basket) dispatch({type: 'SET_BASKET', basket}) 
        const unsubscribeUser = firebase.firestore().collection('users').doc(user.uid).onSnapshot(doc => {
          if (doc.exists){
            dispatch({type: 'SET_USER_INFO', userInfo: doc.data()})
          }
        }, err => {
          unsubscribeUser()
        })  
        const unsubscribeCustomer = firebase.firestore().collection('customers').doc(user.uid).onSnapshot(doc => {
          if (doc.exists){
            dispatch({type: 'SET_CUSTOMER_INFO', customerInfo: doc.data()})
          }
        }, err => {
          unsubscribeCustomer()
        })  
        const unsubscribeOrders = firebase.firestore().collection('orders').where('userId', '==', user.uid).onSnapshot(docs => {
          let orders = []
          docs.forEach(doc => {
            orders.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_ORDERS', orders})
        }, err => {
          unsubscribeOrders()
        }) 
        const unsubscribeLocations = firebase.firestore().collection('locations').onSnapshot(docs => {
          let locations = []
          docs.forEach(doc => {
            locations.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_LOCATIONS', locations})
        }, err => {
          unsubscribeLocations()
        })      
        if (user.photoURL) { //store owner
          const unsubscribeStorePacks = firebase.firestore().collection('store-packs').where('storeId', '==', user.photoURL).onSnapshot(docs => {
          let storePacks = []
            docs.forEach(doc => {
              storePacks.push({...doc.data(), id:doc.id})
            })
            dispatch({type: 'SET_STORE_PACKS', storePacks})
          }, err => {
            unsubscribeStorePacks()
          })
        }
        if (user.displayName === 'c' || user.displayName === 'd') { //delivery guy
          const unsubscribeCustomers = firebase.firestore().collection('customers').onSnapshot(docs => {
            let customers = []
            docs.forEach(doc => {
              customers.push({...doc.data(), id:doc.id})
            })
            dispatch({type: 'SET_CUSTOMERS', customers})
          }, err => {
            unsubscribeCustomers()
          })
          const unsubscribeOrders = firebase.firestore().collection('orders').where('position', '==', user.displayName).onSnapshot(docs => {
            let orders = []
            docs.forEach(doc => {
              orders.push({...doc.data(), id:doc.id})
            })
            dispatch({type: 'SET_POSITION_ORDERS', orders})
          }, err => {
            unsubscribeOrders()
          })
        
        }
      }
    })
  }, [])
  return (
    <StoreContext.Provider value={{state, user, dispatch}}>
      {props.children}
    </StoreContext.Provider>
  )
}
 
export default Store

