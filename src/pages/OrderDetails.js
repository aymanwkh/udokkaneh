import React, { useContext, useState, useMemo, useEffect } from 'react'
import { editOrder, showMessage } from '../data/Actions'
import { Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Badge} from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store'


const OrderDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const order = useMemo(() => state.orders.find(order => order.id === props.id)
  , [state.orders, props.id])
  const netPrice = useMemo(() => order.total + order.fixedFees + order.deliveryFees - (order.specialDiscount + order.customerDiscount)
  , [order])
  useEffect(() => {
    if (error) {
      showMessage(props, 'error', error)
      setError('')
    }
  }, [error, props])

  const handleEdit = () => {
    try{
      if (state.basket.length > 0) {
        throw new Error(state.labels.basketIsNotEmpty)
      }
      editOrder(order).then(() => {
        dispatch({type: 'LOAD_BASKET', order})
        props.f7router.navigate('/basket/')
      })
		} catch(err) {
			err.code ? setError(state.labels[err.code.replace(/-|\//g, '_')]) : setError(err.message)
		}
  }


  if (!user) return <ReLogin callingPage="order"/>
  return(
    <Page>
      <Navbar title={state.labels.orderDetails} backLink={state.labels.back} />
      <Block>
        <List>
          {order.basket && order.basket.map(p => {
            const packInfo = state.packs.find(pa => pa.id === p.id)
            const productInfo = state.products.find(pr => pr.id === packInfo.productId)
            return (
              <ListItem 
                key={p.id} 
                title={productInfo.name} 
                footer={packInfo.name}
                after={(p.price * p.quantity / 1000).toFixed(3)}
              >
                {p.quantity > 1 ? <Badge slot="title" color="red">{p.quantity}</Badge> : ''}
              </ListItem>
            )}
          )}
          <ListItem title={state.labels.total} after={(order.total / 1000).toFixed(3)} />
          <ListItem title={state.labels.feesTitle} className="red" after={(order.fixedFees / 1000).toFixed(3)} />
          {order.deliveryFees > 0 ? <ListItem title={state.labels.deliveryFees} className="red" after={(order.deliveryFees / 1000).toFixed(3)} /> : null}
          {order.specialDiscount + order.customerDiscount > 0 ? <ListItem title={state.labels.discount} className="discount" after={((order.specialDiscount + order.customerDiscount) / 1000).toFixed(3)} /> : null}
          <ListItem title={state.labels.net} className="blue" after={(netPrice / 1000).toFixed(3)} />
        </List>
      </Block>
      {order.status === 'n' ? 
        <Fab position="left-bottom" slot="fixed" color="red" onClick={() => handleEdit()}>
          <Icon material="edit"></Icon>
        </Fab>
        : ''
      }
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default OrderDetails
