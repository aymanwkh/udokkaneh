import React, { useContext, useState, useEffect } from 'react'
import { f7, Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Link } from 'framework7-react'
import { StoreContext } from '../data/store'
import { confirmOrder, showMessage, showError, getMessage, quantityText, getBasket } from '../data/actions'
import labels from '../data/labels'
import { setup } from '../data/config'

const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const [basket, setBasket] = useState([])
  const [total, setTotal] = useState('')
  const [fixedFees, setFixedFees] = useState('')
  const [fraction, setFraction] = useState('')
  const [discount, setDiscount] = useState('')
  const [weightedPacks, setWeightedPacks] = useState('')
  const [locationFees] = useState(() => state.locations.find(l => l.id === state.userInfo.locationId)?.fees)
  const [deliveryFees] = useState(state.customerInfo.deliveryFees || locationFees)
  useEffect(() => {
    setBasket(getBasket(state.basket, state.packs))
  }, [state.basket, state.packs])

  useEffect(() => {
    setTotal(() => basket.reduce((sum, p) => sum + Math.trunc(p.price * p.quantity), 0))
    setWeightedPacks(() => basket.filter(p => p.byWeight))
  }, [basket])
  useEffect(() => {
    setFixedFees(() => Math.trunc(setup.fixedFees * total))
  }, [total])
  useEffect(() => {
    setFraction((total + fixedFees) - Math.floor((total + fixedFees) / 50) * 50)
  }, [total, fixedFees])
  useEffect(() => {
    setDiscount(() => {
      const orders = state.orders.filter(o => o.status !== 'c')
      let discount = {
        value: 0,
        type: 'n'
      }
      if (orders.length === 0) {
        discount.value = setup.firstOrderDiscount
        discount.type = 'f'
      } else if (state.customerInfo.discounts > 0) {
        discount.value = Math.min(state.customerInfo.discounts, setup.maxDiscount)
        discount.type = 'o'
      } else if (state.customerInfo.specialDiscount > 0) {
        discount.value = state.customerInfo.specialDiscount
        discount.type = 's'
      }
      return discount
    }) 
  }, [state.orders, state.customerInfo])

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

  const handleConfirm = async () => {
    try{
      if (state.adverts[0]?.type === 'n') {
        showMessage(state.adverts[0].text)
        return
      }
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      const orderLimit = state.customerInfo.orderLimit || setup.orderLimit
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      const totalOrders = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (totalOrders + total > orderLimit) {
        throw new Error('limitOverFlow')
      }
      let packs = basket.filter(p => p.price > 0)
      packs = packs.map(p => {
        const pack = {
          packId: p.packId,
          productName: p.productName,
          productAlias: p.productAlias,
          packName: p.packName,
          imageUrl: p.imageUrl,
          price: p.price,
          quantity: p.quantity,
          gross: Math.trunc(p.price * p.quantity),
          offerId: p.offerId || '',
          purchased: 0,
          withBestPrice: p.withBestPrice,
          status: 'n'
        }
        if (p.subQuantity) pack['subQuantity'] = p.subQuantity
        if (p.bonusPackId) {
          pack['bonusPackId'] = p.bonusPackId
          pack['bonusImageUrl'] = p.bonusImageUrl
          pack['bonusQuantity'] = p.bonusQuantity
        }
        return pack
      })
      const order = {
        basket: packs,
        fixedFees,
        deliveryFees,
        discount,
        total,
        fraction
      }
      setInprocess(true)
      await confirmOrder(order)
      setInprocess(false)
      showMessage(labels.sendSuccess)
      props.f7router.navigate('/home/', {reloadAll: true})
      dispatch({ type: 'CLEAR_BASKET'})
    } catch (err){
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }
  const handleDelete = () => {
    props.f7router.navigate('/home/', {reloadAll: true})
    dispatch({type: 'CLEAR_BASKET'})  
  }

  if (!user) return <Page><h3 className="center"><a href="/login/">{labels.relogin}</a></h3></Page>
  return (
    <Page>
      <Navbar title={labels.sendOrder} backLink={labels.back} />
      <Block>
        <p className="note">{labels.orderHelp} <a href="/help/o">{labels.clickHere}</a></p>
        {locationFees === 0 ? <p className="note">{labels.noDelivery}</p> : ''}
        <List mediaList>
          {basket.map(p => 
            <ListItem
              key={p.packId}
              title={p.productName}
              subtitle={p.productAlias}
              text={p.packName}
              footer={`${labels.priceIncrease}: ${p.withBestPrice ? labels.withBestPrice : labels.noPurchase}`}
              after={p.totalPriceText}
            >
              <div className="list-subtext1">{p.priceText}</div>
              <div className="list-subtext2">{`${labels.quantity}: ${quantityText(p.quantity)}`}</div>
            </ListItem>
          )}
          <ListItem 
            title={labels.total} 
            className="total" 
            after={(total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={labels.fixedFees} 
            className="fees" 
            after={((fixedFees + deliveryFees) / 1000).toFixed(3)} 
          />
          <ListItem 
            title={labels.discount}
            className="discount" 
            after={((discount.value + fraction) / 1000).toFixed(3)} 
          /> 
          <ListItem 
            title={labels.net} 
            className="net" 
            after={((total + fixedFees + deliveryFees - discount.value - fraction) / 1000).toFixed(3)} 
          />
          </List>
        <p className="note">{weightedPacks.length > 0 ? labels.weightedPricesNote : ''}</p>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={labels.send} color="green" onClick={() => handleConfirm()}>
        <Icon material="done"></Icon>
      </Fab>
      <Toolbar bottom>
        <Link href='/home/' iconMaterial="home" />
        <Link href='#' iconMaterial="delete" onClick={() => handleDelete()} />
      </Toolbar>
    </Page>
  )
}
export default ConfirmOrder
