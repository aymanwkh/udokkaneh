import React, { useState, useContext, useEffect, useMemo } from 'react'
import {Page, Navbar, List, ListInput, Fab, Icon, Button, Card, CardContent, CardHeader, CardFooter} from 'framework7-react';
import { StoreContext } from '../data/Store';
import { addPriceAlarm, showMessage } from '../data/Actions'
import ReLogin from './ReLogin'


const PriceAlarm = props => {
  const { state, user } = useContext(StoreContext)
  const pack = useMemo(() => state.packs.find(rec => rec.id === props.id)
  , [state.packs, props.id])
  const product = useMemo(() => state.products.find(rec => rec.id === pack.productId)
  , [state.products, pack])
  const [price, setPrice] = useState('')
  const [priceErrorMessage, setPriceErrorMessage] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storePlace, setStorePlace] = useState('')
  const [offerEnd, setOfferEnd] = useState('')
  const [offerEndErrorMessage, setOfferEndErrorMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const validatePrice = (value) => {
      if (state.customer.type === 'o') {
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
      showMessage(props, 'error', error)
      setError('')
    }
  }, [error, props])
  useEffect(() => {
    const validateDate = (value) => {
      if (new Date(value) > new Date()){
        setOfferEndErrorMessage('')
      } else {
        setOfferEndErrorMessage(state.labels.invalidOfferEnd)
      }
    }
    if (offerEnd.length > 0) validateDate(offerEnd)
    else setOfferEndErrorMessage('')
  }, [offerEnd, state.labels])

  const formatPrice = value => {
    return (Number(value) * 1000 / 1000).toFixed(3)
  } 
  const handleSubmit = () => {
    const offerEndDate = offerEnd.length > 0 ? new Date(offerEnd) : ''
    const priceAlarm = {
      packId: pack.id,
      price: parseInt(price * 1000),
      storeName,
      storePlace,
      offerEnd: offerEndDate
    }
    addPriceAlarm(priceAlarm).then(() => {
      showMessage(props, 'success', state.labels.sendSuccess)
      props.f7router.back()
    }).catch (err => {
      setError(state.labels[err.code.replace(/-|\//g, '_')])
    })
  }
  const handleFinishedPack = () => {
    const priceAlarm = {
      packId: pack.id,
      price: 0
    }
    addPriceAlarm(priceAlarm).then(() => {
      showMessage(props, 'success', state.labels.sendSuccess)
      props.f7router.back()
    }).catch (err => {
      setError(state.labels[err.code.replace(/-|\//g, '_')])
    })
  }
  const priceAlarmText = useMemo(() => {
    if (state.customer.type === 'o') {
      if (pack.stores.find(rec => rec.id === state.customer.storeId)) {
        return state.labels.changePrice
      } else {
       return state.labels.havePack
      }
    } else {
      return state.labels.lessPrice
    }
  }, [pack, state.customer, state.labels])

  if (!user) return <ReLogin callingPage='home'/>
  return (
    <Page>
      <Navbar title={priceAlarmText} backLink={state.labels.back} />
      <Card>
        <CardHeader className="card-title">
          <p>{product.name}</p>
          <p>{(pack.price / 1000).toFixed(3)}</p>
        </CardHeader>
        <CardContent>
          <img src={product.imageUrl} width="100%" height="250" alt=""/>
        </CardContent>
        <CardFooter>
          <p>{pack.name}</p>
          <p>
            {state.customer.type === 'o' ?
              <Button fill round color="red" onClick={() => handleFinishedPack()}>{state.labels.haveNoPacks}</Button>
              : ''
            }
          </p>
        </CardFooter>
      </Card>
      <List form>
        <ListInput 
          name="price" 
          label={state.labels.price}
          placeholder={state.customer.type === 'o' ? state.labels.pricePlaceholder : state.labels.lessPricePlaceholder}
          clearButton 
          type="number" 
          value={price} 
          errorMessage={priceErrorMessage}
          errorMessageForce  
          onChange={e => setPrice(e.target.value)}
          onInputClear={() => setPrice('')}
          onBlur={e => setPrice(formatPrice(e.target.value))}
        />
        {state.customer.type === 'o'
        ? ''
        : <ListInput 
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
        {state.customer.type === 'o'
        ? ''
        : <ListInput 
            name="storePlace" 
            label={state.labels.storePlace}
            placeholder={state.labels.namePlaceholder}
            clearButton 
            type="text" 
            value={storePlace} 
            onChange={(e) => setStorePlace(e.target.value)}
            onInputClear={() => setStorePlace('')}
          />
        }
        {state.customer.type === 'o'
        ? <ListInput
            name="offerEnd"
            label={state.labels.offerEnd}
            type="datepicker"
            value={offerEnd} 
            clearButton
            errorMessage={offerEndErrorMessage}
            errorMessageForce
            onCalendarChange={(value) => setOfferEnd(value)}
            onInputClear={() => setOfferEnd([])}
          />
        : ''
        }
      </List>
      {!price || (state.customer.type !== 'o' && !storeName) || priceErrorMessage || storeNameErrorMessage 
        ? '' 
        : <Fab position="left-bottom" slot="fixed" color="green" onClick={() => handleSubmit()}>
            <Icon material="done"></Icon>
          </Fab>
      }
    </Page>
  )
}
export default PriceAlarm
