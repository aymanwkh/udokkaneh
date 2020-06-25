import firebase from './firebase'
import labels from './labels'
import { randomColors, setup } from './config'
import { f7 } from 'framework7-react'
import { iError, iUserInfo, iOrder, iBasketPack, iPack } from './interfaces'

export const getMessage = (path: string, error: iError) => {
  const errorCode = error.code ? error.code.replace(/-|\//g, '_') : error.message
  if (!labels[errorCode]) {
    firebase.firestore().collection('logs').add({
      userId: firebase.auth().currentUser?.uid || '',
      error,
      page: path,
      time: firebase.firestore.FieldValue.serverTimestamp()
    })
  }
  return labels[errorCode] || labels['unknownError']
}

export const showMessage = (messageText: string) => {
  const message = f7.toast.create({
    text: `<span class="success">${messageText}<span>`,
    closeTimeout: 3000,
  })
  message.open()
}

export const showError = (messageText: string) => {
  const message = f7.toast.create({
    text: `<span class="error">${messageText}<span>`,
    closeTimeout: 3000,
  })
  message.open()
}

export const quantityText = (quantity: number, weight?: number): string => {
  return weight && weight !== quantity ? `${quantityText(quantity)}(${quantityText(weight)})` : quantity === Math.trunc(quantity) ? quantity.toString() : quantity.toFixed(3)
}

export const login = (mobile: string, password: string) => {
  return firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
}

export const logout = () => {
  firebase.auth().signOut()
}

export const readNotification = (user: iUserInfo | undefined, notificationId: string) => {
  const notifications = user?.notifications?.slice()
  if (notifications) {
    const notificationIndex = notifications.findIndex(n => n.id === notificationId)
    notifications.splice(notificationIndex, 1, {
      ...notifications[notificationIndex],
      status: 'r'
    })
    firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
      notifications
    })  
  }
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
  let user = firebase.auth().currentUser
  if (user) {
    const mobile = user.email?.substring(0, 10)
    if (mobile) {
      await firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + oldPassword)
      user = firebase.auth().currentUser
      if (user) {
        await user.updatePassword(mobile.substring(9, 2) + newPassword)
        let colors = []
        for (var i = 0; i < 4; i++){
          colors.push(randomColors[Number(newPassword.charAt(i))].name)
        }
        return firebase.firestore().collection('users').doc(user.uid).update({
          colors
        })  
      }
    }
  }
}

export const confirmOrder = (order: iOrder) => {
  const newOrder = {
    ...order,
    userId: firebase.auth().currentUser?.uid,
    isArchived: false,
    time: firebase.firestore.FieldValue.serverTimestamp()
  }
  firebase.firestore().collection('orders').add(newOrder)
}

export const getBasket = (stateBasket: iBasketPack[], packs: iPack[]) => {
  const basket = stateBasket.map(p => {
    const packInfo = packs.find(pa => pa.id === p.packId)
    let lastPrice
    if (p.offerId) {
      const offerInfo = packs.find(pa => pa.id === p.offerId)
      if (!offerInfo) {
        lastPrice = 0
      } else if (offerInfo.subPackId === p.packId) {
        lastPrice = Math.round(offerInfo.price / (offerInfo?.subQuantity || 0) * (offerInfo?.subPercent || 0) * (1 + setup.profit))
      } else {
        lastPrice = Math.round(offerInfo.price / (offerInfo.bonusQuantity || 0) * (offerInfo.bonusPercent || 0) * (1 + setup.profit))
      }
    } else {
      lastPrice = packInfo?.price || 0
    }
    const totalPriceText = `${(Math.round(lastPrice * p.quantity) / 100).toFixed(2)}${p.byWeight ? '*' : ''}`
    const priceText = lastPrice === 0 ? labels.itemNotAvailable : (lastPrice === p.price ? `${labels.price}: ${(p.price / 100).toFixed(2)}` : `${labels.priceHasChanged}, ${labels.oldPrice}: ${(p.price / 100).toFixed(2)}, ${labels.newPrice}: ${(lastPrice / 100).toFixed(2)}`)
    const otherProducts = packs.filter(pa => pa.categoryId === packInfo?.categoryId && (pa.sales > packInfo?.sales || pa.rating > packInfo.rating))
    const otherOffers = packs.filter(pa => pa.productId === packInfo?.productId && pa.id !== packInfo.id && (pa.isOffer || pa.offerEnd))
    const otherPacks = packs.filter(pa => pa.productId === packInfo?.productId && pa.weightedPrice < packInfo.weightedPrice)
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
  return basket
}