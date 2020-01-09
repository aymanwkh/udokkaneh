import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Toggle } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import ReLogin from './relogin'
import { StoreContext } from '../data/store'
import { confirmOrder, showMessage, showError, getMessage, quantityText } from '../data/actions'
import labels from '../data/labels'
import { setup } from '../data/config'

const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [withDelivery, setWithDelivery] = useState(state.customer.withDelivery || false)
  const [urgent, setUrgent] = useState(false)
  const customerLocation = useMemo(() => state.customer.locationId ? state.locations.find(l => l.id === state.customer.locationId) : ''
  , [state.locations, state.customer])
  const [deliveryFees, setDeliveryFees] = useState('')
  const [error, setError] = useState('')
  const basket = useMemo(() => state.basket.map(p => {
    const packInfo = state.packs.find(pa => pa.id === p.packId)
    let price = packInfo.price
    if (p.offerId) {
      const offerInfo = state.packs.find(pa => pa.id === p.offerId)
      if (offerInfo.subPackId === p.packId) {
        price = parseInt((offerInfo.price / offerInfo.subQuantity) * (offerInfo.subPercent / 100))
      } else {
        price = parseInt((offerInfo.price / offerInfo.bonusQuantity) * (offerInfo.bonusPercent / 100))
      }
    }
    return {
      ...p,
      packInfo,
      price,
      oldPrice: p.price
    }
  }), [state.basket, state.packs])
  const total = useMemo(() => basket.reduce((sum, p) => sum + p.price * p.quantity, 0)
  , [basket])
  const fixedFees = useMemo(() => {
    const offersTotal = basket.reduce((sum, p) => sum + p.offerId ? p.price * p.quantity : 0, 0)
    const fees = Math.ceil(((urgent ? 1.5 : 1) * (setup.fixedFees * (total - offersTotal) + setup.fixedFees * 2 * offersTotal) / 100) / 50) * 50
    const fraction = total - Math.floor(total / 50) * 50
    return fees - fraction
  }, [basket, total, urgent])
  const discount = useMemo(() => {
    const orders = state.orders.filter(o => o.status !== 'c')
    let discount = 0
    if (orders.length === 0) {
      discount = setup.firstOrderDiscount
    } else if (state.customer.discounts > 0) {
      discount = Math.min(state.customer.discounts, setup.maxDiscount)
    }
    return discount
  }, [state.orders, state.customer]) 
  
  const weightedPacks = useMemo(() => basket.filter(p => p.byWeight)
  , [basket])
  useEffect(() => {
    if (withDelivery) {
      setDeliveryFees((customerLocation?.deliveryFees || setup.deliveryFees) * (urgent ? 1.5 : 1) - state.customer.deliveryDiscount)
    } else {
      setDeliveryFees('')
    }
  }, [withDelivery, urgent, customerLocation, state.customer])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const handleConfirm = async () => {
    try{
      const globalNotification = state.notifications.find(n => n.toCustomerId === '0')
      if (globalNotification) {
        showMessage(globalNotification.message)
        return
      }
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.orders.filter(o => o.status === 'n').length > 0) {
        throw new Error('unapprovedOrder')
      }
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      const totalOrders = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (totalOrders + total > (state.customer.orderLimit || setup.orderLimit)) {
        throw new Error('limitOverFlow')
      }
      let packs = basket.filter(p => p.price > 0)
      packs = packs.map(p => {
        return {
          packId: p.packId,
          price: p.price,
          quantity: p.quantity,
          gross: parseInt(p.price * p.quantity),
          offerId: p.offerId || '',
          purchased: 0,
          status: 'n'
        }
      })
      const order = {
        basket: packs,
        fixedFees,
        deliveryFees,
        discount,
        withDelivery,
        urgent,
        total,
        deliveryDiscount: withDelivery ? state.customer.deliveryDiscount : 0
      }
      await confirmOrder(order)
      showMessage(labels.confirmSuccess)
      props.f7router.navigate('/home/', {reloadAll: true})
      dispatch({ type: 'CLEAR_BASKET' })
    } catch (err){
      setError(getMessage(props, err))
    }
  }
  if (!user) return <ReLogin />
  return (
    <Page>
      <Navbar title={labels.confirmOrder} backLink={labels.back} />
      <Block>
        <List mediaList>
          {basket.map(p => 
            <ListItem
              key={p.packId}
              title={p.packInfo.productName}
              subtitle={`${labels.quantity}: ${quantityText(p.quantity)}`}
              text={p.price === p.oldPrice ? '' : p.price === 0 ? labels.unAvailableNote : labels.changePriceNote}
              after={`${(parseInt(p.price * p.quantity) / 1000).toFixed(3)} ${p.packInfo.byWeight ? '*' : ''}`}
            />
          )}
          <ListItem 
            title={labels.total} 
            className="total" 
            after={(total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={labels.fixedFees} 
            className="fees" 
            after={(fixedFees / 1000).toFixed(3)} 
          />
          {withDelivery ? 
            <ListItem 
              title={labels.deliveryFees} 
              className="fees" 
              after={(deliveryFees / 1000).toFixed(3)} 
            /> 
          : ''}
          {discount > 0 ? 
            <ListItem 
              title={labels.discount}
              className="discount" 
              after={(discount / 1000).toFixed(3)} 
            /> 
          : ''}
          <ListItem 
            title={labels.net} 
            className="net" 
            after={((total + fixedFees + deliveryFees - discount) / 1000).toFixed(3)} 
          />
          </List>
          <List form>
          <ListItem>
            <span>{customerLocation?.hasDelivery ? labels.withDelivery : labels.noDelivery}</span>
            {customerLocation?.hasDelivery ?
              <Toggle 
                name="withDelivery" 
                color="green" 
                checked={withDelivery} 
                onToggleChange={() => setWithDelivery(!withDelivery)}
              />
            : ''}
          </ListItem>
          <ListItem>
            <span>{labels.urgent}</span>
            <Toggle 
              name="urgent" 
              color="green" 
              checked={urgent} 
              onToggleChange={() => setUrgent(!urgent)}
            />
          </ListItem>
        </List>
        <p className="note">{weightedPacks.length > 0 ? labels.weightedPricesNote : ''}</p>
        <p className="note">{withDelivery ? (urgent ? labels.withUrgentDeliveryNote : labels.withDeliveryNote) : (urgent ? labels.urgentNoDeliveryNote : labels.withNoDeliveryNote)}</p>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={labels.confirm} color="green" onClick={() => handleConfirm()}>
        <Icon material="done"></Icon>
      </Fab>
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default ConfirmOrder
