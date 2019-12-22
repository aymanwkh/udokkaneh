import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge, Fab, Icon, Toggle } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store';
import { confirmOrder, showMessage, showError, getMessage, quantityText } from '../data/Actions'


const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [withDelivery, setWithDelivery] = useState(state.customer.withDelivery || false)
  const [urgent, setUrgent] = useState(false)
  const customerLocation = useMemo(() => state.customer.locationId ? state.locations.find(l => l.id === state.customer.locationId) : ''
  , [state.locations, state.customer])
  const [deliveryFees, setDeliveryFees] = useState(customerLocation ? customerLocation.deliveryFees : '')
  const [error, setError] = useState('')
  const basket = useMemo(() => state.basket.map(p => {
    const packInfo = state.packs.find(pa => pa.id === p.packId)
    return {
      ...p,
      price: packInfo.price,
      oldPrice: p.price,
      name: packInfo.name,
      productId: packInfo.productId,
      byWeight: packInfo.byWeight
    }
  }), [state.packs, state.basket])
  const total = useMemo(() => basket.reduce((sum, p) => sum + parseInt(p.price * p.quantity), 0)
  , [basket])
  const fixedFees = useMemo(() => Math.ceil(((urgent ? 1.5 : 1) * state.labels.fixedFees / 100 * total) / 50) * 50
  , [total, urgent, state.labels])
  const discount = useMemo(() => {
    let discount = {value: 0, type: ''}
    const orders = state.orders.filter(o => o.status !== 'c')
    if (orders.length === 0) {
      discount.type = 'f'
      discount.value = fixedFees
    } else if (state.customer.discounts > 0) {
      discount.type = 'p'
      discount.value = Math.min(state.customer.discounts, fixedFees, state.labels.maxDiscount)
    }
    return discount
  }, [state.orders, state.customer, fixedFees, state.labels.maxDiscount]) 
  const fraction = total - Math.floor(total / 50) * 50
  discount.value = discount.value + fraction
  const weightedPacks = useMemo(() => basket.filter(p => p.byWeight)
  , [basket])
  useEffect(() => {
    if (withDelivery) {
      setDeliveryFees(customerLocation ? (urgent ? 1.5 : 1) * customerLocation.deliveryFees : '')
    } else {
      setDeliveryFees('')
    }
  }, [withDelivery, urgent, customerLocation])
  useEffect(() => {
    if (error) {
      showError(props, error)
      setError('')
    }
  }, [error, props])

  const handleOrder = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      const totalOrders = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (totalOrders + total > state.customer.orderLimit) {
        throw new Error('limitOverFlow')
      }
      let packs = basket.filter(p => p.price > 0)
      packs = packs.map(p => {
        return {
          packId: p.packId,
          price: p.price,
          quantity: p.quantity,
          gross: parseInt(p.price * p.quantity),
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
        total
      }
      await confirmOrder(order)
      showMessage(props, state.labels.confirmSuccess)
      props.f7router.navigate('/home/', {reloadAll: true})
      dispatch({ type: 'CLEAR_BASKET' })
    } catch (err){
      setError(getMessage(props, err))
    }
  }
  if (!user) return <ReLogin />
  return (
    <Page>
      <Navbar title={state.labels.confirmOrder} backLink={state.labels.back} />
      <Block>
        <List>
          {basket && basket.map(p => {
            const productInfo = state.products.find(pr => pr.id === p.productId)
            return(
              <ListItem
                key={p.packId}
                title={productInfo.name}
                after={`${(parseInt(p.price * p.quantity) / 1000).toFixed(3)} ${p.byWeight ? '*' : ''}`}
                footer={p.name}
              >
                <Badge slot="title" color="green">{quantityText(p.quantity)}</Badge>
                {p.price === p.oldPrice ? '' : <Badge slot="after" color="red">{p.price === 0 ? state.labels.unAvailableNote : state.labels.changePriceNote}</Badge>}
              </ListItem>
            )
          })}
          <ListItem 
            title={state.labels.total} 
            className="total" 
            after={(total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={state.labels.fixedFeesTitle} 
            className="fees" 
            after={(fixedFees / 1000).toFixed(3)} 
          />
          {withDelivery ? 
            <ListItem 
              title={state.labels.deliveryFees} 
              className="fees" 
              after={(deliveryFees / 1000).toFixed(3)} 
            /> 
          : ''}
          {discount.value + fraction > 0 ? 
            <ListItem 
              title={state.labels.discount}
              className="discount" 
              after={((discount.value + fraction)/ 1000).toFixed(3)} 
            /> 
          : ''}
          <ListItem 
            title={state.labels.net} 
            className="net" 
            after={((total + fixedFees + deliveryFees - discount.value - fraction) / 1000).toFixed(3)} 
          />
          <ListItem>
            <span>{state.labels.withDelivery}</span>
            <Toggle 
              name="withDelivery" 
              color="green" 
              checked={withDelivery} 
              onToggleChange={() => setWithDelivery(!withDelivery)}
              disabled={customerLocation ? !customerLocation.hasDelivery : false}
            />
          </ListItem>
          <ListItem>
            <span>{state.labels.urgent}</span>
            <Toggle 
              name="urgent" 
              color="green" 
              checked={urgent} 
              onToggleChange={() => setUrgent(!urgent)}
            />
          </ListItem>
        </List>
        <p className="note">{weightedPacks.length > 0 ? state.labels.weightedPricesNote : ''}</p>
        <p className="note">{withDelivery ? (urgent ? state.labels.withUrgentDeliveryNote : state.labels.withDeliveryNote) : (urgent ? state.labels.urgentNoDeliveryNote : state.labels.noDeliveryNote)}</p>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={state.labels.confirm} color="green" onClick={() => handleOrder()}>
        <Icon material="done"></Icon>
      </Fab>
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default ConfirmOrder
