import React, { useContext, useEffect, useState, useRef } from 'react'
import { f7, Page, Navbar, Card, CardContent, CardHeader, CardFooter, Fab, Toolbar, Icon, Actions, ActionsButton } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import RatingStars from './rating-stars'
import { StoreContext } from '../data/store'
import { addAlarm, showMessage, showError, getMessage, updateFavorites, productOfText, notifyFriends } from '../data/actions'
import labels from '../data/labels'
import { setup, alarmTypes } from '../data/config'
import moment from 'moment'

const PackDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [pack] = useState(() => state.packs.find(p => p.id === props.id))
  const [packCategory] = useState(() => state.categories.find(c => c.id === pack.categoryId))
  const [isAvailable, setIsAvailable] = useState('')
  const [subPackInfo, setSubPackInfo] = useState('')
  const [bonusPackInfo, setBonusPackInfo] = useState('')
  const [otherProducts, setOtherProducts] = useState('')
  const [otherOffers, setOtherOffers] = useState('')
  const [otherPacks, setOtherPacks] = useState('')
  const offerActions = useRef('')
  const packActions = useRef('')
  useEffect(() => {
    setIsAvailable(() => state.packPrices.find(p => p.storeId === state.customerInfo.storeId && p.packId === pack.id) ? 1 : -1)
  }, [state.packPrices, state.customerInfo, pack])
  useEffect(() => {
    setSubPackInfo(() => {
      if (pack.subPackId) {
        const price = Math.trunc(pack.price / pack.subQuantity * pack.subPercent * (1 + packCategory.minProfit))
        return `${pack.productName} ${pack.subPackName}, ${labels.unitPrice}: ${(price / 1000).toFixed(3)}`
      } else {
        return ''
      }  
    })
    setBonusPackInfo(() => {
      if (pack.bonusPackId) {
        const price = Math.trunc(pack.price / pack.bonusQuantity * pack.bonusPercent * (1 + packCategory.minProfit))
        return `${pack.bonusProductName} ${pack.bonusPackName}, ${labels.unitPrice}: ${(price / 1000).toFixed(3)}`
      } else {
        return ''
      }  
    })
    setOtherProducts(() => state.packs.filter(pa => pa.categoryId === pack.categoryId && (pa.sales > pack.sales || pa.rating > pack.rating)))
    setOtherOffers(() => state.packs.filter(pa => pa.productId === pack.productId && pa.id !== pack.id && (pa.isOffer || pa.endOffer)))
    setOtherPacks(() => state.packs.filter(pa => pa.productId === pack.productId && pa.weightedPrice < pack.weightedPrice))
  }, [pack, state.packs, packCategory])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
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
          price = Math.trunc(pack.price / pack.subQuantity * pack.subPercent * (1 + packCategory.minProfit))
          maxQuantity = pack.subQuantity - 1
          if (pack.bonusPackId) maxQuantity++
        } else  {
          price = Math.trunc(pack.price / pack.bonusQuantity * pack.bonusPercent * (1 + packCategory.minProfit))
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
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      const activeOrdersTotal = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (activeOrdersTotal + purchasedPack.price > orderLimit) {
        throw new Error('limitOverFlow')
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
        f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, () => {
          try{
            if (state.customerInfo.isBlocked) {
              throw new Error('blockedUser')
            }
            const alarm = {
              packId: props.id,
              alarmType: alarmTypeId 
            }
            addAlarm(alarm)
            showMessage(labels.sendSuccess)
            props.f7router.back()
          } catch(err) {
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
  const handleFavorite = () => {
    try{
      updateFavorites(state.userInfo, pack.productId)
      showMessage(state.userInfo?.favorites?.includes(pack.productId) ? labels.removeFavoriteSuccess : labels.addFavoriteSuccess)
		} catch (err){
      setError(getMessage(props, err))
    }
  }
  const handleNotifyFriends = () => {
    try{
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      notifyFriends(pack.id)
      showMessage(labels.sendSuccess)
    } catch(err) {
      setError(getMessage(props, err))
    }
  }
  return (
    <Page>
      <Navbar title={`${pack.productName}${pack.productAlias ? '-' + pack.productAlias : ''}`} backLink={labels.back} />
      <Card>
        <CardHeader className="card-header">
          <div>
            <div className="price">
              {(pack.price / 1000).toFixed(3)}
            </div>
            <span className="list-subtext1">{pack.offerEnd ? `${labels.offerUpTo}: ${moment(pack.offerEnd.toDate()).format('Y/M/D')}` : ''}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="card-title">{pack.name}</p>
          <img src={pack.imageUrl} className="img-card" alt={labels.noImage} />
          <p className="card-title">{pack.productDescription}</p>
        </CardContent>
        <CardFooter>
          <p>{productOfText(pack.trademark, pack.country)}</p>
          <p><RatingStars rating={pack.rating} count={pack.ratingCount} /></p>
        </CardFooter>
      </Card>
      {props.type === 'c' ? 
        <Fab 
          position="center-bottom" 
          slot="fixed" 
          text={`${labels.addToBasket}${pack.isOffer ? '*' : ''}`} 
          color="green" 
          onClick={() => pack.isOffer ? offerActions.current.open() : addToBasket(pack.id)}
        >
          <Icon material="add"></Icon>
        </Fab>
      : ''}
      {user ?
        <Fab position="left-top" slot="fixed" color="red" className="top-fab" onClick={() => packActions.current.open()}>
          <Icon material="menu"></Icon>
        </Fab>
      : ''}
      {props.type === 'c' && pack.isOffer ? <p className="note">{`${labels.offerHintPart1} ${packCategory.minProfit * 100}${labels.offerHintPart2}`}</p> : ''}
      <Actions ref={packActions}>
        {props.type === 'c' ? 
          <React.Fragment>
            <ActionsButton onClick={() => handleFavorite()}>{state.userInfo.favorites?.includes(pack.productId) ? labels.removeFromFavorites : labels.addToFavorites}</ActionsButton>
            {pack.isOffer && state.userInfo.friends?.find(f => f.status === 'r') ? 
              <ActionsButton onClick={() => handleNotifyFriends()}>{labels.notifyFriends}</ActionsButton>
            : ''}
            {otherProducts.length === 0 ? '' :
              <ActionsButton onClick={() => props.f7router.navigate(`/hints/${pack.id}/type/p`)}>{labels.otherProducts}</ActionsButton>
            }
            {otherOffers.length === 0 ? '' :
              <ActionsButton onClick={() => props.f7router.navigate(`/hints/${pack.id}/type/o`)}>{labels.otherOffers}</ActionsButton>
            }
            {otherPacks.length === 0 ? '' :
              <ActionsButton onClick={() =>props.f7router.navigate(`/hints/${pack.id}/type/w`)}>{labels.otherPacks}</ActionsButton>
            }
          </React.Fragment>
        : ''}
        {props.type === 'o' && alarmTypes.map(p =>
          p.isAvailable === 0 || p.isAvailable === isAvailable ?
            <ActionsButton key={p.id} onClick={() => handleAddAlarm(p.id)}>
              {p.name}
            </ActionsButton>
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
