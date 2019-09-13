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
  const customerStatus = [
    {id: 'n', name: 'جديد', discount: 0},
    {id: 'a', name: 'فعال', discount: 0},
    {id: 'b', name: 'قائمة سوداء', discount: 0},
    {id: 'v', name: 'مميز', discount: 0},
    {id: 's', name: 'خاص', discount: 500}
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
    orderDetails: 'تفاصيل الطلب',
    addToBasket: 'شراء',
    submit: 'موافق',
    banner: 'شاركنا البحث عن السعر اﻻفضل',
    lessPrice: 'اﻻبلاغ عن سعر أقل',
    storeName: 'اسم المحل',
    storePlace: 'عنوان المحل',
    price: 'السعر',
    login: 'دخول',
    loginTitle: 'تسجيل دخول',
    relogin: 'عليك تسجيل الدخول أوﻻ',
    reloginTitle: 'طلب تسجيل دخول',
    enterMobile: 'الرجاء ادخال رقم الموبايل',
    enterPassword: 'الرجاء ادخال كلمة السر',
    invalidPassword: 'كلمة السر غير صحيحة',
    invalidMobile: 'رقم الموبايل غير صحيح',
    mobilePlaceholder: 'رقم الموبايل مبتدئا ب07',
    passwordPlaceholder: 'كلمة السر من اربعة ارقام',
    newUser: 'مستخدم جديد',
    forgetPassword: 'نسيت كلمة السر',
    enterName: 'الرجاء ادخال اﻻسم',
    namePlaceholder: 'من 4-50 حرف',
    invalidName: 'اﻻسم غير صحيح',
    fixedFees: 500,
    total: 'المجموع',
    feesTitle: 'الرسوم',
    discount: 'الخصم',
    net: 'الصافي',
    delivery: 'خدمة التوصيل',
    deliveryFees: 'رسوم التوصيل',
    noDeliveryNote: 'يتم اﻻستلام من مركز التوزيع بجانب اﻻستقلال مول',
    withDeliveryNote: 'يتم التوصيل خلال جولات محددة حسب المنطقة',
    enterPrice: 'الرجاء ادخال السعر',
    enterStore: 'الرجاء ادخال اسم المحل',
    invalidPrice: 'الرجاء التأكد من السعر المدخل',
    forgetPasswordTitle: 'طلب كلمة سر جديدة',
    send: 'ارسال',
    sendMessage: 'تم ارسال طلبك بنجاح',
    allProducts: 'كل المنتجات'
  }
  const localData = localStorage.getItem('basket');
  const basket = localData ? JSON.parse(localData) : []
  const [user, setUser] = useState(null);
  const initState = {
    sections: [], 
    randomColors, 
    categories: [], 
    countries: [], 
    units, 
    labels, 
    orderStatus, 
    basket, 
    trademarks: [], 
    orderByList, 
    stores: [], 
    rating: [],
    customerStatus,
    customer: {},
    orders: [],
    products: [],
    packs: []
  }
  const [state, dispatch] = useReducer(Reducer, initState)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
      if (user){
        firebase.firestore().collection('orders').where('user', '==', user.uid).onSnapshot(docs => {
          let orders = []
          docs.forEach(doc => {
            orders.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_ORDERS', orders})
        })
        firebase.firestore().collection('rating').where('user', '==', user.uid).get().then(docs => {
          let rating = []
          docs.forEach(doc => {
            rating.push({...doc.data(), id:doc.id})
          })
          dispatch({type: 'SET_RATING', rating})
        })
        firebase.firestore().collection('customers').doc(user.uid).get().then(doc => {
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
    firebase.firestore().collection('products').where('status', '==', 'a').onSnapshot(docs => {
      let products = []
      docs.forEach(doc => {
        products.push({...doc.data(), id: doc.id})
      })
      dispatch({type: 'SET_PRODUCTS', products})
    })
    firebase.firestore().collection('packs').where('status', '==', 'a').onSnapshot(docs => {
      let packs = []
      docs.forEach(doc => {
        const minPrice = Math.min(...doc.data().stores.map(store => !store.offerEnd || new Date() <= store.offerEnd.toDate() ? store.price : store.oldPrice))
        packs.push({...doc.data(), id: doc.id, price: minPrice === Infinity ? 0 : minPrice})
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

