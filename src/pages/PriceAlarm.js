import React, { useState, useContext, useEffect, useMemo } from 'react'
import { Page, Navbar, List, ListInput, Fab, Icon, Card, CardContent, CardHeader, Toggle, ListItem } from 'framework7-react';
import { StoreContext } from '../data/Store';
import { addPriceAlarm, showMessage, showError, getMessage } from '../data/Actions'
import ReLogin from './ReLogin'


const PriceAlarm = props => {
  const { state, user } = useContext(StoreContext)
  const pack = useMemo(() => state.packs.find(p => p.id === props.id)
  , [state.packs, props.id])
  const product = useMemo(() => state.products.find(p => p.id === pack.productId)
  , [state.products, pack])
  const [price, setPrice] = useState('')
  const [priceErrorMessage, setPriceErrorMessage] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [storeName, setStoreName] = useState('')
  const [offerDays, setOfferDays] = useState('')
  const [isOffer, setIsOffer] = useState(false)
  const [locationId, setLocationId] = useState('')
  const [error, setError] = useState('')
  const locations = useMemo(() => [...state.locations].sort((l1, l2) => l1.sorting - l2.sorting)
  , [state.locations])

  const priceAlarmText = useMemo(() => {
    if (state.customer.storeId) {
      if (state.storePacks.find(p => p.storeId === state.customer.storeId && p.packId === pack.id)) {
        return state.labels.changePrice
      } else {
       return state.labels.havePack
      }
    } else {
      return state.labels.lessPrice
    }
  }, [pack, state.customer, state.labels, state.storePacks])

  useEffect(() => {
    const validatePrice = (value) => {
      if (state.customer.storeId) {
        if (Number(value) > 0) {
          setPriceErrorMessage('')
        } else {
          setPriceErrorMessage(state.labels.invalidPrice)
        }  
      } else {
        if (Number(value) > 0 && Number(value * 1000) < pack.price) {
          setPriceErrorMessage('')
        } else {
          setPriceErrorMessage(state.labels.invalidPrice)
        }  
      }
    }
    if (price !== '') validatePrice(price)
  }, [price, pack, state.customer, state.labels])
  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateStoreName = value => {
      if (patterns.name.test(value)){
        setStoreNameErrorMessage('')
      } else {
        setStoreNameErrorMessage(state.labels.invalidName)
      }
    }  
    if (storeName) validateStoreName(storeName)
  }, [storeName, state.labels])

  useEffect(() => {
    if (error) {
      showError(props, error)
      setError('')
    }
  }, [error, props])

  const formatPrice = value => {
    return (Number(value) * 1000 / 1000).toFixed(3)
  } 
  const handleSubmit = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.priceAlarms.find(a => a.priceAlarm.packId === pack.id && a.status === 'n')){
        throw new Error('duplicatePriceAlarms')
      }
      if (offerDays && Number(offerDays) <= 0) {
        throw new Error('invalidPeriod')
      }
      let offerEnd = ''
      if (offerDays) {
        offerEnd = new Date()
        offerEnd.setDate(offerEnd.getDate() + Number(offerDays))
      }
      const priceAlarm = {
        packId: pack.id,
        price: price * 1000,
        storeName,
        locationId,
        offerEnd
      }
      await addPriceAlarm(priceAlarm)
      showMessage(props, state.labels.sendSuccess)
      props.f7router.back()
    } catch (err) {
      setError(getMessage(props, err))
    }
  }

  if (!user) return <ReLogin />
  return (
    <Page>
      <Navbar title={priceAlarmText} backLink={state.labels.back} />
      <Card>
        <CardHeader className="card-header">
          <p>{`${product.name} ${pack.name}`}</p>
          <p>{(pack.price / 1000).toFixed(3)}</p>
        </CardHeader>
        <CardContent>
          <img src={product.imageUrl} className="img-card" alt={product.name} />
        </CardContent>
      </Card>
      <List form>
        <ListInput 
          name="price" 
          label={state.labels.price}
          placeholder={state.customer.storeId ? state.labels.pricePlaceholder : state.labels.lessPricePlaceholder}
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
            label={state.labels.storeName}
            placeholder={state.labels.namePlaceholder}
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
            title={state.labels.location}
            smartSelect
            smartSelectParams={{
              openIn: "popup", 
              closeOnSelect: true, 
              searchbar: true, 
              searchbarPlaceholder: state.labels.search,
              popupCloseLinkText: state.labels.close
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
            <span>{state.labels.isOffer}</span>
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
            label={state.labels.offerDays}
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
        <Fab position="left-top" slot="fixed" color="green" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      }
    </Page>
  )
}
export default PriceAlarm
