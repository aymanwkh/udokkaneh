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
  return labels[errorCode] || labels['unknownError']
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

export const productOfText = (trademark, country) => {
  return trademark ? `${labels.oneOfProducts} (${trademark})-${country}` : `${labels.productOf} ${country}`
}

export const getChildren = (categoryId, categories) => {
  let childrenArray = [categoryId]
  let children = categories.filter(c => c.parentId === categoryId)
  children.forEach(c => {
    const newChildren = getChildren(c.id, categories)
    childrenArray = [...childrenArray, ...newChildren]
  })
  return childrenArray
}

export const hasChild = (category, packs, categories) => {
  return category.isLeaf ? packs.find(p => p.categoryId === category.id) : categories.find(c => c.parentId === category.id && hasChild(c, packs, categories))
}

export const rateProduct = (productId, value) => {
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
    ratings: firebase.firestore.FieldValue.arrayUnion({
      productId,
      value,
      status: 'n'  
    })
  })
}

export const login = (mobile, password) => {
  return firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
}

export const logout = () => {
  return firebase.auth().signOut()
}

export const addPasswordRequest = mobile => {
  localStorage.setItem('password-request', mobile)
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
    time: firebase.firestore.FieldValue.serverTimestamp(),
    activeTime: firebase.firestore.FieldValue.serverTimestamp()
  }
  return firebase.firestore().collection('orders').add(newOrder)
}

export const cancelOrder = order => {
  return firebase.firestore().collection('orders').doc(order.id).update({
    status: 'c',
    lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const addOrderRequest = (order, type, mergedOrder) => {
  const batch = firebase.firestore().batch()
  let orderRef = firebase.firestore().collection('orders').doc(order.id)
  const basket = type === 'm' ? mergedOrder.basket : []
  batch.update(orderRef, {
    requestType: type,
    requestStatus: 'n',
    requestBasket: basket,
    requestTime: firebase.firestore.FieldValue.serverTimestamp()
  })
  if (mergedOrder) {
    orderRef = firebase.firestore().collection('orders').doc(mergedOrder.id)
    batch.update(orderRef, {
      status: 's',
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    })
  }
  return batch.commit()
}

export const registerUser = async (userInfo, password) => {
  await firebase.auth().createUserWithEmailAndPassword(userInfo.mobile + '@gmail.com', userInfo.mobile.substring(9, 2) + password)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(password.charAt(i))].name)
  }
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
    ...userInfo,
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

export const addAlarm = alarm => {
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
    alarms: firebase.firestore.FieldValue.arrayUnion({
      ...alarm,
      id: Math.random().toString(),
      status: 'n',
      time: new Date()  
    })
  })
}

export const inviteFriend = (mobile, name) => {
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
    invitations: firebase.firestore.FieldValue.arrayUnion({
      mobile,
      name,
      status: 'n'
    })
  })
}

export const addDebitRequest = () => {
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
    debitRequestStatus: 'n',
    debitRequestTime: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const readNotification = (user, notificationId) => {
  const notifications = user.notifications.slice()
  const notificationIndex = notifications.findIndex(n => n.id === notificationId)
  notifications.splice(notificationIndex, 1, {
    ...user.notifications[notificationIndex],
    status: 'r'
  })
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
    notifications
  })
}

export const updateFavorites = (user, productId) => {
  const favorites = user.favorites?.slice() || []
  const found = favorites.indexOf(productId)
  if (found === -1) {
    favorites.push(productId) 
  } else {
    favorites.splice(found, 1)
  }
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
    favorites
  })
}

export const editOrder = (order, newBasket, customer, userInfo, locations) => {
  if (order.status === 'n') {
    const basket = newBasket.filter(p => p.quantity > 0)
    const total = basket.reduce((sum, p) => sum + p.gross, 0)
    const fraction = total - Math.floor(total / 50) * 50
    const fixedFees = Math.ceil(setup.fixedFees * total / 50) * 50 - fraction
    const locationFees = locations.find(l => l.id === userInfo.locationId).fees
    const deliveryFees = order.withDelivery ? customer.deliveryFees || locationFees : 0
    const orderStatus = basket.length === 0 ? 'c' : order.status
    return firebase.firestore().collection('orders').doc(order.id).update({
      basket,
      total,
      fixedFees,
      deliveryFees,
      status: orderStatus,
      deliveryDiscount: order.withDelivery ? Math.max(0, locationFees - (customer.deliveryFees || locationFees)) : 0
    })
  } else {
    return firebase.firestore().collection('orders').doc(order.id).update({
      requestType: 'e',
      requestBasket: newBasket,
      requestStatus: 'n',
      requestTime: firebase.firestore.FieldValue.serverTimestamp()
    })
  } 
}

