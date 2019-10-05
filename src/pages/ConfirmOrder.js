import React, { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge, Fab, Icon, Toggle } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store';
import { confirmOrder, showMessage } from '../data/Actions'


const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [withDelivery, setWithDelivery] = useState(state.customer.withDelivery || false)
  const [deliveryFees, setDeliveryFees] = useState(state.customer.deliveryFees || 0)
  const total = state.basket.reduce((a, product) => a + (product.price * product.quantity), 0)
  let discount = {value: 0, type: ''}
  if (state.orders.length === 0) {
    discount.value = state.labels.firstOrderDiscount
    discount.type = 'f'
  } else if (state.customer.type === 's') {
    discount.value = state.labels.specialDiscount
    discount.type = 's'
  } else if (state.customer.invitationsDiscount > 0) {
    discount.value = Math.min(state.customer.invitationsDiscount, state.labels.maxDiscount)
    discount.type = 'i'
  } else if (state.customer.lessPriceDiscount > 0) {
    discount.value = Math.min(state.customer.lessPriceDiscount, state.labels.maxDiscount)
    discount.type = 'l'
  }
  useEffect(() => {
    if (withDelivery) {
      setDeliveryFees(state.customer.deliveryFees || 0)
    } else {
      setDeliveryFees(0)
    }
  }, [withDelivery])
  const handleOrder = () => {
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
      fixedFees: state.labels.fixedFees,
      deliveryFees,
      discount,
      withDelivery,
      total
    }
    confirmOrder(order).then(() => {
      showMessage(props, 'success', state.labels.confirmSuccess)
      props.f7router.navigate('/home/')
      dispatch({ type: 'CLEAR_BASKET' })
    })
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
          <ListItem>
            <span>{state.labels.delivery}</span>
            <Toggle 
              name="withDelivery" 
              color="green" 
              checked={withDelivery} 
              onToggleChange={() => setWithDelivery(!withDelivery)}
            />
          </ListItem>
          <ListItem title={state.labels.total} className="total" after={(total / 1000).toFixed(3)} />
          <ListItem title={state.labels.feesTitle} className="fees" after={(state.labels.fixedFees / 1000).toFixed(3)} />
          {deliveryFees > 0 ? <ListItem title={state.labels.deliveryFees} className="fees" after={(deliveryFees / 1000).toFixed(3)} /> : ''}
          {discount.value > 0 ? <ListItem title={state.discountTypes.find(rec => rec.id === discount.type).name} className="discount" after={(discount.value / 1000).toFixed(3)} /> : ''}
          <ListItem title={state.labels.net} className="net" after={((total + state.labels.fixedFees + deliveryFees - discount.value) / 1000).toFixed(3)} />
        </List>
        <p className="note">{withDelivery ? state.labels.withDeliveryNote : state.labels.noDeliveryNote}</p>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={state.labels.confirm} color="green" onClick={() => handleOrder()}>
        <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
      </Fab>
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default React.memo(ConfirmOrder)
