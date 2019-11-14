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
    {id: 'p', name: 'خصم ابلاغ عن سعر اقل', value: 500}
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
    rating: [],
    customer: {},
    orders: [],
    products: [],
    packs: [],
    invitations: [],
    discountTypes
  }
  const [state, dispatch] = useReducer(Reducer, initState)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      if (user){
        const unsubscribeOrders = firebase.firestore().collection('orders').where('user', '==', user.uid).onSnapshot(docs => {
          let orders = []
          docs.forEach(doc => {
            orders.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_ORDERS', orders})
        }, err => {
          unsubscribeOrders()
        })  
        const unsubscribeRating = firebase.firestore().collection('rating').where('user', '==', user.uid).onSnapshot(docs => {
          let rating = []
          docs.forEach(doc => {
            rating.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_RATING', rating})
        }, err => {
          unsubscribeRating()
        })  
        const unsubscribeInvitations = firebase.firestore().collection('invitations').where('user', '==', user.uid).onSnapshot(docs => {
          let invitations = []
          docs.forEach(doc => {
            invitations.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_INVITATIONS', invitations})
        }, err => {
          unsubscribeInvitations()
        })  
        firebase.firestore().collection('customers').doc(user.uid).onSnapshot(doc => {
          if (doc.exists){
            dispatch({type: 'SET_CUSTOMER', customer: doc.data()})
          }
        })  
      }
    });
    firebase.firestore().collection('sections').get().then(docs => {
      let sections = []
      docs.forEach(doc => {
        sections.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_SECTIONS', sections})
    })  
    firebase.firestore().collection('categories').get().then(docs => {
      let categories = []
      docs.forEach(doc => {
        categories.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_CATEGORIES', categories})
    })  
    firebase.firestore().collection('trademarks').get().then(docs => {
      let trademarks = []
      docs.forEach(doc => {
        trademarks.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_TRADEMARKS', trademarks})
    })  
    firebase.firestore().collection('countries').get().then(docs => {
      let countries = []
      docs.forEach(doc => {
        countries.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_COUNTRIES', countries})
    })  
    firebase.firestore().collection('stores').get().then(docs => {
      let stores = []
      docs.forEach(doc => {
        stores.push({...doc.data(), id:doc.id})
      })
      dispatch({type: 'SET_STORES', stores})
    }) 
    firebase.firestore().collection('products').onSnapshot(docs => {
      let products = []
      docs.forEach(doc => {
        products.push({...doc.data(), id: doc.id})
      })
      dispatch({type: 'SET_PRODUCTS', products})
    })
    const today = (new Date()).setHours(0, 0, 0, 0)
    firebase.firestore().collection('packs').onSnapshot(docs => {
      let packs = []
      docs.forEach(doc => {
        let storesPrices = doc.data().stores.map(store => !store.offerEnd || today <= store.offerEnd.toDate() ? store.price : null)
        storesPrices = storesPrices.filter(rec => rec !== null)
        let minPrice = Math.min(...storesPrices)
        minPrice = minPrice === Infinity ? 0 : minPrice
        if (minPrice > 0) {
          const value = doc.data().unitsCount ? minPrice / doc.data().unitsCount : 0
          let isOffer = doc.data().isOffer
          if (isOffer === false) {
            const store = doc.data().stores.find(rec => rec.price === minPrice && rec.offerEnd && today <= rec.offerEnd.toDate())
            if (store) {
              isOffer = true
            }
          }
          packs.push({...doc.data(), id: doc.id, isOffer, value, price: minPrice})
        }
      })
      dispatch({type: 'SET_PACKS', packs})
    })
  }, []);
  return (
    <StoreContext.Provider value={{state, user, dispatch}}>
      {props.children}
    </StoreContext.Provider>
  );
}
 
export default Store;