export const deleteNotification = (user, notificationId) => {
  const notifications = user.notifications.slice()
  const notificationIndex = notifications.findIndex(n => n.id === notificationId)
  notifications.splice(notificationIndex, 1)
  return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
    notifications
  })
}

export const takeOrder = order => {
  return firebase.firestore().collection('orders').doc(order.id).update({
    status: 't',
    lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const returnOrderPacks = (order, pack, returned) => {
  const batch = firebase.firestore().batch()
  const orderPack = order.basket.find(p => p.packId === pack.id)
  const otherPacks = order.basket.filter(p => p.packId !== pack.id)
  let status, gross
  if (returned === 0 && orderPack.returned > 0) {
    if (pack.isDivided) {
      status = parseInt(Math.abs(addQuantity(orderPack.quantity, -1 * orderPack.purchased)) / orderPack.quantity * 100) <= setup.weightErrorMargin ? 'f' : 'pu'
    } else {
      status = orderPack.quantity === orderPack.purchased ? 'f' : 'pu'
    }
    gross = parseInt(orderPack.actual * (orderPack.weight || orderPack.purchased))
  } else {
    if (returned === orderPack.purchased) {
      status = 'r'
      gross = 0
    } else {
      status = 'pr'
      gross = parseInt(orderPack.actual * addQuantity(orderPack.weight || orderPack.purchased, -1 * returned))
    }
  }
  const basket = [
    ...otherPacks, 
    {
      ...orderPack, 
      status,
      gross,
      returned: pack.isDivided || !pack.byWeight ? returned : orderPack.purchased,
    }
  ]
  const profit = basket.reduce((sum, p) => sum + (['p', 'f', 'pu', 'pr'].includes(p.status) ? parseInt((p.actual - p.cost) * addQuantity(p.weight || p.purchased, -1 * (p.returned || 0))) : 0), 0)
  const total = basket.reduce((sum, p) => sum + (p.gross || 0), 0)
  const fraction = total - Math.floor(total / 50) * 50
  const fixedFees = Math.ceil(setup.fixedFees * total / 50) * 50 - fraction
  const orderRef = firebase.firestore().collection('orders').doc(order.id)
  batch.update(orderRef, {
    basket,
    total,
    profit,
    fixedFees
  })
  return batch.commit()
}

export const getBasket = (stateBasket, packs) => {
  const basket = stateBasket.map(p => {
    const packInfo = packs.find(pa => pa.id === p.packId) || ''
    let lastPrice
    if (p.offerId) {
      const offerInfo = packs.find(pa => pa.id === p.offerId)
      if (!offerInfo) {
        lastPrice = 0
      } else if (offerInfo.subPackId === p.packId) {
        lastPrice = parseInt(offerInfo.price / offerInfo.subQuantity * offerInfo.subPercent * (1 + setup.profit))
      } else {
        lastPrice = parseInt(offerInfo.price / offerInfo.bonusQuantity * offerInfo.bonusPercent * (1 + setup.profit))
      }
    } else {
      lastPrice = packInfo.price || 0
    }
    const totalPriceText = `${(parseInt(lastPrice * p.quantity) / 1000).toFixed(3)}${p.byWeight ? '*' : ''}`
    const priceText = lastPrice === 0 ? labels.itemNotAvailable : (lastPrice === p.price ? `${labels.price}: ${(p.price / 1000).toFixed(3)}` : `${labels.priceHasChanged}, ${labels.oldPrice}: ${(p.price / 1000).toFixed(3)}, ${labels.newPrice}: ${(lastPrice / 1000).toFixed(3)}`)
    const otherProducts = packs.filter(pa => pa.categoryId === packInfo.categoryId && (pa.sales > packInfo.sales || pa.rating > packInfo.rating))
    const otherOffers = packs.filter(pa => pa.productId === packInfo.productId && pa.id !== packInfo.id && (pa.isOffer || pa.endOffer))
    const otherPacks = packs.filter(pa => pa.productId === packInfo.productId && pa.weightedPrice < packInfo.weightedPrice)
    return {
      ...p,
      price: lastPrice,
      packInfo,
      totalPriceText,
      priceText,
      otherProducts: otherProducts.length,
      otherOffers: otherOffers.length,
      otherPacks: otherPacks.length
    }
  })
  return basket.sort((p1, p2) => p1.time > p2.time ? 1 : -1)
}
