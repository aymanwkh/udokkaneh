import firebase from './firebase'
import labels from './labels'
import {randomColors} from './config'
import {Error, Category, Alarm, Pack, ProductRequest, PackPrice, Product, Notification, UserInfo} from './types'
import {f7} from 'framework7-react'

export const getMessage = (path: string, error: Error) => {
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

export const addQuantity = (q1: number, q2: number, q3 = 0) => {
  return Math.trunc(q1 * 1000 + q2 * 1000 + q3 * 1000) / 1000
}

export const productOfText = (countryName: string, trademarkName?: string) => {
  return trademarkName ? `${labels.productFrom} ${trademarkName}-${countryName}` : `${labels.productOf} ${countryName}`
}

export const getChildren = (categoryId: string, categories: Category[]) => {
  let childrenArray = [categoryId]
  let children = categories.filter(c => c.parentId === categoryId)
  children.forEach(c => {
    const newChildren = getChildren(c.id, categories)
    childrenArray = [...childrenArray, ...newChildren]
  })
  return childrenArray
}

export const rateProduct = (product: Product, value: number, packs: Pack[]) => {
  const batch = firebase.firestore().batch()
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  batch.update(userRef, {
    ratings: firebase.firestore.FieldValue.arrayUnion({
      productId: product.id,
      value
    })
  })
  const oldRating = product.rating ?? 0
  const ratingCount = product.ratingCount ?? 0
  const newRating = Math.round((oldRating * ratingCount + value) / (ratingCount + 1))
  const productRef = firebase.firestore().collection('products').doc(product.id)
  batch.update(productRef, {
    rating: newRating,
    ratingCount: ratingCount + 1
  })
  const affectedPacks = packs.filter(p => p.product.id === product.id)
  affectedPacks.forEach(p => {
    const packRef = firebase.firestore().collection('packs').doc(p.id)
    batch.update(packRef, {
      product: {
        ...product,
        rating: newRating,
        ratingCount: ratingCount + 1
      }
    })
  })
  batch.commit()
}

export const login = (mobile: string, password: string) => {
  return firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(9, 2) + password)
}

export const logout = () => {
  firebase.auth().signOut()
}

export const addPasswordRequest = (mobile: string) => {
  firebase.firestore().collection('password-requests').add({
    mobile,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const registerUser = async (user: UserInfo) => {
  await firebase.auth().createUserWithEmailAndPassword(user.mobile + '@gmail.com', user.mobile.substring(9, 2) + user.password)
  let colors = []
  for (var i = 0; i < 4; i++){
    colors.push(randomColors[Number(user.password!.charAt(i))].name)
  }
  const {password, ...others} = user
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).set({
    ...others,
    colors,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
  return firebase.auth().currentUser?.updateProfile({
    displayName: 'o'
  })

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
        return firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
          colors
        }) 
      }
    }
  }
}

export const addAlarm = (alarm: Alarm) => {
  const batch = firebase.firestore().batch()
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  batch.update(userRef, {
    alarms: firebase.firestore.FieldValue.arrayUnion(alarm)
  })
  const storeRef = firebase.firestore().collection('stores').doc(alarm.storeId)
  const {storeId, ...others} = alarm
  batch.update(storeRef, {
    alarms: firebase.firestore.FieldValue.arrayUnion(others)
  })
  batch.commit()
}

export const updateFavorites = (favorites: string[], productId: string) => {
  const found = favorites.indexOf(productId)
  if (found === -1) {
    favorites.push(productId) 
  } else {
    favorites.splice(found, 1)
  }
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
    favorites
  })
}

export const deleteNotification = (notifications: Notification[], notificationId: string) => {
    const newNotifications = notifications.filter(n => n.id !== notificationId)
    firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
      notifications: newNotifications
    })  
}

export const addProductRequest = async (productRequest: ProductRequest, image?: File) => {
  const productRequestRef = firebase.firestore().collection('product-requests').doc()
  let imageUrl = ''
  if (image) {
    const filename = image.name
    const ext = filename.slice(filename.lastIndexOf('.'))
    const fileData = await firebase.storage().ref().child('product-requests/' + productRequestRef.id + ext).put(image)
    imageUrl = await firebase.storage().ref().child(fileData.metadata.fullPath).getDownloadURL()
  }
  productRequest['imageUrl'] = imageUrl
  productRequestRef.set({
    ...productRequest,
    userId: firebase.auth().currentUser?.uid,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const changePrice = (storePack: PackPrice, packPrices: PackPrice[], batch?: firebase.firestore.WriteBatch) => {
  const newBatch = batch || firebase.firestore().batch()
  const packStores = packPrices.filter(p => p.packId === storePack.packId)
  const otherStores = packStores.filter(p => p.storeId !== storePack.storeId)
  otherStores.push(storePack)
  const prices = otherStores.map(p => {
    const {packId, ...others} = p
    return others
  })
  let packRef = firebase.firestore().collection('packs').doc(storePack.packId)
  newBatch.update(packRef, {
    prices
  })
  if (!batch) {
    newBatch.commit()
  }
}

type newPack = {
  name: string,
  product: Product,
  prices: {storeId: string, price: number, time: Date}[],
  typeUnits: number,
  standardUnits: number,
  unitId: string,
  byWeight: boolean,
  isArchived: boolean,
  specialImage: boolean,
  imageUrl: string
}
export const addPack = (pack: newPack) => {
  const packRef = firebase.firestore().collection('packs').doc()
  packRef.set(pack)
}

export const deleteStorePack = (storePack: PackPrice, packPrices: PackPrice[], packs: Pack[], withRequest: boolean) => {
  const batch = firebase.firestore().batch()
  const pack = packs.find(p => p.id === storePack.packId)!
  const packStores = packPrices.filter(p => p.packId === storePack.packId)
  const otherStores = packStores.filter(p => p.storeId !== storePack.storeId)
  const prices = otherStores.map(p => {
    const {packId, ...others} = p
    return others
  })
  const packRef = firebase.firestore().collection('packs').doc(pack.id)
  batch.update(packRef, {
    prices
  })
  if (withRequest) {
    const requestRef = firebase.firestore().collection('pack-requests').doc()
    batch.set(requestRef, {
      storeId: storePack.storeId,
      packId: storePack.packId,
      time: firebase.firestore.FieldValue.serverTimestamp()
    })
  }
  batch.commit()
}

export const addPackPrice = (storePack: PackPrice, packs: Pack[]) => {
  const {packId, ...others} = storePack
  const pack = packs.find(p => p.id === packId)!
  const packRef = firebase.firestore().collection('packs').doc(pack.id)
  packRef.update({
    prices: firebase.firestore.FieldValue.arrayUnion(others)
  })
}

export const addPackRequest = (storeId: string, packId: string) => {
  const requestRef = firebase.firestore().collection('pack-requests').doc()
  requestRef.set({
    storeId,
    packId,
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export const deletePackRequest = (storeId: string, packId: string) => {
  const requestRef = firebase.firestore().collection('pack-requests').doc()
  requestRef.delete()
}

export const sendNotification = (userId: string, title: string, message: string, batch?: firebase.firestore.WriteBatch) => {
  const newBatch =  batch || firebase.firestore().batch()
  const userRef = firebase.firestore().collection('users').doc(userId)
  newBatch.update(userRef, {
    notifications: firebase.firestore.FieldValue.arrayUnion({
      id: Math.random().toString(),
      title,
      message,
      status: 'n',
      time: new Date()
    })
  })
  if (!batch) {
    newBatch.commit()
  }
}
export const updateLastSeen = () => {
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
  })
}