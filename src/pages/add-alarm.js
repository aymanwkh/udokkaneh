import React, { useState, useContext, useEffect, useMemo } from 'react'
import { f7, Page, Navbar, List, ListInput, Fab, Icon, Toggle, ListItem } from 'framework7-react'
import { StoreContext } from '../data/store'
import { addAlarm, showMessage, showError, getMessage } from '../data/actions'
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
  const [alternative, setAlternative] = useState('')
  const [alternativeErrorMessage, setAlternativeErrorMessage] = useState('')
  const [offerDays, setOfferDays] = useState('')
  const [isOffer, setIsOffer] = useState(false)
  const [buttonVisible, setButtonVisisble] = useState(false)
  const currentPrice = useMemo(() => {
    if (props.alarmType === '2') {
      return state.storePacks.find(p => p.storeId === state.customerInfo.storeId && p.packId === pack.id).price
    } else {
      return pack.price
    }
  }, [state.storePacks, state.customerInfo, pack, props.alarmType])
  useEffect(() => {
    const validatePrice = (value) => {
      if (!state.customerInfo.storeId) {
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
  }, [price, pack, props.alarmType, currentPrice, state.customerInfo])
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
    const validateAlternative = value => {
      if (patterns.name.test(value)){
        setAlternativeErrorMessage('')
      } else {
        setAlternativeErrorMessage(labels.invalidName)
      }
    }  
    if (storeName) validateStoreName(storeName)
    if (alternative) validateAlternative(alternative)
  }, [storeName, alternative])

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

  useEffect(() => {
    if (!price
    || (isOffer && !offerDays)
    || (props.alarmType === '5' && !alternative)
    || (props.alarmType === '7' && !quantity) 
    || (!state.customerInfo.storeId && !storeName)
    || priceErrorMessage
    || storeNameErrorMessage
    || alternativeErrorMessage) setButtonVisisble(false)
    else setButtonVisisble(true)
  }, [props.alarmType, price, isOffer, offerDays, alternative, quantity, state.customerInfo, storeName, priceErrorMessage, storeNameErrorMessage, alternativeErrorMessage])
  const formatPrice = value => {
    return Number(value).toFixed(3)
  } 
  const handleSubmit = async () => {
    try{
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      if (offerDays && Number(offerDays) <= 0) {
        throw new Error('invalidPeriod')
      }
      if ((props.alarmType === '7' && Number(quantity) < 2) || (quantity && props.alarmType === '6' && Number(quantity) < 1)){
        throw new Error('invalidQuantity')
      }
      const alarm = {
        packId: pack.id,
        type: props.alarmType,
        price: price * 1000,
        quantity: Number(quantity),
        storeName,
        alternative,
        offerDays: Number(offerDays)
      }
      setInprocess(true)
      await addAlarm(state.userInfo, alarm)
      setInprocess(false)
      showMessage(labels.sendSuccess)
      props.f7router.back()
    } catch (err) {
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }

  if (!user) return <Page><h3 className="center"><a href="/login/">{labels.relogin}</a></h3></Page>
  return (
    <Page>
      <Navbar title={alarmType.name} backLink={labels.back} />
      <List form>
        <ListInput 
          name="productName" 
          label={labels.productName}
          value={pack.productName}
          type="text" 
          readonly
        />
        <ListInput 
          name="packName" 
          label={labels.packName}
          value={pack.name}
          type="text" 
          readonly
        />
        <ListInput 
          name="currentPrice" 
          label={labels.currentPrice}
          value={(currentPrice / 1000).toFixed(3)}
          type="number" 
          readonly
        />
        {props.alarmType === '5' ?
          <ListInput 
            name="alternative" 
            label={labels.alternative}
            placeholder={labels.namePlaceholder}
            clearButton 
            type="text" 
            value={alternative} 
            errorMessage={alternativeErrorMessage}
            errorMessageForce  
            onChange={e => setAlternative(e.target.value)}
            onInputClear={() => setAlternative('')}
          />
        : ''}
        <ListInput 
          name="price" 
          label={labels.price}
          placeholder={state.customerInfo.storeId ? labels.pricePlaceholder : labels.lessPricePlaceholder}
          clearButton 
          type="number" 
          value={price} 
          errorMessage={priceErrorMessage}
          errorMessageForce  
          onChange={e => setPrice(e.target.value)}
          onInputClear={() => setPrice('')}
          onBlur={e => setPrice(formatPrice(e.target.value))}
        />
        {['6', '7'].includes(props.alarmType) ? 
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
        {state.customerInfo.storeId ? '' :
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
        {state.customerInfo.storeId ? 
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
