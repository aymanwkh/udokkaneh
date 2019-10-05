import React, { useState, useContext, useEffect } from 'react'
import {Page, Navbar, List, ListInput, Fab, Icon, Block, Card, CardContent, CardHeader} from 'framework7-react';
import { StoreContext } from '../data/Store';
import { addPriceAlarm, showMessage } from '../data/Actions'
import ReLogin from './ReLogin'


const PriceAlarm = props => {
  const { state, user } = useContext(StoreContext)
  const pack = state.packs.find(rec => rec.id === props.id)
  const product = state.products.find(rec => rec.id === pack.productId)
  const [price, setPrice] = useState('')
  const [priceErrorMessage, setPriceErrorMessage] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [storeName, setStoreName] = useState('')
  const [storePlace, setStorePlace] = useState('')
  const [error, setError] = useState('')
  const patterns = {
    name: /^.{4,50}$/,
  }

  useEffect(() => {
    const validatePrice = (value) => {
      if (state.customer.type === 'o') {
        if (Number(value) > 0 && Number(value * 1000) <= pack.price) {
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
  }, [price])
  useEffect(() => {
    const validateStoreName = (value) => {
      if (patterns.name) {
        if (patterns.name.test(value)){
          setStoreNameErrorMessage('')
        } else {
          setStoreNameErrorMessage(state.labels.invalidName)
        }
      }
    }  
    if (storeName !== '') validateStoreName(storeName)
  }, [storeName])

  useEffect(() => {
    if (error) {
      showMessage(props, 'error', error)
      setError('')
    }
  }, [error])
  const formatPrice = value => {
    return (Number(value) * 1000 / 1000).toFixed(3)
  } 
  const handleSubmit = () => {
    const priceAlarm = {
      packId: pack.id,
      price: price * 1000,
      storeName,
      storePlace
    }
    addPriceAlarm(priceAlarm).then(() => {
      showMessage(props, 'success', state.labels.sendSuccess)
      props.f7router.back()
    }).catch (err => {
      setError(state.labels[err.code.replace(/-|\//g, '_')])
    })
  }
  if (!user) return <ReLogin callingPage='home'/>
  return (
    <Page>
      <Navbar title={state.customer.type === 'o' ? state.labels.havePack : state.labels.lessPrice} backLink={state.labels.back} />
      <Block>
        <Card className="demo-card-header-pic">
          <CardHeader className="card-title">
            <p>{product.name}</p>
            <p>{(pack.price / 1000).toFixed(3)}</p>
          </CardHeader>
          <CardContent>
            <img src={product.imageUrl} width="100%" height="250" alt=""/>
            <p>{pack.name}</p>
          </CardContent>
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
            onChange={(e) => setPrice(e.target.value)}
            onInputClear={() => setPrice('')}
            onBlur={(e) => setPrice(formatPrice(e.target.value))}
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
              onChange={(e) => setStoreName(e.target.value)}
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
        </List>
      </Block>
      {!price || (state.customer.type !== 'o' && !storeName) || priceErrorMessage || storeNameErrorMessage 
        ? '' 
        : <Fab position="left-bottom" slot="fixed" color="green" onClick={() => handleSubmit()}>
            <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
          </Fab>
      }
    </Page>
  )
}
export default PriceAlarm
