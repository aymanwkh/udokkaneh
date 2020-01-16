import React, { useState, useContext, useEffect, useMemo } from 'react'
import { f7, Page, Navbar, List, ListInput, Fab, Icon, Toggle, ListItem } from 'framework7-react'
import { StoreContext } from '../data/store'
import { addAlarm, showMessage, showError, getMessage } from '../data/actions'
import ReLogin from './relogin'
import labels from '../data/labels'
import { alarmTypes } from '../data/config'

const AddAlarm = props => {
  const { state, user } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const pack = useMemo(() => state.packs.find(p => p.id === props.packId)
  , [state.packs, props.packId])
  const alarmType = useMemo(() => alarmTypes.find(t => t.id === props.alarmType)
  , [props.alarmType])
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [priceErrorMessage, setPriceErrorMessage] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [newProduct, setNewProduct] = useState('')
  const [newProductErrorMessage, setNewProductErrorMessage] = useState('')
  const [newPack, setNewPack] = useState('')
  const [newPackErrorMessage, setNewPackErrorMessage] = useState('')
  const [offerDays, setOfferDays] = useState('')
  const [isOffer, setIsOffer] = useState(false)
  const [locationId, setLocationId] = useState('')
  const locations = useMemo(() => [...state.locations].sort((l1, l2) => l1.ordering - l2.ordering)
  , [state.locations])
  const currentPrice = useMemo(() => {
    if (props.alarmType === '2') {
      return state.storePacks.find(p => p.storeId === state.customer.storeId && p.packId === pack.id).price
    } else {
      return pack.price
    }
  }, [state.storePacks, state.customer, pack, props.alarmType])
  useEffect(() => {
    const validatePrice = (value) => {
      if (props.alarmType === '1') {
        if (Number(value) > 0 && Number(value * 1000) < pack.price) {
          setPriceErrorMessage('')
        } else {
          setPriceErrorMessage(labels.invalidPrice)
        }  
      } else {
        if (Number(value) > 0 && Number(value * 1000) !== currentPrice) {
          setPriceErrorMessage('')
        } else {
          setPriceErrorMessage(labels.invalidPrice)
        }  
      }
    }
    if (price) validatePrice(price)
  }, [price, pack, props.alarmType, currentPrice])
  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateStoreName = value => {
      if (patterns.name.test(value)){
        setStoreNameErrorMessage('')
      } else {
        setStoreNameErrorMessage(labels.invalidName)
      }
    }  
    const validateNewProduct = value => {
      if (patterns.name.test(value)){
        setNewProductErrorMessage('')
      } else {
        setNewProductErrorMessage(labels.invalidName)
      }
    }  
    const validateNewPack = value => {
      if (patterns.name.test(value)){
        setNewPackErrorMessage('')
      } else {
        setNewPackErrorMessage(labels.invalidName)
      }
    }  
    if (storeName) validateStoreName(storeName)
    if (newProduct) validateNewProduct(newProduct)
    if (newPack) validateNewPack(newPack)
  }, [storeName, newProduct, newPack])

  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  useEffect(() => {
    if (inprocess) {
      f7.dialog.preloader(labels.inprocess)
    } else {
      f7.dialog.close()
    }
  }, [inprocess])

  const buttonVisible = useMemo(() => {
    if (!price) return false
    if (isOffer && !offerDays) return false
    if (props.alarmType === '5' && !newProduct) return false
    if (props.alarmType === '6' && !newPack) return false
    if (props.alarmType === '8' && !quantity) return false
    if (!state.customer.storeId && (!storeName || !locationId)) return false
    if (priceErrorMessage) return false
    if (storeNameErrorMessage) return false
    if (newProductErrorMessage) return false
    if (newPackErrorMessage) return false
    return true
  }, [props.alarmType, price, isOffer, offerDays, newProduct, newPack, quantity, state.customer, storeName, locationId, priceErrorMessage, storeNameErrorMessage, newProductErrorMessage, newPackErrorMessage])
  const formatPrice = value => {
    return Number(value).toFixed(3)
  } 
  const handleSubmit = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      if (offerDays && Number(offerDays) <= 0) {
        throw new Error('invalidPeriod')
      }
      if (props.alarmType === '8' && Number(quantity) < 2){
        throw new Error('invalidQuantity')
      }
      const alarm = {
        packId: pack.id,
        alarmType: props.alarmType,
        price: price * 1000,
        quantity: Number(quantity),
        storeName,
        newProduct,
        newPack,
        locationId,
        offerDays: Number(offerDays)
      }
      setInprocess(true)
      await addAlarm(alarm)
      setInprocess(false)
      showMessage(labels.sendSuccess)
      props.f7router.back()
    } catch (err) {
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }

  if (!user) return <ReLogin />
  return (
    <Page>
      <Navbar title={alarmType.name} backLink={labels.back} />
      <List form>
        {props.alarmType === '5' ? '' :
          <ListInput 
            name="productName" 
            label={labels.productName}
            value={pack.productName}
            type="text" 
            readonly
          />
        }
        {props.alarmType === '5' || props.alarmType === '6' ? '' :
          <ListInput 
            name="packName" 
            label={labels.packName}
            value={pack.name}
            type="text" 
            readonly
          />
        }
        {props.alarmType === '5' || props.alarmType === '6' ? '' :
          <ListInput 
            name="currentPrice" 
            label={labels.currentPrice}
            value={(currentPrice / 1000).toFixed(3)}
            type="number" 
            readonly
          />
        }
        {props.alarmType === '5' ?
          <ListInput 
            name="newProduct" 
            label={labels.newProduct}
            placeholder={labels.namePlaceholder}
            clearButton 
            type="text" 
            value={newProduct} 
            errorMessage={newProductErrorMessage}
            errorMessageForce  
            onChange={e => setNewProduct(e.target.value)}
            onInputClear={() => setNewProduct('')}
          />
        : ''}
        {props.alarmType === '6' ?
          <ListInput 
            name="newPack" 
            label={labels.newPack}
            placeholder={labels.namePlaceholder}
            clearButton 
            type="text" 
            value={newPack} 
            errorMessage={newPackErrorMessage}
            errorMessageForce  
            onChange={e => setNewPack(e.target.value)}
            onInputClear={() => setNewPack('')}
          />
        : ''}
        <ListInput 
          name="price" 
          label={labels.price}
          placeholder={props.alarmType === '1' ? labels.lessPricePlaceholder : labels.pricePlaceholder}
          clearButton 
          type="number" 
          value={price} 
          errorMessage={priceErrorMessage}
          errorMessageForce  
          onChange={e => setPrice(e.target.value)}
          onInputClear={() => setPrice('')}
          onBlur={e => setPrice(formatPrice(e.target.value))}
        />
        {props.alarmType === '8' ? 
          <ListInput 
            name="quantity" 
            label={labels.quantity}
            placeholder={labels.quantityPlaceholder}
            clearButton 
            type="number" 
            value={quantity} 
            onChange={e => setQuantity(e.target.value)}
            onInputClear={() => setQuantity('')}
          />
        : ''}
        {state.customer.storeId ? '' :
          <ListInput 
            name="storeName" 
            label={labels.storeName}
            placeholder={labels.namePlaceholder}
            clearButton 
            type="text" 
            value={storeName} 
            errorMessage={storeNameErrorMessage}
            errorMessageForce  
            onChange={e => setStoreName(e.target.value)}
            onInputClear={() => setStoreName('')}
          />
        }
        {state.customer.storeId ? '' :
          <ListItem
            title={labels.storeLocation}
            smartSelect
            smartSelectParams={{
              openIn: "popup", 
              closeOnSelect: true, 
              searchbar: true, 
              searchbarPlaceholder: labels.search,
              popupCloseLinkText: labels.close
            }}
          >
            <select name="locationId" value={locationId} onChange={e => setLocationId(e.target.value)}>
              <option value=""></option>
              {locations.map(l => 
                <option key={l.id} value={l.id}>{l.name}</option>
              )}
            </select>
          </ListItem>
        }
        {state.customer.storeId ? 
          <ListItem>
            <span>{labels.isOffer}</span>
            <Toggle 
              name="isOffer" 
              color="green" 
              checked={isOffer} 
              onToggleChange={() => setIsOffer(!isOffer)}
            />
          </ListItem>
        : ''}
        {isOffer ? 
          <ListInput 
            name="offerDays" 
            label={labels.offerDays}
            value={offerDays}
            clearButton 
            floatingLabel 
            type="number" 
            onChange={e => setOfferDays(e.target.value)}
            onInputClear={() => setOfferDays('')}
          />
        : ''}
      </List>
      {buttonVisible ?
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      : ''}
    </Page>
  )
}
export default AddAlarm
