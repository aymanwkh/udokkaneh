import React, { useState, useContext, useEffect, useMemo } from 'react'
import { Page, Navbar, List, ListInput, Fab, Icon, Toggle, ListItem } from 'framework7-react'
import { StoreContext } from '../data/store'
import { addAlarm, showMessage, showError, getMessage } from '../data/actions'
import ReLogin from './relogin'
import labels from '../data/labels'
import { alarmTypes } from '../data/config'

const AddAlarm = props => {
  const { state, user } = useContext(StoreContext)
  const pack = useMemo(() => state.packs.find(p => p.id === props.packId)
  , [state.packs, props.packId])
  const product = useMemo(() => state.products.find(p => p.id === pack.productId)
  , [state.products, pack])
  const alarmType = useMemo(() => alarmTypes.find(t => t.id === props.alarmType)
  , [props.alarmType])
  const [price, setPrice] = useState('')
  const [priceErrorMessage, setPriceErrorMessage] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [storeName, setStoreName] = useState('')
  const [offerDays, setOfferDays] = useState('')
  const [isOffer, setIsOffer] = useState(false)
  const [locationId, setLocationId] = useState('')
  const [error, setError] = useState('')
  const locations = useMemo(() => [...state.locations].sort((l1, l2) => l1.ordering - l2.ordering)
  , [state.locations])

  useEffect(() => {
    const validatePrice = (value) => {
      if (state.customer.storeId) {
        if (Number(value) > 0) {
          setPriceErrorMessage('')
        } else {
          setPriceErrorMessage(labels.invalidPrice)
        }  
      } else {
        if (Number(value) > 0 && Number(value * 1000) < pack.price) {
          setPriceErrorMessage('')
        } else {
          setPriceErrorMessage(labels.invalidPrice)
        }  
      }
    }
    if (price !== '') validatePrice(price)
  }, [price, pack, state.customer])
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
    if (storeName) validateStoreName(storeName)
  }, [storeName])

  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const formatPrice = value => {
    return (Number(value) * 1000 / 1000).toFixed(3)
  } 
  const handleSubmit = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      if (offerDays && Number(offerDays) <= 0) {
        throw new Error('invalidPeriod')
      }
      let offerEnd = ''
      if (offerDays) {
        offerEnd = new Date()
        offerEnd.setDate(offerEnd.getDate() + Number(offerDays))
      }
      const alarm = {
        packId: pack.id,
        alarmType: props.alarmType,
        price: price * 1000,
        storeName,
        locationId,
        offerEnd
      }
      await addAlarm(alarm)
      showMessage(labels.sendSuccess)
      props.f7router.back()
    } catch (err) {
      setError(getMessage(props, err))
    }
  }

  if (!user) return <ReLogin />
  return (
    <Page>
      <Navbar title={alarmType.name} backLink={labels.back} />
      <List form>
        <ListInput 
          name="productName" 
          label={labels.productName}
          value={product.name}
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
          value={(pack.price / 1000).toFixed(3)}
          type="number" 
          readonly
        />
        <ListInput 
          name="price" 
          label={labels.price}
          placeholder={state.customer.storeId ? labels.pricePlaceholder : labels.lessPricePlaceholder}
          clearButton 
          type="number" 
          value={price} 
          errorMessage={priceErrorMessage}
          errorMessageForce  
          onChange={e => setPrice(e.target.value)}
          onInputClear={() => setPrice('')}
          onBlur={e => setPrice(formatPrice(e.target.value))}
        />
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
      {!price || (isOffer && !offerDays) || (!state.customer.storeId && (!storeName || !locationId)) || priceErrorMessage || storeNameErrorMessage ? '' :
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default AddAlarm
