import firebase from './firebase'
import labels from './labels'
import { randomColors } from './config'
import { f7 } from 'framework7-react'
import { setup } from './config'

export const getMessage = (props, error) => {
  const errorCode = error.code ? error.code.replace(/-|\//g, '_') : error.message
  if (!labels[errorCode]) {
    firebase.firestore().collection('logs').add({
      userId: firebase.auth().currentUser.uid,
      error,
      page: props.f7route.route.component.name,
      time: firebase.firestore.FieldValue.serverTimestamp()
    })
  }
  return labels[errorCode] ? labels[errorCode] : labels['unknownError']
}

export const showMessage = messageText => {
  const message = f7.toast.create({
    text: `<span class="success">${messageText}<span>`,
    closeTimeout: 3000,
  })
  message.open()
}

export const showError = messageText => {
  const message = f7.toast.create({
    text: `<span class="error">${messageText}<span>`,
    closeTimeout: 3000,
  })
  message.open()
}

export const quantityText = quantity => {
  return `${quantity < 1 ? quantity * 1000 + ' ' + labels.gram : quantity}`
}

export const addQuantity = (q1, q2, q3 = 0) => {
  if (parseInt(q1) !== q1 || parseInt(q2) !== q2 || parseInt(q3) !== q3) {
    return parseInt((q1 * 1000) + (q2 * 1000) + (q3 * 1000)) / 1000
  } else {
    return q1 + q2 + q3
  }
}

export const quantityDetails = basketPack => {
  let text = `${labels.requested}: ${quantityText(basketPack.quantity)}`
  if (basketPack.purchased > 0) {
    text += `, ${labels.purchased}: ${quantityText(basketPack.purchased)}`
    if (basketPack.weight && basketPack.weight !== basketPack.purchased) {
      text += `, ${labels.weight}: ${quantityText(basketPack.weight)}`
    }
  }
  if (basketPack.returned > 0) {
    text += `, ${labels.returned}: ${quantityText(basketPack.returned)}`
  }
  return text
}

export const rateProduct = (productId, value) => {
  const rating = {
    productId,
    userId: firebase.auth().currentUser.uid,
    value,
    status: 'n',
    time: firebase.firestore.FieldValue.serverTimestamp()
  }
  return firebase.firestore().collection('ratings').add(rating)
}

export const login = (mobile, password) => {
  return firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
}

export const logout = () => {
  return firebase.auth().signOut()
}

export const addPasswordRequest = mobile => {
  return firebase.firestore().collection('password-requests').add({
    mobile,
    status: 'n',
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const confirmOrder = order => {
  const newOrder = {
    ...order,
    userId: firebase.auth().currentUser.uid,
    status: 'n',
    isArchived: false,
    time: firebase.firestore.FieldValue.serverTimestamp()
  }
  return firebase.firestore().collection('orders').add(newOrder)
}

export const cancelOrder = order => {
  return firebase.firestore().collection('orders').doc(order.id).update({
    status: 'c',
    lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const addOrderRequest = (order, type) => {
  return firebase.firestore().collection('order-requests').add({
    order,
    type,
    status: 'n',
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const registerUser = async (mobile, password, name) => {
  await firebase.auth().createUserWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(password.charAt(i))].name)
  }
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    name,
    mobile,
    colors,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const changePassword = async (oldPassword, newPassword) => {
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

export const registerStoreOwner = async (owner, password) => {
  await firebase.auth().createUserWithEmailAndPassword(owner.mobile + '@gmail.com', owner.mobile.substring(9, 2) + password)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(password.charAt(i))].name)
  }
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    ...owner,
    colors,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const addAlarm = alarm => {
  const newAlarm = {
    ...alarm,
    userId: firebase.auth().currentUser.uid,
    status: 'n',
    time: firebase.firestore.FieldValue.serverTimestamp()
  }
  return firebase.firestore().collection('alarms').add(newAlarm)
}

export const inviteFriend = (mobile, name) => {
  return firebase.firestore().collection('invitations').add({
    userId: firebase.auth().currentUser.uid,
    friendName: name,
    friendMobile: mobile,
    status: 'n',
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const readNotification = notification => {
  return firebase.firestore().collection('notifications').doc(notification.id).update({
    status: 'r'
  })
}

export const getStorePacks = async customer => {
  let storePacks = []
  await firebase.firestore().collection('store-packs').where('storeId', '==', customer.storeId).get().then(docs => {
    docs.forEach(doc => {
      storePacks.push({...doc.data(), id:doc.id})
    })
  })
  return storePacks
}

export const addFavorite = favorite => {
  return firebase.firestore().collection('favorites').add(favorite)
}

export const removeFavorite = favorite => {
  return firebase.firestore().collection('favorites').doc(favorite.id).delete()
}

export const editOrder = (order, newBasket, customer, locations) => {
  if (order.status === 'n') {
    const basket = newBasket.filter(p => p.quantity > 0)
    const total = basket.reduce((sum, p) => sum + p.gross, 0)
    const fraction = total - Math.floor(total / 50) * 50
    const fixedFees = Math.ceil((order.urgent ? 1.5 : 1) * setup.fixedFees * total / 50) * 50 - fraction
    const customerLocation = customer.locationId ? locations.find(l => l.id === customer.locationId) : ''
    const deliveryFees = order.withDelivery ? (customerLocation?.deliveryFees || setup.deliveryFees) * (order.urgent ? 1.5 : 1) - (customer.deliveryDiscount || 0) : 0
    const orderStatus = basket.length === 0 ? 'c' : order.status
    return firebase.firestore().collection('orders').doc(order.id).update({
      basket,
      total,
      fixedFees,
      withDelivery: order.withDelivery,
      urgent: order.urgent,
      deliveryFees,
      status: orderStatus,
      deliveryDiscount: order.withDelivery ? customer.deliveryDiscount : 0
    })
  } else {
    return firebase.firestore().collection('order-requests').add({
      order,
      type: 'e',
      basket: newBasket,
      status: 'n',
      time: firebase.firestore.FieldValue.serverTimestamp()
    })
  } 
}

export const deleteNotification = notification => {
  return firebase.firestore().collection('notifications').doc(notification.id).delete()
}
