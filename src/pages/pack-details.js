import React, { useContext, useMemo, useEffect, useState } from 'react'
import { f7, Page, Navbar, Card, CardContent, CardHeader, Link, Fab, FabButton, FabButtons, Toolbar, Icon, Actions, ActionsButton, Row } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import RatingStars from './rating-stars'
import { StoreContext } from '../data/store'
import { addAlarm, showMessage, showError, getMessage, addFavorite, removeFavorite, rateProduct } from '../data/actions'
import PackImage from './pack-image'
import labels from '../data/labels'
import { setup, alarmTypes } from '../data/config'
import moment from 'moment'

const PackDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const pack = useMemo(() => state.packs.find(p => p.id === props.id)
  , [state.packs, props.id])
  const ratings = useMemo(() => state.ratings.filter(r => r.productId === pack.productId)
  , [state.ratings, pack])
  const hasPurchased = useMemo(() => {
    const deliveredOrders = state.orders.filter(o => o.status === 'd' && o.basket.find(p => state.packs.find(pa => pa.id === p.packId).productId === pack.productId))
    return deliveredOrders.length
  }, [state.orders, state.packs, pack])
  const isAvailable = useMemo(() => state.customer.storeId && state.storePacks.find(p => p.storeId === state.customer.storeId && p.packId === pack.id) ? true : false
  , [state.storePacks, state.customer, pack])
  const subPackInfo = useMemo(() => {
    if (pack.subPackId) {
      const subPack =  state.packs.find(p => p.id === pack.subPackId)
      const price = parseInt(pack.price / pack.subQuantity * pack.subPercent * (1 + setup.profit))
      return `${subPack.productName} ${subPack.name}, ${labels.unitPrice}: ${(price / 1000).toFixed(3)}`
    } else {
      return ''
    }
  }, [pack, state.packs])
  const bonusPackInfo = useMemo(() => {
    if (pack.bonusPackId) {
      const bonusPack =  state.packs.find(p => p.id === pack.bonusPackId)
      const price = parseInt(pack.price / pack.bonusQuantity * pack.bonusPercent * (1 + setup.profit))
      return `${bonusPack.productName} ${bonusPack.name}, ${labels.unitPrice}: ${(price / 1000).toFixed(3)}`
    } else {
      return ''
    }
  }, [pack, state.packs])
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
          price = parseInt(pack.price / pack.subQuantity * pack.subPercent * (1 + setup.profit))
          maxQuantity = pack.subQuantity - 1
          if (pack.bonusPackId) maxQuantity++
        } else  {
          price = parseInt(pack.price / pack.bonusQuantity * pack.bonusPercent * (1 + setup.profit))
          maxQuantity = pack.bonusQuantity
        }
        purchasedPack = {
          ...purchasedPack,
          price,
          maxQuantity,
          offerId: pack.id
        }
      }
      const orderLimit = state.customer.orderLimit || setup.orderLimit
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      const activeOrdersTotal = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (activeOrdersTotal + purchasedPack.price > orderLimit) {
        throw new Error('limitOverFlow')
      }
      const packInActiveOrders = activeOrders.filter(o => o.basket.find(p => p.packId === packId))
      const quantityInActiveOrders = packInActiveOrders.reduce((sum, o) => sum + o.basket.find(p => p.packId === purchasedPack.id).quantity, 0)
      if (purchasedPack.orderLimit && purchasedPack.orderLimit <= quantityInActiveOrders){
        throw new Error('ExceedPackLimitActiveOrders')
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
            setInprocess(true)
            await addAlarm(alarm)
            setInprocess(false)
            showMessage(labels.sendSuccess)
            props.f7router.back()
          } catch(err) {
            setInprocess(false)
            setError(getMessage(props, err))
          }
        })  
      } else {
        if (state.customer.isBlocked) {
          throw new Error('blockedUser')
        }
        if (state.alarms.find(a => a.packId === pack.id && a.status === 'n')){
          throw new Error('duplicateAlarms')
        }  
        props.f7router.navigate(`/add-alarm/${pack.id}/type/${alarmTypeId}`)
      }  
    } catch(err) {
      setError(getMessage(props, err))
    }
  }
  const handleFavorite = async () => {
    try{
      const found = state.favorites.find(f => f.userId === user.uid && f.packId === pack.id)
      if (found) {
        setInprocess(true)
        await removeFavorite(found)
        setInprocess(false)
        showMessage(labels.removeFavoriteSuccess)
      } else {
        setInprocess(true)
        await addFavorite({
          userId : user.uid,
          packId: pack.id
        })
        setInprocess(false)
        showMessage(labels.addFavoriteSuccess)
      }
		} catch (err){
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }
  const handleRate = async value => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      setInprocess(true)
      await rateProduct(pack.productId, Number(value))
      setInprocess(false)
      showMessage(labels.ratingSuccess)
    } catch(err) {
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={pack.productName} backLink={labels.back} />
      <Card>
        <CardHeader className="card-header">
          <div>
            <Row>
              <div className="price">
                {(pack.price / 1000).toFixed(3)}
              </div>
              <div>
                <Link iconMaterial="warning" iconColor="red" onClick={() => f7.actions.open('#pack-actions')} />
              </div>
            </Row>
            <span className="list-subtext1">{pack.offerEnd ? `${labels.offerUpTo}: ${moment(pack.offerEnd.toDate()).format('Y/M/D')}` : ''}</span>
          </div>
          {pack.trademark ? <div className="rating-stars"><RatingStars rating={pack.rating} count={pack.ratingCount} /> </div> : ''}
        </CardHeader>
        <CardContent>
          <div className="card-title">{pack.name}</div>
          <PackImage pack={pack} type="card" />
          <div>{`${labels.productOf} ${pack.trademark ? labels.company + ' ' + pack.trademark + '-' : ''}${pack.country}`}</div>
        </CardContent>
      </Card>
      <Fab 
        position="center-bottom" 
        slot="fixed" 
        text={labels.addToBasket} 
        color="green" 
        onClick={() => pack.isOffer ? f7.actions.open('#offer-options') : addToBasket(pack.id)}
      >
        <Icon material="add"></Icon>
      </Fab>
      {!user ? '' :
        <Fab position="left-top" slot="fixed" color="blue" className="top-fab">
          <Icon material="favorite_border"></Icon>
          <Icon material="close"></Icon>
          <FabButtons position="bottom">
            {!pack.trademark || hasPurchased === 0 || ratings.length > 0 ? '' : 
              <FabButton color="green" onClick={() => handleRate(1)}>
                <Icon material="thumb_up"></Icon>
              </FabButton>
            }
            {!pack.trademark || hasPurchased === 0 || ratings.length > 0 ? '' : 
              <FabButton color="red" onClick={() => handleRate(0)}>
                <Icon material="thumb_down"></Icon>
              </FabButton>
            }
            {state.favorites.find(f => f.userId === user.uid && f.packId === pack.id) ? 
              <FabButton color="pink" onClick={() => handleFavorite()}>
                <Icon material="flash_off"></Icon>
              </FabButton>
            : <FabButton color="pink" onClick={() => handleFavorite()}>
                <Icon material="flash_on"></Icon>
              </FabButton>
            }
          </FabButtons>
        </Fab>
      }
      <Actions id="pack-actions">
        {alarmTypes.map(p =>
          p.actor === 'a' || (props.type === 'c' && p.actor === 'c') || (props.type === 's' && p.actor === 'o' && p.isAvailable === isAvailable) ?
            <ActionsButton key={p.id} onClick={() => handleAddAlarm(p.id)}>{p.name}</ActionsButton>
          : ''
        )}
      </Actions>
      <Actions id="offer-options">
        <ActionsButton onClick={() => addToBasket(pack.id)}>{labels.allOffer}</ActionsButton>
        <ActionsButton onClick={() => addToBasket(pack.subPackId)}>{subPackInfo}</ActionsButton>
        {pack.bonusPackId ? <ActionsButton onClick={() => addToBasket(pack.bonusPackId)}>{bonusPackInfo}</ActionsButton> : ''}
      </Actions>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default PackDetails
