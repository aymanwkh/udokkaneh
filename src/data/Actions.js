import firebase from './firebase'

export const showMessage = (props, type, messageText) => {
  const message = props.f7router.app.toast.create({
    text: `<span class=${type}>${messageText}<span>`,
    closeTimeout: 3000,
  });
  message.open();
}

export const rateProduct = async (product, rating) => {
  const ratingRec = {
    productId: product.id,
    user: firebase.auth().currentUser.uid,
    rating: rating,
    time: new Date()
  }
  const docRef = await firebase.firestore().collection('rating').add(ratingRec)
  return docRef.id
}

export const login = (mobile, password) => {
  return firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(8, 2) + password)
}

export const logout = () => {
  return firebase.auth().signOut()
}

export const forgetPassword = mobile => {
  return firebase.firestore().collection('forgetPassword').add({
    mobile,
    time: new Date(),
    resolved: false
  })
}

export const confirmOrder = order => {
  const newOrder = {
    ...order,
    user: firebase.auth().currentUser.uid,
    status: 'n',
    time: new Date()
  }
  return firebase.firestore().collection('orders').add(newOrder)
}

export const editOrder = order => {
  return firebase.firestore().collection("orders").doc(order.id).update({
    status: 'c'
  })
}

export const registerUser = async (mobile, password, name) => {
  await firebase.auth().createUserWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(8, 2) + password)
  await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    name,
    mobile,
    isActive: false,
    time: new Date()
  })
}

export const registerStoreOwner = async (mobile, password, name, storeName, address) => {
  await firebase.auth().createUserWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(8, 2) + password)
  await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    name,
    mobile,
    storeName,
    address,
    isActive: false,
    time: new Date()
  })
}

export const addPriceAlarm = priceAlarm => {
  const newPriceAlarm = {
    ...priceAlarm,
    user: firebase.auth().currentUser.uid,
    status: 'n',
    time: new Date()
  }
  return firebase.firestore().collection("priceAlarms").add(newPriceAlarm)
}

export const inviteFriend = (mobile, name) => {
  return firebase.firestore().collection('invitations').add({
    user: firebase.auth().currentUser.uid,
    friendName: name,
    friendMobile: mobile,
    time: new Date()
  })
}



