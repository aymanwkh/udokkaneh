import React, { useContext, useMemo, useEffect, useState } from 'react'
import { Page, Navbar, Card, CardContent, CardHeader, Link, Fab, FabButton, FabButtons, Toolbar, Icon, CardFooter, Popover, List, ListItem } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import RatingStars from './RatingStars'
import { StoreContext } from '../data/Store'
import { addPriceAlarm, showMessage, showError, getMessage } from '../data/Actions'
import PackImage from './PackImage'

const PackDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const pack = useMemo(() => state.packs.find(p => p.id === props.id)
  , [state.packs, props.id])
  const product = useMemo(() => state.products.find(p => p.id === pack.productId)
  , [state.products, pack])
  const hasOtherOffers = useMemo(() => {
    let offers = state.packs.filter(p => state.products.find(pr => pr.id === p.productId && pr.categoryId === product.categoryId) && (p.isOffer || p.hasOffer))
    offers = offers.filter(p => p.id !== pack.id && p.price > 0)
    return offers.length
  }, [state.packs, pack, product, state.products]) 
  const ratings = useMemo(() => state.ratings.filter(r => r.productId === product.id && r.status === 'a')
  , [state.ratings, product])
  const hasPurchased = useMemo(() => {
    const deliveredOrders = state.orders.filter(o => o.status === 'd' && o.basket.find(p => state.packs.find(pa => pa.id === p.packId).productId === product.id))
    return deliveredOrders.length
  }, [state.orders, state.packs, product])
  const priceAlarmText = useMemo(() => {
    if (state.customer.storeId) {
      const found = state.storePacks.find(p => p.storeId === state.customer.storeId && p.packId === pack.id)
      return found ? state.labels.changePrice : state.labels.havePack
    } else {
      return state.labels.lessPrice
    }
  }, [pack, state.labels, state.customer, state.storePacks])
  useEffect(() => {
    if (error) {
      showError(props, error)
      setError('')
    }
  }, [error, props])

  const handleAddPack = () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.basket.find(p => p.packId === pack.id)) {
        throw new Error('alreadyInBasket')
      }
      if (state.customer){
        const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
        const activeOrdersTotal = activeOrders.reduce((sum, o) => sum + o.total, 0)
        if (activeOrdersTotal + pack.price > state.customer.orderLimit) {
          throw new Error('limitOverFlow')
        }
        const packInActiveOrders = activeOrders.filter(o => o.basket.find(p => p.packId === pack.id))
        const quantityInActiveOrders = packInActiveOrders.reduce((sum, o) => sum + o.basket.find(p => p.packId === pack.id).quantity, 0)
        if (pack.orderLimit && pack.orderLimit <= quantityInActiveOrders){
          throw new Error('ExceedPackLimitActiveOrders')
        }
      }
      dispatch({type: 'ADD_TO_BASKET', pack})
      showMessage(props, state.labels.addToBasketSuccess)
      props.f7router.back()  
		} catch (err){
      setError(getMessage(props, err))
    }
  }
  const handleFinishedPack = () => {
    props.f7router.app.dialog.confirm(state.labels.confirmationText, state.labels.confirmationTitle, async () => {
      try{
        if (state.customer.isBlocked) {
          throw new Error('blockedUser')
        }
        const priceAlarm = {
          packId: pack.id,
          price: 0
        }
        await addPriceAlarm(priceAlarm)
        showMessage(props, state.labels.sendSuccess)
        props.f7router.back()
      } catch(err) {
        setError(getMessage(props, err))
      }
    })
  }

  return (
    <Page>
      <Navbar title={product.name} backLink={state.labels.back} />
      <Card>
        <CardHeader className="card-header">
          <p className="price">{(pack.price / 1000).toFixed(3)}</p>
          {product.trademarkId ? <p><RatingStars rating={product.rating} count={product.ratingCount} /> </p> : ''}
        </CardHeader>
        <CardContent>
          <div className="card-title">{pack.name}</div>
          <PackImage pack={pack} type="card" />
        </CardContent>
        <CardFooter>
          <p>{`${state.labels.productOf} ${state.countries.find(c => c.id === product.countryId).name}`}</p>
          <p><Link popoverOpen=".popover-list" iconMaterial="more_vert" /></p>
        </CardFooter>
      </Card>
      <Fab position="center-bottom" slot="fixed" text={state.labels.addToBasket} color="green" onClick={() => handleAddPack()}>
        <Icon material="add"></Icon>
      </Fab>  
      {!user || !product.trademarkId || hasPurchased === 0 || state.ratings.find(r => r.userId === user.uid && r.productId === product.id) ? '' :
        <Fab position="left-top" slot="fixed" color="blue" className="top-fab">
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
      <Popover className="popover-list">
        <List>
          {hasOtherOffers > 0 ? <ListItem link={`/otherOffers/${props.id}`} popoverClose title={state.labels.otherOffers} /> : ''}
          {ratings.length > 0 ? <ListItem link={`/ratings/${product.id}`} popoverClose title={state.labels.ratings} /> : ''}
          <ListItem link={`/priceAlarm/${props.id}`} popoverClose title={priceAlarmText} />
          {state.customer.storeId && state.storePacks.find(p => p.storeId === state.customer.storeId && p.packId === pack.id) ? 
            <ListItem 
              link="#" 
              popoverClose 
              title={state.labels.haveNoPacks} 
              onClick={() => handleFinishedPack()}
            /> 
          : ''}
        </List>
      </Popover>

      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>

    </Page>
  )
}

export default PackDetails
