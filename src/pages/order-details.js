import React, { useContext, useState, useEffect, useRef } from 'react'
import { f7, Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Actions, ActionsButton } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import { cancelOrder, mergeOrders, addOrderRequest, showMessage, showError, getMessage, quantityDetails } from '../data/actions'
import labels from '../data/labels'
import { orderPackStatus } from '../data/config'

const OrderDetails = props => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(() => state.orders.find(o => o.id === props.id))
  const [orderBasket, setOrderBasket] = useState([])
  const [lastOrder, setLastOrder] = useState('')
  const orderActions = useRef('')
  useEffect(() => {
    setOrder(() => state.orders.find(o => o.id === props.id))
  }, [state.orders, props.id])
  useEffect(() => {
    setOrderBasket(() => order.basket.map(p => {
      const priceNote = p.actual && p.actual !== p.price ? `${labels.orderPrice}: ${(p.price / 1000).toFixed(3)}, ${labels.currentPrice}: ${(p.actual / 1000).toFixed(3)}` : `${labels.unitPrice}: ${(p.price / 1000).toFixed(3)}`
      const statusNote = `${orderPackStatus.find(s => s.id === p.status).name} ${p.overPriced ? labels.overPricedNote : ''}`
      return {
        ...p,
        priceNote,
        statusNote
      }
    }))
    setLastOrder(() => {
      const orders = state.orders.filter(o => o.id !== order.id)
      orders.sort((o1, o2) => o2.time.seconds - o1.time.seconds)
      return ['n', 'a', 'e'].includes(orders[0]?.status) ? orders[0] : ''
    })
  }, [order, state.orders])
 
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleEdit = () => {
    try{
      if (order.status !== 'n' && order.requestType) {
        throw new Error('duplicateOrderRequest')
      }
      props.f7router.navigate(`/edit-order/${order.id}`)
    } catch(err) {
      setError(getMessage(props, err))
    }
  }
  const handleDelete = () => {
    f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, () => {
      try{
        if (order.status === 'n') {
          cancelOrder(order)
          showMessage(labels.deleteSuccess)
          props.f7router.back()
        } else {
          if (order.requestType) {
            throw new Error('duplicateOrderRequest')
          }
          addOrderRequest(order, 'c')
          showMessage(labels.sendSuccess)
          props.f7router.back()
        }
      } catch(err) {
        setError(getMessage(props, err))
      }
    })    
  }
  const handleMerge = async () => {
    try{
      if (lastOrder.status !== 'n' && lastOrder.requestType) {
        throw new Error('duplicateOrderRequest')
      }
      let found
      for (let p of order.basket) {
        found = lastOrder.basket.find(bp => bp.packId === p.packId)
        if (found && found.price !== p.price) {
          throw new Error('samePackWithDiffPrice')
        }
        if (found && found.weight > 0 && state.packs.find(pa => pa.id === p.packId).isDivided) {
          throw new Error('samePackPurchasedByWeight')
        }
      }
      if (lastOrder.status === 'n') {
        mergeOrders(lastOrder, order)
        showMessage(labels.mergeSuccess)
      } else {
        addOrderRequest(lastOrder, 'm', order)
        showMessage(labels.sendSuccess)  
      }
      props.f7router.back()
    } catch(err) {
      setError(getMessage(props, err))
    }
  }
  return(
    <Page>
      <Navbar title={labels.orderDetails} backLink={labels.back} />
      {['n', 'a', 'e'].includes(order.status) ? 
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => orderActions.current.open()}>
          <Icon material="menu"></Icon>
        </Fab>
      : ''}
      <Block>
        <List mediaList>
          {orderBasket.map(p => 
            <ListItem 
              key={p.packId} 
              title={p.productName}
              subtitle={p.productAlias}
              text={p.packName}
              footer={`${labels.status}: ${p.statusNote}`}
              after={(p.gross / 1000).toFixed(3)}
            >
              <div className="list-subtext1">{p.priceNote}</div>
              <div className="list-subtext2">{quantityDetails(p)}</div>
              <div className="list-subtext3">{`${labels.priceIncrease}: ${p.priceLimit === p.price ? labels.noPurchase : labels.priceLimit + ' ' + (p.priceLimit / 1000).toFixed(3)}`}</div>
            </ListItem>
          )}
          <ListItem 
            title={labels.total} 
            className="total"
            after={(order.total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={labels.fixedFees} 
            className="fees" 
            after={((order.fixedFees + order.deliveryFees) / 1000).toFixed(3)} 
          />
          <ListItem 
            title={labels.discount} 
            className="discount" 
            after={((order.discount.value + order.fraction) / 1000).toFixed(3)} 
          /> 
          <ListItem 
            title={labels.net} 
            className="net" 
            after={((order.total + order.fixedFees + order.deliveryFees - order.discount.value - order.fraction) / 1000).toFixed(3)} 
          />
        </List>
      </Block>
      <Actions ref={orderActions}>
        <ActionsButton onClick={() => handleEdit()}>{order.status === 'n' ? labels.editBasket : labels.editBasketRequest}</ActionsButton>
        <ActionsButton onClick={() => handleDelete()}>{order.status === 'n' ? labels.cancel : labels.cancelRequest}</ActionsButton>
        {order.status === 'n' && lastOrder ? 
          <ActionsButton onClick={() => handleMerge()}>{lastOrder.status === 'n' ? labels.merge : labels.mergeRequest}</ActionsButton>
        : ''}
      </Actions>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default OrderDetails
