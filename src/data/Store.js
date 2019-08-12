import React, { createContext, useReducer, useEffect, useState } from 'react';
import Reducer from './Reducer'
import firebase from './firebase'

export const StoreContext = createContext()

const Store = props => {
  const randomColors = [
    {id: '0', name: 'red'},
    {id: '1', name: 'green'},
    {id: '2', name: 'blue'},
    {id: '3', name: 'pink'},
    {id: '4', name: 'yellow'},
    {id: '5', name: 'orange'},
    {id: '6', name: 'purple'},
    {id: '7', name: 'deeppurple'},
    {id: '8', name: 'lightblue'},
    {id: '9', name: 'teal'},
    {id: '10', name: 'lime'},
    {id: '11', name: 'deeporange'},
    {id: '12', name: 'gray'}
  ]
  const locations = [
    {id: '1', name: 'جبل النزهة'},
    {id: '2', name: 'ضاحية اﻻمير حسن'},
    {id: '3', name: 'عرجان'},
    {id: '4', name: 'جبل الحسين'},
    {id: '5', name: 'مخيم جبل الحسين'}
  ]
  const orderByList = [
    {id: 'p', name: 'السعر'},
    {id: 's', name: 'المبيعات'},
    {id: 'r', name: 'التقييم'}
  ]
  const units = [
    {id: 'p', name: 'حبة'},
    {id: 'g', name: 'غرام'},
    {id: 'kg', name: 'كيلو غرام'},
    {id: 'ml', name: 'مل لتر'},
    {id: 'l', name: 'لتر'}
  ]
  const orderStatus = [
    {id: 'n', name: 'جديد'},
    {id: 'a', name: 'معتمد'},
    {id: 's', name: 'معلق'},
    {id: 'r', name: 'مرفوض'},
    {id: 'e', name: 'قيد التسليم'},
    {id: 'f', name: 'جاهز'},
    {id: 'd', name: 'تم اﻻستلام'},
    {id: 'l', name: 'متأخر'},
    {id: 'c', name: 'ملغي'},
    {id: 'i', name: 'في المستودع'}
  ]  
  const labels = {
    appTitle: 'حريص',
    news: 'آخر الاخبار',
    offers: 'العروض',
    popular: 'اﻻكثر مبيعا',
    registerTitle: 'التسجيل ﻷول مرة',
    name: 'اﻻسم',
    mobile: 'الموبايل',
    password: 'كلمة السر',
    location: 'الموقع',
    register: 'تسجيل',
    error: 'خطأ',
    not_found: 'ﻻ يوجد بيانات',
    search: 'بحث',
    password_placeholder: '4 ارقام',
    name_placeholder: 'من 4-50 حرف',
    mobile_placeholder: 'يجب ان يبدأ ب07',
    open_order_found: 'هناك طلبية سابقة لم يتم استلامها',
    auth_user_not_found: 'الرجاء التأكد من رقم الموبايل وكلمة المرور',
    auth_email_already_in_use: 'لقد سجلت سابقا برقم هذا الموبايل',
    auth_wrong_password: 'كلمة السر غير صحيحة',
    productOf: 'انتاج',
    orderBy: 'الترتيب حسب',
    new: 'جديد',
    offer: 'عرض',
    confirmOrder: 'اعتماد الطلب',
    basket: 'سلة المشتريات',
    confirm: 'اعتماد',
    orderDetails: 'تفاصيل الطلب'
  }
  const localData = localStorage.getItem('basket');
  const basket = localData ? JSON.parse(localData) : []
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  let sections = []
  let categories = []
  let trademarks = []
  let countries = []
  let stores = []
  let rating = []
  const initState = {
    sections, 
    randomColors, 
    categories, 
    locations, 
    countries, 
    units, 
    labels, 
    orderStatus, 
    basket, 
    trademarks, 
    orderByList, 
    stores, 
    rating
  }
  const [state, dispatch] = useReducer(Reducer, initState)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      if (user){
        firebase.firestore().collection('orders').where('user', '==', user.uid).onSnapshot(docs => {
          let ordersArray = []
          docs.forEach(doc => {
            ordersArray.push({...doc.data(), id:doc.id})
          })
          setOrders(ordersArray)
        })
        firebase.firestore().collection('rating').where('user', '==', user.uid).get().then(docs => {
          docs.forEach(doc => {
            rating.push({...doc.data(), id:doc.id})
          })
        })  
      }
    });
    firebase.firestore().collection('sections').get().then(docs => {
      docs.forEach(doc => {
        sections.push({...doc.data(), id:doc.id})
      })
    })  
    firebase.firestore().collection('categories').get().then(docs => {
      docs.forEach(doc => {
        categories.push({...doc.data(), id:doc.id})
      })
    })  
    firebase.firestore().collection('trademarks').get().then(docs => {
      docs.forEach(doc => {
        trademarks.push({...doc.data(), id:doc.id})
      })
    })  
    firebase.firestore().collection('countries').get().then(docs => {
      docs.forEach(doc => {
        countries.push({...doc.data(), id:doc.id})
      })
    })  
    firebase.firestore().collection('stores').get().then(docs => {
      docs.forEach(doc => {
        stores.push({...doc.data(), id:doc.id})
      })
    }) 
    firebase.firestore().collection('products').where('status', '==', 'a').onSnapshot(docs => {
      let productsArray = []
      docs.forEach(doc => {
        const minPrice = Math.min(...doc.data().stores.map(store => !store.offerEnd || new Date() <= store.offerEnd.toDate() ? store.price : store.oldPrice))
        productsArray.push({...doc.data(), id: doc.id, price: parseFloat(minPrice).toFixed(3)})
      })
      setProducts(productsArray)
    })
  }, []);
  return (
    <StoreContext.Provider value={{state, user, orders, products, dispatch}}>
      {props.children}
    </StoreContext.Provider>
  );
}
 
export default Store;

