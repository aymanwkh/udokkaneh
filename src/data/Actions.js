import firebase from './firebase'
import labels from './labels'

export const getMessage = (props, error) => {
  const errorCode = error.code ? error.code.replace(/-|\//g, '_') : error.message
  if (!labels[errorCode]) {
    firebase.firestore().collection('logs').add({
      userId: firebase.auth().currentUser.uid,
      error,
      page: props.f7route.route.component.name,
      time: new Date()
    })
  }
  return labels[errorCode] ? labels[errorCode] : labels['unknownError']
}

export const showMessage = (props, messageText) => {
  const message = props.f7router.app.toast.create({
    text: `<span class="success">${messageText}<span>`,
    closeTimeout: 3000,
  });
  message.open();
}

export const showError = (props, messageText) => {
  const message = props.f7router.app.toast.create({
    text: `<span class="error">${messageText}<span>`,
    closeTimeout: 3000,
  });
  message.open();
}

export const quantityText = (quantity, weight) => {
  return `${quantity < 1 ? quantity * 1000 + ' ' + labels.gram : quantity} ${weight && weight !== quantity ? '(' + (weight < 1 ? weight * 1000 + ' ' + labels.gram : weight) + ')' : ''}`
}

export const rateProduct = (productId, value, comment) => {
  const rating = {
    productId,
    userId: firebase.auth().currentUser.uid,
    value,
    comment,
    status: 'n',
    time: new Date()
  }
  return firebase.firestore().collection('ratings').add(rating)
}

export const login = (mobile, password) => {
  return firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
}

export const logout = () => {
  return firebase.auth().signOut()
}

export const forgetPassword = mobile => {
  return firebase.firestore().collection('forgetPasswords').add({
    mobile,
    status: 'n',
    time: new Date(),
  })
}

export const confirmOrder = order => {
  const newOrder = {
    ...order,
    userId: firebase.auth().currentUser.uid,
    status: 'n',
    time: new Date()
  }
  return firebase.firestore().collection('orders').add(newOrder)
}

export const cancelOrder = order => {
  return firebase.firestore().collection("orders").doc(order.id).update({
    status: 'c',
    statusTime: new Date()
  })
}

export const cancelOrderRequest = order => {
  return firebase.firestore().collection('cancelOrders').add({
    order,
    status: 'n',
    time: new Date()
  })
}

export const registerUser = async (mobile, password, name, locationId, randomColors) => {
  await firebase.auth().createUserWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(password.charAt(i))].name)
  }
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    name,
    mobile,
    locationId,
    colors,
    time: new Date()
  })
}

export const changePassword = async (oldPassword, newPassword, randomColors) => {
  let user = firebase.auth().currentUser
  const mobile = user.email.substring(0, 10)
  await firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + oldPassword)
  user = firebase.auth().currentUser
  await user.updatePassword(mobile.substring(9, 2) + newPassword)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(newPassword.charAt(i))].name)
  }
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    colors
  })
}

export const registerStoreOwner = async (owner, password, randomColors) => {
  await firebase.auth().createUserWithEmailAndPassword(owner.mobile + '@gmail.com', owner.mobile.substring(9, 2) + password)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(password.charAt(i))].name)
  }
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    ...owner,
    colors,
    time: new Date()
  })
}

export const addPriceAlarm = priceAlarm => {
  const newPriceAlarm = {
    ...priceAlarm,
    userId: firebase.auth().currentUser.uid,
    status: 'n',
    time: new Date()
  }
  return firebase.firestore().collection("priceAlarms").add(newPriceAlarm)
}

export const inviteFriend = (mobile, name) => {
  return firebase.firestore().collection('invitations').add({
    userId: firebase.auth().currentUser.uid,
    friendName: name,
    friendMobile: mobile,
    time: new Date()
  })
}



