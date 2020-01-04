import React, { createContext, useReducer, useEffect, useState } from 'react'
import Reducer from './reducer'
import firebase from './firebase'

export const StoreContext = createContext()

const Store = props => {
  const [user, setUser] = useState(null)
  const initState = {
    categories: [], 
    basket: [], 
    stores: [], 
    ratings: [],
    customer: {},
    orders: [],
    products: [],
    packs: [],
    invitations: [],
    locations: [],
    storePacks: [],
    alarms: [],
    cancelRequests: [],
    passwordRequests: [],
    notifications: []
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
    const unsubscribeProducts = firebase.firestore().collection('products').where('isActive', '==', true).onSnapshot(docs => {
      let products = []
      docs.forEach(doc => {
        products.push({...doc.data(), id: doc.id})
      })
      dispatch({type: 'SET_PRODUCTS', products})
    }, err => {
      unsubscribeProducts()
    })
    const unsubscribePacks = firebase.firestore().collection('packs').where('isActive', '==', true).onSnapshot(docs => {
      let packs = []
      docs.forEach(doc => {
        packs.push({...doc.data(), id: doc.id})
      })
      dispatch({type: 'SET_PACKS', packs})
    }, err => {
      unsubscribePacks()
    })
    const unsubscribePasswordRequests = firebase.firestore().collection('password-requests').where('status', '==', 'n').onSnapshot(docs => {
      let passwordRequests = []
      docs.forEach(doc => {
        passwordRequests.push({...doc.data(), id: doc.id})
      })
      dispatch({type: 'SET_PASSWORD_REQUESTS', passwordRequests})
    }, err => {
      unsubscribePasswordRequests()
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

    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      if (user){
        const localData = localStorage.getItem('basket')
        const basket = localData ? JSON.parse(localData) : []
        if (basket) dispatch({type: 'SET_BASKET', basket})  
        const unsubscribeOrders = firebase.firestore().collection('orders').where('userId', '==', user.uid).onSnapshot(docs => {
          let orders = []
          docs.forEach(doc => {
            orders.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_ORDERS', orders})
        }, err => {
          unsubscribeOrders()
        })  
        const unsubscribeInvitations = firebase.firestore().collection('invitations').where('userId', '==', user.uid).onSnapshot(docs => {
          let invitations = []
          docs.forEach(doc => {
            invitations.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_INVITATIONS', invitations})
        }, err => {
          unsubscribeInvitations()
        })
        const unsubscribeCustomers = firebase.firestore().collection('customers').doc(user.uid).onSnapshot(doc => {
          if (doc.exists){
            dispatch({type: 'SET_CUSTOMER', customer: doc.data()})
          }
        }, err => {
          unsubscribeCustomers()
        })  
        const unsubscribeRating = firebase.firestore().collection('ratings').where('status', '==', 'a').onSnapshot(docs => {
          let ratings = []
          docs.forEach(doc => {
            ratings.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_RATINGS', ratings})
        }, err => {
          unsubscribeRating()
        })  
        const unsubscribeStores = firebase.firestore().collection('stores').onSnapshot(docs => {
          let stores = []
          docs.forEach(doc => {
            stores.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_STORES', stores})
        }, err => {
          unsubscribeStores()
        }) 
        const unsubscribeStorePacks = firebase.firestore().collection('store-packs').onSnapshot(docs => {
          let storePacks = []
          docs.forEach(doc => {
            storePacks.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_STORE_PACKS', storePacks})
        }, err => {
          unsubscribeStorePacks()
        })
        const unsubscribeAlarms = firebase.firestore().collection('alarms').where('userId', '==', user.uid).onSnapshot(docs => {
          let alarms = []
          docs.forEach(doc => {
            alarms.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_ALARMS', alarms})
        }, err => {
          unsubscribeAlarms()
        })  
        const unsubscribeCancelRequests = firebase.firestore().collection('cancel-requests').where('order.userId', '==', user.uid).onSnapshot(docs => {
          let cancelRequests = []
          docs.forEach(doc => {
            cancelRequests.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_CANCEL_REQUESTS', cancelRequests})
        }, err => {
          unsubscribeCancelRequests()
        })  
        const unsubscribeNotifications = firebase.firestore().collection('notifications').where('toUserId', 'in', ['0', user.uid]).onSnapshot(docs => {
          let notifications = []
          docs.forEach(doc => {
            notifications.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_NOTIFICATIONS', notifications})
        }, err => {
          unsubscribeNotifications()
        })  
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

