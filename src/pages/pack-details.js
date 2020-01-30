import React, { useContext, useEffect, useState, useRef } from 'react'
import { f7, Page, Navbar, Card, CardContent, CardHeader, Link, Fab, FabButton, FabButtons, Toolbar, Icon, Actions, ActionsButton, Row } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import RatingStars from './rating-stars'
import { StoreContext } from '../data/store'
import { addAlarm, showMessage, showError, getMessage, updateFavorites, rateProduct } from '../data/actions'
import PackImage from './pack-image'
import labels from '../data/labels'
import { setup, alarmTypes } from '../data/config'
import moment from 'moment'

const PackDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const [pack] = useState(() => state.packs.find(p => p.id === props.id))
  const [hasPurchased, setHasPurchased] = useState('')
  const [isAvailable, setIsAvailable] = useState('')
  const [subPackInfo, setSubPackInfo] = useState('')
  const [bonusPackInfo, setBonusPackInfo] = useState('')
  const [otherProducts, setOtherProducts] = useState('')
  const [otherOffers, setOtherOffers] = useState('')
  const [otherPacks, setOtherPacks] = useState('')
  const offerActions = useRef('')
  const packActions = useRef('')
  useEffect(() => {
    setHasPurchased(() => {
      const deliveredOrders = state.orders.filter(o => ['t', 'f'].includes(o.status) && o.basket.find(p => state.packs.find(pa => pa.id === p.packId)?.productId === pack.productId))
      return deliveredOrders.length
    })
  }, [state.orders, pack, state.packs])
  useEffect(() => {
    setIsAvailable(() => state.customerInfo.storeId && state.storePacks.find(p => p.storeId === state.customerInfo.storeId && p.packId === pack.id) ? 1 : -1)
  }, [state.storePacks, state.customerInfo, pack])
  useEffect(() => {
    setSubPackInfo(() => {
      if (pack.subPackId) {
        const subPack =  state.packs.find(p => p.id === pack.subPackId) || ''
        const price = parseInt(pack.price / pack.subQuantity * pack.subPercent * (1 + setup.profit))
        return `${subPack.productName} ${subPack.name}, ${labels.unitPrice}: ${(price / 1000).toFixed(3)}`
      } else {
        return ''
      }  
    })
    setBonusPackInfo(() => {
      if (pack.bonusPackId) {
        const bonusPack =  state.packs.find(p => p.id === pack.bonusPackId) || ''
        const price = parseInt(pack.price / pack.bonusQuantity * pack.bonusPercent * (1 + setup.profit))
        return `${bonusPack.productName} ${bonusPack.name}, ${labels.unitPrice}: ${(price / 1000).toFixed(3)}`
      } else {
        return ''
      }  
    })
    setOtherProducts(() => state.packs.filter(pa => pa.tag === pack.tag && (pa.sales > pack.sales || pa.rating > pack.rating)))
    setOtherOffers(() => state.packs.filter(pa => pa.productId === pack.productId && pa.id !== pack.id && (pa.isOffer || pa.endOffer)))
    setOtherPacks(() => state.packs.filter(pa => pa.productId === pack.productId && pa.weightedPrice < pack.weightedPrice))
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
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.basket.find(p => p.packId === packId)) {
        throw new Error('alreadyInBasket')
      }
      let purchasedPack = pack
      let price, maxQuantity
      if (packId !== pack.id) {
        purchasedPack = state.packs.find(p => p.id === packId) || ''
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
      const orderLimit = state.customerInfo.orderLimit || setup.orderLimit
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'd', 'p'].includes(o.status))
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
            if (state.customerInfo.isBlocked) {
              throw new Error('blockedUser')
            }
            const alarm = {
              packId: props.id,
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
        if (state.customerInfo.isBlocked) {
          throw new Error('blockedUser')
        }
        if (state.userInfo.alarms?.find(a => a.packId === props.id && a.status === 'n')){
          throw new Error('duplicateAlarms')
        }
        props.f7router.navigate(`/add-alarm/${props.id}/type/${alarmTypeId}`)
      }  
    } catch(err) {
      setError(getMessage(props, err))
    }
  }
  const handleFavorite = async () => {
    try{
      setInprocess(true)
      await updateFavorites(state.userInfo, pack.productId)
      setInprocess(false)
      showMessage(state.userInfo?.favorites?.includes(pack.productId) ? labels.addFavoriteSuccess : labels.removeFavoriteSuccess)
		} catch (err){
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }
  const handleRate = async value => {
    try{
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      setInprocess(true)
      await rateProduct(state.userInfo, pack.productId, value)
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
                <Link iconMaterial="warning" iconColor="red" onClick={() => packActions.current.open()} />
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
        onClick={() => pack.isOffer ? offerActions.current.open() : addToBasket(pack.id)}
      >
        <Icon material="add"></Icon>
      </Fab>
      {user ?
        <Fab position="left-top" slot="fixed" color="blue" className="top-fab">
          <Icon material="favorite_border"></Icon>
          <Icon material="close"></Icon>
          <FabButtons position="bottom">
            {!pack.trademark || hasPurchased === 0 || state.userInfo.ratings?.find(r => r.productId === pack.productId) ? '' : 
              <FabButton color="green" onClick={() => handleRate(1)}>
                <Icon material="thumb_up"></Icon>
              </FabButton>
            }
            {!pack.trademark || hasPurchased === 0 || state.userInfo.ratings?.find(r => r.productId === pack.productId) ? '' : 
              <FabButton color="red" onClick={() => handleRate(0)}>
                <Icon material="thumb_down"></Icon>
              </FabButton>
            }
            {state.userInfo.favorites?.includes(pack.id) ? 
              <FabButton color="pink" onClick={() => handleFavorite()}>
                <Icon material="flash_off"></Icon>
              </FabButton>
            : <FabButton color="pink" onClick={() => handleFavorite()}>
                <Icon material="flash_on"></Icon>
              </FabButton>
            }
          </FabButtons>
        </Fab>
      : ''}
      <Actions ref={packActions}>
        {otherProducts.length === 0 ? '' :
          <ActionsButton onClick={() => props.f7router.navigate(`/hints/${pack.id}/type/p`)}>{labels.otherProducts}</ActionsButton>
        }
        {otherOffers.length === 0 ? '' :
          <ActionsButton onClick={() => props.f7router.navigate(`/hints/${pack.id}/type/o`)}>{labels.otherOffers}</ActionsButton>
        }
        {otherPacks.length === 0 ? '' :
          <ActionsButton onClick={() =>props.f7router.navigate(`/hints/${pack.id}/type/w`)}>{labels.otherPacks}</ActionsButton>
        }
        {alarmTypes.map(p =>
          (props.type === 'c' && p.actor === 'c' && !state.customerInfo.storeId) || (props.type === 'o' && p.actor === 'o' && state.customerInfo.storeId && (p.isAvailable === 0 || p.isAvailable === isAvailable)) ?
            <ActionsButton key={p.id} onClick={() => handleAddAlarm(p.id)}>{p.name}</ActionsButton>
          : ''
        )}
      </Actions>
      <Actions ref={offerActions}>
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
