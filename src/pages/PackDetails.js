import React, { useContext, useMemo, useEffect, useState } from 'react'
import { f7, Page, Navbar, Card, CardContent, CardHeader, Link, Fab, FabButton, FabButtons, Toolbar, Icon, CardFooter, Popover, List, ListItem } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import RatingStars from './RatingStars'
import { StoreContext } from '../data/store'
import { addAlarm, showMessage, showError, getMessage } from '../data/actions'
import PackImage from './PackImage'
import labels from '../data/labels'
import { setup, alarmTypes } from '../data/config'
import moment from 'moment'

const PackDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [toolbarVisible, setToolbarVisible] = useState(true)
  const pack = useMemo(() => state.packs.find(p => p.id === props.id)
  , [state.packs, props.id])
  const product = useMemo(() => state.products.find(p => p.id === pack.productId)
  , [state.products, pack])
  const hasOtherOffers = useMemo(() => {
    let offers = state.packs.filter(p => state.products.find(pr => pr.id === p.productId && pr.categoryId === product.categoryId) && (p.isOffer || p.offerEnd))
    offers = offers.filter(p => p.id !== pack.id && p.price > 0)
    return offers.length
  }, [state.packs, pack, product, state.products]) 
  const ratings = useMemo(() => state.ratings.filter(r => r.productId === product.id && r.status === 'a')
  , [state.ratings, product])
  const hasPurchased = useMemo(() => {
    const deliveredOrders = state.orders.filter(o => o.status === 'd' && o.basket.find(p => state.packs.find(pa => pa.id === p.packId).productId === product.id))
    return deliveredOrders.length
  }, [state.orders, state.packs, product])
  const isAvailable = useMemo(() => state.customer.storeId && state.storePacks.find(p => p.storeId === state.customer.storeId && p.packId === pack.id) ? true : false
  , [state.customer, state.storePacks, pack])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const addToBasket = packId => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.basket.find(p => p.packId === packId)) {
        throw new Error('alreadyInBasket')
      }
      let purchasedPack = pack
      let price, maxQuantity
      if (packId !== pack.id) {
        purchasedPack = state.packs.find(p => p.id === packId)
        if (packId === pack.subPackId) {
          price = parseInt((pack.price / pack.subQuantity) * (pack.subPercent / 100))
          maxQuantity = pack.subQuantity - 1
          if (pack.bonusPackId) maxQuantity++
        } else  {
          price = parseInt((pack.price / pack.bonusQuantity) * (pack.bonusPercent / 100))
          maxQuantity = pack.bonusQuantity
        }
        purchasedPack = {
          ...purchasedPack,
          price,
          maxQuantity,
          offerId: pack.id
        }
      }
      if (state.customer){
        const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
        const activeOrdersTotal = activeOrders.reduce((sum, o) => sum + o.total, 0)
        if (activeOrdersTotal + purchasedPack.price > state.customer.orderLimit || setup.orderLimit) {
          throw new Error('limitOverFlow')
        }
        const packInActiveOrders = activeOrders.filter(o => o.basket.find(p => p.packId === packId))
        const quantityInActiveOrders = packInActiveOrders.reduce((sum, o) => sum + o.basket.find(p => p.packId === purchasedPack.id).quantity, 0)
        if (purchasedPack.orderLimit && purchasedPack.orderLimit <= quantityInActiveOrders){
          throw new Error('ExceedPackLimitActiveOrders')
        }
      }
      dispatch({type: 'ADD_TO_BASKET', pack: purchasedPack})
      showMessage(labels.addToBasketSuccess)
      props.f7router.back()  
		} catch (err){
      setError(getMessage(props, err))
    }
  }
  const handleAddAlarm = alarmTypeId => {
    try {
      if (alarmTypeId === '4') {
        f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, async () => {
          try{
            if (state.customer.isBlocked) {
              throw new Error('blockedUser')
            }
            const alarm = {
              packId: pack.id,
              alarmType: alarmTypeId 
            }
            await addAlarm(alarm)
            showMessage(labels.sendSuccess)
            props.f7router.back()
          } catch(err) {
            setError(getMessage(props, err))
          }
        })  
      } else {
        if (state.customer.isBlocked) {
          throw new Error('blockedUser')
        }
        if (state.alarms.find(a => a.packId === pack.id && a.status === 'n')){
          throw new Error('duplicatePriceAlarms')
        }  
        props.f7router.navigate(`/addAlarm/${pack.id}/type/${alarmTypeId}`)
      }  
    } catch(err) {
      setError(getMessage(props, err))
    }
  }
  const handlePartialPurchase = () => {
    if (pack.bonusPackId) {
      props.f7router.app.popover.open('.pack-list', '.partial-purchase')
    } else {
      addToBasket(pack.subPackId)
    }
  }
  return (
    <Page>
      <Navbar title={product.name} backLink={labels.back} />
      <Card>
        <CardHeader className="card-header">
          <p className="price">
            {(pack.price / 1000).toFixed(3)} <br />
            <span className="list-subtext1">{pack.offerEnd ? `${labels.offerUpTo}: ${moment(pack.offerEnd.toDate()).format('Y/M/D')}` : ''}</span>
          </p>
          {product.trademarkId ? <p><RatingStars rating={product.rating} count={product.ratingCount} /> </p> : ''}
        </CardHeader>
        <CardContent>
          <div className="card-title">{pack.name}</div>
          <PackImage pack={pack} type="card" />
        </CardContent>
        <CardFooter>
          <p>{`${labels.productOf} ${state.countries.find(c => c.id === product.countryId).name}`}</p>
          {user ? <p><Link popoverOpen=".popover-list" iconMaterial="more_vert" /></p> : ''}
        </CardFooter>
      </Card>
      {pack.isOffer ? 
        <Fab 
          position="center-bottom" 
          slot="fixed" 
          text={labels.addToBasket} 
          morphTo=".toolbar.fab-morph-target" 
          onClick={() => setToolbarVisible(false)}
        >
          <Icon material="add"></Icon>
        </Fab>
      : <Fab 
          position="center-bottom" 
          slot="fixed" 
          text={labels.addToBasket} 
          color="green" 
          onClick={() => addToBasket(pack.id)}
        >
          <Icon material="add"></Icon>
        </Fab>
      }  
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
          {hasOtherOffers > 0 ? <ListItem link={`/otherOffers/${props.id}`} popoverClose title={labels.otherOffers} /> : ''}
          {ratings.length > 0 ? <ListItem link={`/ratings/${product.id}`} popoverClose title={labels.ratings} /> : ''}
          {alarmTypes.map(p => 
            p.actor === 'a' || (p.actor === 'c' && !state.customer.storeId) || (p.actor === 'o' && state.customer.storeId && p.isAvailable === isAvailable) ?
              <ListItem 
                link="#" 
                popoverClose 
                title={p.name} 
                className="alarm-list"
                onClick={() => handleAddAlarm(p.id)}
                key={p.id}
              /> 
            : ''
          )}
        </List>
      </Popover>
      <Popover className="pack-list">
        <List>
          <ListItem 
            link="#" 
            popoverClose 
            title={state.packs.find(p => p.id === pack.subPackId)?.name} 
            onClick={() => addToBasket(pack.subPackId)}
          />
          <ListItem 
            link="#" 
            popoverClose 
            title={state.packs.find(p => p.id === pack.bonusPackId)?.name} 
            onClick={() => addToBasket(pack.bonusPackId)}
          />
        </List>
      </Popover>
      {pack.isOffer ?
        <Toolbar bottom className="fab-morph-target">
          <Link onClick={() => addToBasket(pack.id)}>{labels.fullPurchase}</Link>
          <Link className="partial-purchase" onClick={() => handlePartialPurchase()}>{labels.partialPurchase}</Link>
        </Toolbar>
      : ''
      }
      {toolbarVisible ? 
        <Toolbar bottom>
          <BottomToolbar/>
        </Toolbar>
      : ''}
    </Page>
  )
}

export default PackDetails
