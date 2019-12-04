import React, { useContext, useState, useMemo, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Badge, FabButton, FabButtons } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import ReLogin from './ReLogin'
import { StoreContext } from '../data/Store'
import { cancelOrder, cancelOrderRequest, showMessage, showError, getMessage, quantityText } from '../data/Actions'


const OrderDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const order = useMemo(() => state.orders.find(order => order.id === props.id)
  , [state.orders, props.id])
  const netPrice = useMemo(() => order.total + order.fixedFees + order.deliveryFees - order.discount.value
  , [order])
  useEffect(() => {
    if (error) {
      showError(props, error)
      setError('')
    }
  }, [error, props])

  const handleEdit = async () => {
    try{
      if (state.basket.length > 0) {
        throw new Error('basketIsNotEmpty')
      }
      await cancelOrder(order)
      dispatch({type: 'LOAD_BASKET', basket: order.basket})
      props.f7router.navigate('/basket/')
		} catch (err){
      setError(getMessage(err, state.labels, props.f7route.route.component.name))
    }
  }
  const handleDelete = () => {
    props.f7router.app.dialog.confirm(state.labels.confirmationText, state.labels.confirmationTitle, async () => {
      try{
        if (order.status === 'n') {
          await cancelOrder(order)
          showMessage(props, state.labels.deleteSuccess)
        } else {
          if (state.cancelOrders.find(o => o.order.id === order.id && o.status === 'n')){
            throw new Error('duplicateOrderCancel')
          }
          await cancelOrderRequest(order)
          showMessage(props, state.labels.sendSuccess)
        }
        props.f7router.back()
      } catch(err) {
        setError(getMessage(err, state.labels, props.f7route.route.component.name))
      }
    })    
  }
  if (!user) return <ReLogin />
  return(
    <Page>
      <Navbar title={state.labels.orderDetails} backLink={state.labels.back} />
      <Block>
        <List mediaList>
          {order.basket && order.basket.map(p => {
            const packInfo = state.packs.find(pa => pa.id === p.packId)
            const productInfo = state.products.find(pr => pr.id === packInfo.productId)
            return (
              <ListItem
                key={p.packId}
                title={productInfo.name}
                subtitle={packInfo.name}
                footer={`${state.labels.price}: ${p.actualPrice && p.actualPrice !== p.price ? `${state.labels.orderPrice}: ${(p.price / 1000).toFixed(3)}` : ''}`}
                text={quantityText(p.quantity, state.labels)}
                after={((p.actualPrice ? p.actualPrice : p.price) * p.quantity / 1000).toFixed(3)}
              >
                {p.quantity > 1 ? <Badge slot="title" color="red">{p.quantity}</Badge> : ''}
              </ListItem>
            )}
          )}
          <ListItem 
            title={state.labels.total} 
            className="total"
            after={(order.total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={state.labels.fixedFees} 
            className="fees" 
            after={(order.fixedFees / 1000).toFixed(3)} 
          />
          {order.deliveryFees > 0 ? 
            <ListItem 
              title={state.labels.deliveryFees} 
              className="fees" 
              after={(order.deliveryFees / 1000).toFixed(3)} 
            /> 
          : ''}
          {order.discount.value ? 
            <ListItem 
              title={state.labels.discount} 
              className="discount" 
              after={((order.discount.value) / 1000).toFixed(3)} 
            /> 
          : ''}
          <ListItem 
            title={state.labels.net} 
            className="net" 
            after={(netPrice / 1000).toFixed(3)} 
          />
        </List>
      </Block>
      {order.status === 'd' ? '' :
        <Fab position="left-top" slot="fixed" color="blue" className="top-fab">
          <Icon material="keyboard_arrow_down"></Icon>
          <Icon material="close"></Icon>
          <FabButtons position="bottom">
            {order.status === 'n' ?
              <FabButton color="blue" onClick={() => handleEdit()}>
                <Icon material="edit"></Icon>
              </FabButton>
            : ''}
            <FabButton color="red" onClick={() => handleDelete()}>
              <Icon material="delete"></Icon>
            </FabButton>
          </FabButtons>
        </Fab>
      }
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default OrderDetails
