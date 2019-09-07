import firebase from './firebase'

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
export const login = async (mobile, password) => {
  await firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(8, 2) + password)
}

export const forgetPassword = async mobile => {
  await firebase.firestore().collection('forgetPassword').add({
    mobile,
    time: new Date(),
    resolved: false
  })
}

export const confirmOrder = async order => {
  const newOrder = {
    ...order,
    user: firebase.auth().currentUser.uid,
    status: 'n',
    time: new Date()
  }
  await firebase.firestore().collection('orders').add(newOrder)
}

export const editOrder = async order => {
  await firebase.firestore().collection("orders").doc(order.id).update({
    status: 'c'
  })
}

export const registerUser = async (mobile, password, name) => {
  await firebase.auth().createUserWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(8, 2) + password)
  await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    name,
    mobile,
    time: new Date()
  })
}

export const addLessPrice = async lessPrice => {
  const newlessPrice = {
    ...lessPrice,
    user: firebase.auth().currentUser.uid,
    status: 'n',
    time: new Date()
  }
  await firebase.firestore().collection("lessPrice").add(newlessPrice)
}


