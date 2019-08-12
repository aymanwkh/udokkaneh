import React, { useContext, useState } from 'react'
import { editOrder } from '../data/Actions'
import { Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Badge} from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store';


const OrderDetails = props => {
  const { state, user, orders, products, dispatch } = useContext(StoreContext)
  const order = orders.find(order => order.id === props.id)
  const [error, setError] = useState('')
  const handleEdit = () => {
    if (state.basket.length > 0) {
      setError('your basket must be empty')
      return
    }
    editOrder(order).then(() => {
      dispatch({type: 'LOAD_BASKET', order})
      props.f7router.navigate('/basket/')
    })
  }


  if (!user) return <ReLogin callingPage="order"/>
  return(
    <Page>
      <Navbar title={state.labels.orderDetails} backLink="Back" />
      <Block>
        <List>
          {order.basket && order.basket.map(product => {
            const productInfo = products.find(rec => rec.id === product.id)
            return (
              <ListItem 
                key={product.id} 
                title={productInfo.name} 
                footer={productInfo.description}
                after={parseFloat(product.price * product.quantity).toFixed(3)}
              >
                {product.quantity > 1 ? <Badge slot="title" color="red">{product.quantity}</Badge> : null}
              </ListItem>
            )}
          )}
          <ListItem title="Total" className="total" after={parseFloat(order.total - 0.250).toFixed(3)} />
          <ListItem title="Delivery" className="delivery" after="0.250" />
          <ListItem title="Net Total" className="net" after={order.total} />
        </List>
      </Block>
      <Block strong className="error">
        <p>{error}</p>
      </Block>
      { order.status === 'n' ? 
        <Fab position="left-bottom" slot="fixed" color="red" onClick={() => handleEdit()}>
          <Icon ios="f7:edit" aurora="f7:edit" md="material:edit"></Icon>
        </Fab>
        : null
      }
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default OrderDetails
