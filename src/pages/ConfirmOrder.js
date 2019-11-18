import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge, Fab, Icon, Toggle } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store';
import { confirmOrder, showMessage } from '../data/Actions'


const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [withDelivery, setWithDelivery] = useState(state.customer.withDelivery || false)
  const customerLocation = useMemo(() => state.customer.locationId ? state.locations.find(rec => rec.id === state.customer.locationId) : ''
  , [state.locations, state.customer])
  const [deliveryFees, setDeliveryFees] = useState(customerLocation ? customerLocation.deliveryFees : '')
  const [error, setError] = useState('')
  const total = useMemo(() => {
    const total = state.basket.reduce((a, pack) => a + (pack.price * pack.quantity), 0)
    return Math.floor(total / 50) * 50
  }, [state.basket])

  const discount = useMemo(() => {
    let discount = {value: 0, type: ''}
    if (state.orders.length === 0) {
      discount.value = state.discountTypes.find(rec => rec.id === 'f').value
      discount.type = 'f'
    } else if (state.customer.type === 's') {
      discount.value = state.discountTypes.find(rec => rec.id === 's').value
      discount.type = 's'
    } else if (state.customer.invitationsDiscount > 0) {
      discount.value = Math.min(state.customer.invitationsDiscount, state.labels.maxDiscount)
      discount.type = 'i'
    } else if (state.customer.priceAlarmsDiscount > 0) {
      discount.value = Math.min(state.customer.priceAlarmsDiscount, state.labels.maxDiscount)
      discount.type = 'p'
    }
    return discount
  }, [state.orders, state.customer, state.discountTypes, state.labels]) 
  const net = useMemo(() => ((total + state.labels.fixedFeesValue + deliveryFees - discount.value) / 1000).toFixed(3)
  , [total, discount, deliveryFees, state.labels])
  useEffect(() => {
    if (withDelivery) {
      setDeliveryFees(customerLocation ? customerLocation.deliveryFees : '')
    } else {
      setDeliveryFees('')
    }
  }, [withDelivery, customerLocation])
  useEffect(() => {
    if (error) {
      showMessage(props, 'error', error)
      setError('')
    }
  }, [error, props])

  const handleOrder = () => {
    try{
      const activeOrders = state.orders.filter(rec => ['n', 'a', 's'].includes(rec.status))
      const totalOrders = activeOrders.reduce((a, order) => a + (order.total + order.fixedFees + order.deliveryFees - order.discount.value), 0)
      if ((totalOrders + (net * 1000)) > state.customer.limit) {
        throw new Error(state.labels.limitOverFlow)
      }
      const basket = state.basket.map(pack => {
        return ({
          id: pack.id,
          price: pack.price,
          quantity: pack.quantity,
          purchasedQuantity: 0
        })
      })
      const order = {
        basket,
        fixedFees: state.labels.fixedFeesValue,
        deliveryFees,
        discount,
        withDelivery,
        total
      }
      confirmOrder(order).then(() => {
        showMessage(props, 'success', state.labels.confirmSuccess)
        props.f7router.navigate('/home/', {reloadAll: true})
        dispatch({ type: 'CLEAR_BASKET' })
      })  
    } catch (err){
      setError(err.message)
    }
  }
  if (!user) return <ReLogin callingPage="confirmOrder" />
  return (
    <Page>
      <Navbar title={state.labels.confirmOrder} backLink={state.labels.back} />
      <Block>
        <List>
          {state.basket && state.basket.map(pack => 
            <ListItem
              key={pack.id}
              title={state.products.find(rec => rec.id === pack.productId).name}
              after={(pack.price * pack.quantity / 1000).toFixed(3)}
              footer={pack.name}>
              {pack.quantity > 1 ? <Badge slot="title" color="red">{pack.quantity}</Badge> : null}
            </ListItem>
          )}
          <ListItem 
            title={state.labels.total} 
            className="total" 
            after={(total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={state.labels.feesTitle} 
            className="fees" 
            after={(state.labels.fixedFeesValue / 1000).toFixed(3)} 
          />
          {withDelivery ? 
            <ListItem 
              title={state.labels.deliveryFees} 
              className="fees" 
              after={(deliveryFees / 1000).toFixed(3)} 
            /> 
          : ''}
          {discount.value > 0 ? 
            <ListItem 
              title={state.discountTypes.find(rec => rec.id === discount.type).name} 
              className="discount" 
              after={(discount.value / 1000).toFixed(3)} 
            /> 
          : ''}
          <ListItem 
            title={state.labels.net} 
            className="net" 
            after={net} 
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
        </List>
        <p className="note">{withDelivery ? state.labels.withDeliveryNote : state.labels.noDeliveryNote}</p>
      </Block>
      {state.customer.type === 'b' ? '' : 
        <Fab position="center-bottom" slot="fixed" text={state.labels.confirm} color="green" onClick={() => handleOrder()}>
          <Icon material="done"></Icon>
        </Fab>
      }
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default ConfirmOrder
