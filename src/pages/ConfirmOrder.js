import React, { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge, Fab, Icon, Toggle } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store';
import { confirmOrder } from '../data/Actions'


const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [withDelivery, setWithDelivery] = useState(state.customer.withDelivery || false)
  const [deliveryFees, setDeliveryFees] = useState(0)
  const total = state.basket.reduce((a, product) => a + (product.price * product.quantity), 0)
  const specialDiscount = state.customerStatus.find(rec => rec.id === state.customer.status).discount
  const customerDiscount = state.customer.discount || 0
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
      specialDiscount,
      customerDiscount,
      withDelivery,
      total
    }
    confirmOrder(order).then(() => {
      props.f7router.navigate('/home/')
      dispatch({ type: 'CLEAR_BASKET' })
    })
  }
  if (!user) return <ReLogin callingPage="confirmOrder" />
  return (
    <Page>
      <Navbar title={state.labels.confirmOrder} backLink="Back" />
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
          {deliveryFees > 0 ? <ListItem title={state.labels.deliveryFees} className="fees" after={(deliveryFees / 1000).toFixed(3)} /> : null}
          {specialDiscount + customerDiscount > 0 ? <ListItem title={state.labels.discount} className="discount" after={((specialDiscount + customerDiscount) / 1000).toFixed(3)} /> : null}
          <ListItem title={state.labels.net} className="net" after={((total + state.labels.fixedFees + deliveryFees - (specialDiscount + customerDiscount)) / 1000).toFixed(3)} />
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
