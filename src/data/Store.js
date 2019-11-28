import React, { createContext, useReducer, useEffect, useState } from 'react';
import Reducer from './Reducer'
import firebase from './firebase'
import labels from './labels'

export const StoreContext = createContext()

const Store = props => {
  const randomColors = [
    {id: 0, name: 'red'},
    {id: 1, name: 'green'},
    {id: 2, name: 'blue'},
    {id: 3, name: 'pink'},
    {id: 4, name: 'yellow'},
    {id: 5, name: 'orange'},
    {id: 6, name: 'purple'},
    {id: 7, name: 'deeppurple'},
    {id: 8, name: 'lightblue'},
    {id: 9, name: 'teal'},
  ]
  const orderByList = [
    {id: 'p', name: 'السعر'},
    {id: 's', name: 'المبيعات'},
    {id: 'r', name: 'التقييم'},
    {id: 'o', name: 'العروض'},
    {id: 'v', name: 'القيمة'},
    {id: 't', name: 'المنتج'}
  ]
  const orderStatus = [
    {id: 'n', name: 'جديد'},
    {id: 'a', name: 'معتمد'},
    {id: 's', name: 'معلق'},
    {id: 'r', name: 'مرفوض'},
    {id: 'e', name: 'قيد التسليم'},
    {id: 'f', name: 'جاهز'},
    {id: 'd', name: 'تم اﻻستلام'},
    {id: 'c', name: 'ملغي'},
    {id: 'i', name: 'استيداع'}
  ]
  const discountTypes = [
    {id: 'f', name: 'خصم اول طلب', value: 500},
    {id: 's', name: 'خصم خاص', value: 500},
    {id: 'i', name: 'خصم دعوة صديق', value: 500},
    {id: 'p', name: 'خصم ابلاغ عن سعر اقل', value: 250},
    {id: 'r', name: 'خصم تقييم منتج', value: 100}
  ]
  const ratingValues = [
    {id: 0, name: 'ﻻ أنصح به'},
    {id: 1, name: 'أنصح به'}
  ]

  const localData = localStorage.getItem('basket');
  const basket = localData ? JSON.parse(localData) : []
  const [user, setUser] = useState(null);
  const initState = {
    sections: [], 
    randomColors, 
    categories: [], 
    countries: [], 
    labels, 
    orderStatus, 
    basket, 
    trademarks: [], 
    orderByList, 
    stores: [], 
    ratings: [],
    customer: {},
    orders: [],
    products: [],
    packs: [],
    invitations: [],
    discountTypes,
    locations: [],
    ratingValues,
    storePacks: []
  }
  const [state, dispatch] = useReducer(Reducer, initState)

  useEffect(() => {
    const unsubscribeSections = firebase.firestore().collection('sections').onSnapshot(docs => {
      let sections = []
      docs.forEach(doc => {
        sections.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_SECTIONS', sections})
    }, err => {
      unsubscribeSections()
    })  
    const unsubscribeCategories = firebase.firestore().collection('categories').onSnapshot(docs => {
      let categories = []
      docs.forEach(doc => {
        categories.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_CATEGORIES', categories})
    }, err => {
      unsubscribeCategories()
    })  
    const unsubscribeTrademarks = firebase.firestore().collection('trademarks').onSnapshot(docs => {
      let trademarks = []
      docs.forEach(doc => {
        trademarks.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_TRADEMARKS', trademarks})
    }, err => {
      unsubscribeTrademarks()
    })  
    const unsubscribeCountries = firebase.firestore().collection('countries').onSnapshot(docs => {
      let countries = []
      docs.forEach(doc => {
        countries.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_COUNTRIES', countries})
    }, err => {
      unsubscribeCountries()
    })  
    const unsubscribeProducts = firebase.firestore().collection('products').onSnapshot(docs => {
      let products = []
      docs.forEach(doc => {
        products.push({...doc.data(), id: doc.id})
      })
      dispatch({type: 'SET_PRODUCTS', products})
    }, err => {
      unsubscribeProducts()
    })
    const unsubscribePacks = firebase.firestore().collection('packs').onSnapshot(docs => {
      let packs = []
      docs.forEach(doc => {
        packs.push({...doc.data(), id: doc.id})
      })
      dispatch({type: 'SET_PACKS', packs})
    }, err => {
      unsubscribePacks()
    })

    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      if (user){
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
        const unsubscribeRating = firebase.firestore().collection('ratings').onSnapshot(docs => {
          let ratings = []
          docs.forEach(doc => {
            ratings.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_RATINGS', ratings})
        }, err => {
          unsubscribeRating()
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
        const unsubscribeStores = firebase.firestore().collection('stores').onSnapshot(docs => {
          let stores = []
          docs.forEach(doc => {
            stores.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_STORES', stores})
        }, err => {
          unsubscribeStores()
        }) 
        const unsubscribeStorePacks = firebase.firestore().collection('storePacks').onSnapshot(docs => {
          let storePacks = []
          docs.forEach(doc => {
            storePacks.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_STORE_PACKS', storePacks})
        }, err => {
          unsubscribeStorePacks()
        })  

      }
    });
  }, []);
  return (
    <StoreContext.Provider value={{state, user, dispatch}}>
      {props.children}
    </StoreContext.Provider>
  );
}
 
export default Store;

