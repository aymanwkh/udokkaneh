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

export const login = async (mobile, password) => {
  await firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(8, 2) + password)
}

export const logout = async () => {
  await firebase.auth().signOut()
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

export const addLessPrice = async lessPrice => {
  const newlessPrice = {
    ...lessPrice,
    user: firebase.auth().currentUser.uid,
    status: 'n',
    time: new Date()
  }
  await firebase.firestore().collection("lessPrice").add(newlessPrice)
}

export const inviteFriend = async (mobile, name) => {
  await firebase.firestore().collection('invitations').add({
    user: firebase.auth().currentUser.uid,
    friendName: name,
    firnedMobile: mobile,
    time: new Date()
  })
}



