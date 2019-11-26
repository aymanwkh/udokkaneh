import React, { useContext, useMemo, useEffect, useState } from 'react'
import { Page, Navbar, Card, CardContent, CardHeader, Link, Fab, FabButton, FabButtons, Toolbar, Icon, CardFooter, Button, Row, Col } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import RatingStars from './RatingStars'
import { StoreContext } from '../data/Store'
import { showMessage } from '../data/Actions'

const PackDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const pack = useMemo(() => state.packs.find(p => p.id === props.id)
  , [state.packs, props.id])
  const product = useMemo(() => state.products.find(p => p.id === pack.productId)
  , [state.products, pack])
  const hasOtherOffers = useMemo(() => {
    let offers = state.packs.filter(p => state.products.find(pr => pr.id === p.productId && pr.category === product.category) && (p.isOffer || p.hasOffer))
    offers = offers.filter(p => p.id !== pack.id && p.price > 0)
    return offers.length
  }, [state.packs, pack, product, state.products]) 
  const hasComments = useMemo(() => {
    const ratings = state.ratings.filter(r => r.productId === product.id && r.status === 'a')
    return ratings.length
  }, [state.ratings, product])
  const hasPurchased = useMemo(() => {
    const deliveredOrders = state.orders.filter(o => o.status === 'd' && o.basket.find(p => state.packs.find(pa => pa.id === p.packId).productId === product.id))
    return deliveredOrders.length
  }, [state.orders, state.packs, product])
  const priceAlarmText = useMemo(() => {
    if (state.customer.storeId) {
      if (pack.stores.find(s => s.storeId === state.customer.storeId)) {
        return `${state.labels.changePrice} ${(pack.stores.find(s => s.id === state.customer.storeId).price / 1000).toFixed(3)}`
      } else {
       return state.labels.havePack
      }
    } else {
      return state.labels.lessPrice
    }
  }, [pack, state.labels, state.customer])
  useEffect(() => {
    if (error) {
      showMessage(props, 'error', error)
      setError('')
    }
  }, [error, props])

  const handleAddPack = () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error(state.labels.blockedUser)
      }
      if (state.basket.find(p => p.packId === pack.id)) {
        throw new Error(state.labels.alreadyInBasket)
      }
      dispatch({type: 'ADD_TO_BASKET', pack})
      showMessage(props, 'success', state.labels.addToBasketSuccess)
      props.f7router.back()  
    } catch(err) {
			err.code ? setError(state.labels[err.code.replace(/-|\//g, '_')]) : setError(err.message)
		}
  }
  return (
    <Page>
      <Navbar title={product.name} backLink={state.labels.back} />
      <Card>
        <CardHeader className="card-title">
          <p className="less-price">
            <span className="price">
              {(pack.price / 1000).toFixed(3)}
            </span> <br />
            <Link 
              iconMaterial="notifications_none" 
              text={priceAlarmText} 
              color="red" 
              onClick={() => props.f7router.navigate(`/priceAlarm/${props.id}`)}
            />
          </p>
          <p className="rating">{product.rating ? `(${product.ratingCount})` : ''} <RatingStars rating={product.rating} /> </p>
        </CardHeader>
        <CardContent>
          <img src={product.imageUrl} className="img-card" alt={product.name} />
        </CardContent>
        <CardFooter>
          <p>{pack.name}</p>
          <p>{`${state.labels.productOf} ${state.countries.find(c => c.id === product.country).name}`}</p>
        </CardFooter>
      </Card>
      <Fab position="center-bottom" slot="fixed" text={state.labels.addToBasket} color="green" onClick={() => handleAddPack()}>
        <Icon material="add"></Icon>
      </Fab>  
      <Row>
        <Col>
          {hasOtherOffers > 0 ? 
            <Button small fill round color="red" className="button-margin" onClick={() => props.f7router.navigate(`/otherOffers/${props.id}`)}>{state.labels.otherOffers}</Button>
            : ''
          }
        </Col>
        <Col></Col>
        <Col>
          {hasComments > 0 ? 
            <Button small fill round className="button-margin" onClick={() => props.f7router.navigate(`/ratings/${product.id}`)}>{state.labels.ratings}</Button>
            : ''
          }
        </Col>
      </Row>
      {!user || hasPurchased === 0 || state.ratings.find(r => r.userId === user.uid && r.productId === product.id) ? '' :
        <Fab position="left-top" slot="fixed" color="blue">
          <Icon material="favorite_border"></Icon>
          <Icon material="close"></Icon>
          <FabButtons position="bottom">
            <FabButton color="green" onClick={() => props.f7router.navigate(`/rateProduct/${product.id}/value/1`)}>
              <Icon material="thumb_up"></Icon>
            </FabButton>
            <FabButton color="red" onClick={() => props.f7router.navigate(`/rateProduct/${product.id}/value/-1`)}>
            <Icon material="thumb_down"></Icon>
            </FabButton>
          </FabButtons>
        </Fab>
      }
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>

    </Page>
  )
}

export default PackDetails
