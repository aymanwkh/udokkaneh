import React, { useContext, useState } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge, Fab, Icon} from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store';
import { confirmOrder } from '../data/Actions'


const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const totalPrice = state.basket.reduce((a, product) => a + (product.price * product.quantity), 0)
  const handleOrder = () => {
    const basket = state.basket.map(product => {
      return ({
        id: product.id,
        price: product.price,
        quantity: product.quantity,
        purchasedQuantity: 0
      })
    })
    const order = {
      basket,
      total: totalPrice + 250
    }
    confirmOrder(order).then(() => {
      props.f7router.navigate('/home/')
      dispatch({type: 'CLEAR_BASKET'})
    })
  }
  if (!user) return <ReLogin callingPage="confirmOrder"/>
  return(
    <Page>
      <Navbar title={state.labels.confirmOrder} backLink="Back" />
      <Block>
        <List>
          {state.basket && state.basket.map(product => 
            <ListItem 
              key={product.id} 
              title={product.name} 
              after={(product.price * product.quantity / 1000).toFixed(3)}
              footer={product.description}>
              {product.quantity > 1 ? <Badge slot="title" color="red">{product.quantity}</Badge> : null}
            </ListItem>
          )}
          <ListItem title="Total" className="total" after={(totalPrice / 1000).toFixed(3)} />
          <ListItem title="Delivery" className="delivery" after="0.250" />
          <ListItem title="Net Total" className="net" after={((totalPrice + 250) / 1000).toFixed(3)} />
        </List>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={state.labels.confirm} color="green" onClick={() => handleOrder()}>
          <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
        </Fab>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default ConfirmOrder
