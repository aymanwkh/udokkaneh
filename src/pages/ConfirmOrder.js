import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge, Fab, Icon, Toggle } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store';
import { confirmOrder, showMessage, showError, getMessage } from '../data/Actions'


const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [withDelivery, setWithDelivery] = useState(state.customer.withDelivery || false)
  const customerLocation = useMemo(() => state.customer.locationId ? state.locations.find(l => l.id === state.customer.locationId) : ''
  , [state.locations, state.customer])
  const [deliveryFees, setDeliveryFees] = useState(customerLocation ? customerLocation.deliveryFees : '')
  const [error, setError] = useState('')
  const total = useMemo(() => state.basket.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  , [state.basket])
  const fixedFees = useMemo(() => parseInt((state.labels.fixedFeesPercent / 100) * total)
  , [total, state.labels])
  const discount = useMemo(() => {
    let discount = {value: 0, type: ''}
    const orders = state.orders.filter(o => o.status !== 'c')
    if (orders.length === 0) {
      discount.type = 'f'
      discount.value = fixedFees
    } else if (state.customer.specialDiscountPercent) {
      discount.type = 's'
      discount.value = (state.customer.specialDiscountPercent / 100) * total
    } else if (state.customer.discounts > 0) {
      discount.type = 'p'
      discount.value = Math.min(state.customer.discounts, fixedFees, state.labels.maxDiscount)
    }
    return discount
  }, [state.orders, state.customer, fixedFees, total, state.labels.maxDiscount]) 
  const net = useMemo(() => Math.floor((total + fixedFees + deliveryFees - discount.value) / 50) * 50
  , [total, fixedFees, discount, deliveryFees])
  useEffect(() => {
    if (withDelivery) {
      setDeliveryFees(customerLocation ? customerLocation.deliveryFees : '')
    } else {
      setDeliveryFees('')
    }
  }, [withDelivery, customerLocation])
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
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f'].includes(o.status))
      const totalOrders = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (totalOrders + net > state.customer.orderLimit) {
        throw new Error('limitOverFlow')
      }
      const order = {
        basket: state.basket,
        fixedFees: parseInt((state.labels.fixedFeesPercent / 100) * total),
        deliveryFees,
        discount,
        withDelivery,
        total
      }
      await confirmOrder(order)
      showMessage(props, state.labels.confirmSuccess)
      props.f7router.navigate('/home/', {reloadAll: true})
      dispatch({ type: 'CLEAR_BASKET' })
    } catch (err){
      setError(getMessage(err, state.labels, props.f7route.route.component.name))
    }
  }
  if (!user) return <ReLogin />
  return (
    <Page>
      <Navbar title={state.labels.confirmOrder} backLink={state.labels.back} />
      <Block>
        <List>
          {state.basket && state.basket.map(p => {
            const packInfo = state.packs.find(pa => pa.id === p.packId)
            return(
              <ListItem
                key={p.packId}
                title={state.products.find(pr => pr.id === packInfo.productId).name}
                after={(p.price * p.quantity / 1000).toFixed(3)}
                footer={packInfo.name}
              >
                {p.quantity > 1 ? <Badge slot="title" color="red">{p.quantity}</Badge> : ''}
              </ListItem>
            )
          })}
          <ListItem 
            title={state.labels.total} 
            className="total" 
            after={(total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={state.labels.fixedFees} 
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
          {discount.value > 0 ? 
            <ListItem 
              title={state.labels.discount}
              className="discount" 
              after={(discount.value / 1000).toFixed(3)} 
            /> 
          : ''}
          <ListItem 
            title={state.labels.net} 
            className="net" 
            after={(net / 1000).toFixed(3)} 
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
