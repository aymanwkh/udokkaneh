import firebase from './firebase'
import labels from './labels'
import {randomColors, userTypes} from './config'
import {Error, Category, Pack, ProductRequest, PackStore, Product, Notification, UserInfo, StoreRequest, PackRequest, Position, Store, Region} from './types'

export const getMessage = (path: string, error: Error) => {
  const errorCode = error.code ? error.code.replace(/-|\//g, '_') : error.message
  if (!labels[errorCode]) {
    firebase.firestore().collection('logs').add({
      userId: firebase.auth().currentUser?.uid || '',
      error: errorCode,
      page: path,
      time: firebase.firestore.FieldValue.serverTimestamp()
    })
  }
  return labels[errorCode] || labels['unknownError']
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

export const getStoreName = (store: Store, regions: Region[]) => {
  return `${store.name} ${store.regionId ? '-' + regions.find(r => r.id === store.regionId)!.name : ''} (${userTypes.find(t => t.id === store.type)!.name})`
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
  console.log('position === ', others.position)
  firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).set({
    ...others,
    colors,
    time: firebase.firestore.FieldValue.serverTimestamp()
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

export const addClaim = (storeId: string, packId: string, packStores: PackStore[]) => {
  const batch = firebase.firestore().batch()
  const packStore = packStores.find(p => p.packId === packId && p.storeId === storeId)!
  if (packStore.claimUserId) {
    packStore.isActive = false
    const storeRef = firebase.firestore().collection('stores').doc(storeId)
    storeRef.update({
      claimsCount: firebase.firestore.FieldValue.increment(1)
    })
  } else {
    packStore.claimUserId = firebase.auth().currentUser?.uid
  }
  const otherStores = packStores.filter(p => p.packId === packId && p.storeId !== storeId)
  otherStores.push(packStore)
  const stores = otherStores.map(p => {
    const {packId, ...others} = p
    return others
  })
  const packRef = firebase.firestore().collection('packs').doc(packStore.packId)
  batch.update(packRef, {
    stores
  })
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  batch.update(userRef, {
    claims: firebase.firestore.FieldValue.arrayUnion({
      storeId,
      packId,
      time: new Date()
    })
  })
  batch.commit()

}

export const deleteNotification = (notifications: Notification[], notificationId: string) => {
    const newNotifications = notifications.filter(n => n.id !== notificationId)
    firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid).update({
      notifications: newNotifications
    })  
}

export const addProductRequest = async (productRequest: ProductRequest, image?: File) => {
  const storeRef = firebase.firestore().collection('stores').doc(productRequest.storeId)
  const {storeId, ...others} = productRequest
  let imageUrl = ''
  if (image) {
    const filename = image.name
    const ext = filename.slice(filename.lastIndexOf('.'))
    const fileData = await firebase.storage().ref().child('requests/' + productRequest.id + ext).put(image)
    imageUrl = await firebase.storage().ref().child(fileData.metadata.fullPath).getDownloadURL()
  }
  others['imageUrl'] = imageUrl
  storeRef.update({
    productRequests: firebase.firestore.FieldValue.arrayUnion(others)
  })
}

export const changePrice = (packStore: PackStore, packStores: PackStore[]) => {
  const batch = firebase.firestore().batch()
  const otherStores = packStores.filter(p => p.packId === packStore.packId && p.storeId !== packStore.storeId)
  otherStores.push(packStore)
  const stores = otherStores.map(p => {
    const {packId, ...others} = p
    return others
  })
  console.log('stores == ', stores)
  let packRef = firebase.firestore().collection('packs').doc(packStore.packId)
  batch.update(packRef, {
    stores,
    lastTrans: firebase.firestore.FieldValue.serverTimestamp()
  })
  batch.commit()
}

export const addPackRequest = async (packRequest: PackRequest, image?: File) => {
  const storeRef = firebase.firestore().collection('stores').doc(packRequest.storeId)
  const {storeId, ...others} = packRequest
  if (image) {
    const filename = image.name
    const ext = filename.slice(filename.lastIndexOf('.'))
    const fileData = await firebase.storage().ref().child('requests/' + packRequest.id + ext).put(image)
    others.imageUrl = await firebase.storage().ref().child(fileData.metadata.fullPath).getDownloadURL()
  }
  storeRef.update({
    packRequests: firebase.firestore.FieldValue.arrayUnion(others),
  })
}

export const deleteStorePack = (packStore: PackStore, packStores: PackStore[], packs: Pack[], withRequest: boolean) => {
  const batch = firebase.firestore().batch()
  const pack = packs.find(p => p.id === packStore.packId)!
  const otherStores = packStores.filter(p => p.packId === packStore.packId && p.storeId !== packStore.storeId)
  const stores = otherStores.map(p => {
    const {packId, ...others} = p
    return others
  })
  const packRef = firebase.firestore().collection('packs').doc(pack.id)
  batch.update(packRef, {
    stores,
    lastTrans: firebase.firestore.FieldValue.serverTimestamp()
  })
  if (withRequest) {
    const storeRef = firebase.firestore().collection('stores').doc(packStore.storeId)
    batch.update(storeRef, {
      requests: firebase.firestore.FieldValue.arrayUnion({
        packId: packStore.packId,
        time: new Date()
      })
    })
  }
  batch.commit()
}

export const addPackStore = (packStore: PackStore, storeRequests: StoreRequest[]) => {
  const batch = firebase.firestore().batch()
  const {packId, ...others} = packStore
  const packRef = firebase.firestore().collection('packs').doc(packId)
  batch.update(packRef, {
    stores: firebase.firestore.FieldValue.arrayUnion(others),
    lastTrans: firebase.firestore.FieldValue.serverTimestamp()
  })
  const storeRequest = storeRequests.find(r => r.storeId === packStore.storeId && r.packId === packId)
  if (storeRequest) {
    const otherStoreRequests = storeRequests.filter(p => p.packId !== packId && p.storeId === packStore.storeId)
    const requests = otherStoreRequests.map(p => {
      const {storeId, ...others} = p
      return others
    })  
    const storeRef = firebase.firestore().collection('stores').doc(packStore.storeId)
    batch.update(storeRef, {
      requests
    })
  }
  batch.commit()
}

export const addStoreRequest = (storeRequest: StoreRequest) => {
  const batch =  firebase.firestore().batch()
  const storeRef = firebase.firestore().collection('stores').doc(storeRequest.storeId)
  batch.update(storeRef, {
    requests: firebase.firestore.FieldValue.arrayUnion({
      packId: storeRequest.packId,
      time: storeRequest.time
    })
  })
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  batch.update(userRef, {
      basket: firebase.firestore.FieldValue.arrayUnion(storeRequest.packId)
  })
  batch.commit()
}

export const deleteStoreRequest = (storeRequest: StoreRequest, storeRequests: StoreRequest[]) => {
  const batch =  firebase.firestore().batch()
  const otherStoreRequests = storeRequests.filter(p => p.packId !== storeRequest.packId && p.storeId === storeRequest.storeId)
  const requests = otherStoreRequests.map(p => {
    const {storeId, ...others} = p
    return others
  })
  const storeRef = firebase.firestore().collection('stores').doc(storeRequest.storeId)
  batch.update(storeRef, {
    requests
  })
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  batch.update(userRef, {
    basket: firebase.firestore.FieldValue.arrayRemove(storeRequest.packId)
  })
  batch.commit()
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

export const deleteProductRequest = async (productRequest: ProductRequest, productRequests: ProductRequest[]) => {
  const storeRef = firebase.firestore().collection('stores').doc(productRequest.storeId)
  const otherRequests = productRequests.filter(r => r.storeId === productRequest.storeId && r.id !== productRequest.id)
  storeRef.update({
    productRequests: otherRequests
  })
  const ext = productRequest.imageUrl.slice(productRequest.imageUrl.lastIndexOf('.'), productRequest.imageUrl.indexOf('?'))
  const image = firebase.storage().ref().child('requests/' + productRequest.id + ext)
  await image.delete()
}

export const calcDistance = (position1: Position, position2: Position) => {
  const R = 6371; // Radius of the earth in km
  const latDiff = (position1.lat - position2.lat) * Math.PI / 180
  const lngDiff = (position1.lng - position2.lng) * Math.PI / 180
  const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(position1.lat * Math.PI / 180) * Math.cos(position2.lat * Math.PI / 180) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d
}

export const getCategoryName = (category: Category, categories: Category[]): string => {
  if (category.parentId === '0') {
    return category.name
  } else {
    const mainCategory = categories.find(c => c.id === category.mainId)
    return mainCategory?.name + '-' + category.name
  }
}

export const addToBasket = (packId: string) => {
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  userRef.update({
    basket: firebase.firestore.FieldValue.arrayUnion(packId)
  })
}

export const removeFromBasket = (packId: string) => {
  const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser?.uid)
  userRef.update({
    basket: firebase.firestore.FieldValue.arrayRemove(packId)
  })
}