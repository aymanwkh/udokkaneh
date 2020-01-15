import React, { useContext, useState, useMemo, useEffect } from 'react'
import { f7, Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Actions, ActionsButton } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import { cancelOrder, addOrderRequest, showMessage, showError, getMessage, quantityDetails } from '../data/actions'
import labels from '../data/labels'
import { orderPackStatus } from '../data/config'

const OrderDetails = props => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const order = useMemo(() => state.orders.find(order => order.id === props.id)
  , [state.orders, props.id])
  const orderBasket = useMemo(() => order.basket.map(p => {
    const packInfo = state.packs.find(pa => pa.id === p.packId)
    const storeName = p.storeId ? (p.storeId === 'm' ? labels.multipleStores : state.stores.find(s => s.id === p.storeId).name) : ''
    const changePriceNote = p.actual && p.actual !== p.price ? `${labels.orderPrice}: ${(p.price / 1000).toFixed(3)}, ${labels.currentPrice}: ${(p.actual / 1000).toFixed(3)}` : ''
    const statusNote = `${orderPackStatus.find(s => s.id === p.status).name} ${p.overPriced ? labels.overPricedNote : ''}`
    return {
      ...p,
      packInfo,
      storeName,
      changePriceNote,
      statusNote
    }
  }), [order, state.packs, state.stores])
  const lastOrder = useMemo(() => {
    const orders = state.orders.filter(o => o.id !== order.id)
    orders.sort((o1, o2) => o2.time.seconds - o1.time.seconds)
    return ['a', 'e'].includes(orders[0]?.status) ? orders[0] : ''
  }, [state.orders, order])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  useEffect(() => {
    if (inprocess) {
      f7.dialog.preloader(labels.inprocess)
    } else {
      f7.dialog.close()
    }
  }, [inprocess])
  const handleEdit = () => {
    try{
      if (order.status !== 'n' && state.orderRequests.find(r => r.order.id === order.id && r.status === 'n')) {
        throw new Error('pendingOrderRequest')
      }
      props.f7router.navigate(`/edit-order/${order.id}`)
    } catch(err) {
      setError(getMessage(props, err))
    }
}
  const handleDelete = () => {
    f7.dialog.confirm(labels.confirmationText, labels.confirmationTitle, async () => {
      try{
        if (order.status === 'n') {
          setInprocess(true)
          await cancelOrder(order)
          setInprocess(false)
          showMessage(labels.deleteSuccess)
          props.f7router.back()
        } else {
          if (state.orderRequests.find(r => r.order.id === order.id && r.status === 'n')){
            throw new Error('pendingOrderRequest')
          }
          setInprocess(true)
          await addOrderRequest(order, 'c')
          setInprocess(false)
          showMessage(labels.sendSuccess)
          props.f7router.back()
        }
      } catch(err) {
        setInprocess(false)
        setError(getMessage(props, err))
      }
    })    
  }
  const handleMerge = async () => {
    try{
      if (order.withDelivery !== lastOrder.withDelivery) {
        throw new Error('diffInDelivery')
      }
      if (order.urgent !== lastOrder.urgent) {
        throw new Error('diffInUrgent')
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
      setInprocess(true)
      await addOrderRequest(order, 'm')
      setInprocess(false)
      showMessage(labels.sendSuccess)
      props.f7router.back()
    } catch(err) {
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }
  return(
    <Page>
      <Navbar title={labels.orderDetails} backLink={labels.back} />
      {order.status === 'd' ? '' :
        <Fab position="left-top" slot="fixed" color="green" className="top-fab" onClick={() => f7.actions.open('#order-actions')}>
          <Icon material="build"></Icon>
        </Fab>
      }
      <Block>
        <List mediaList>
          {orderBasket.map(p => 
            <ListItem 
              key={p.packId} 
              title={p.packInfo.productName}
              subtitle={p.packInfo.name}
              text={p.storeName ? `${labels.storeName}: ${p.storeName}` : ''}
              footer={`${labels.status}: ${p.statusNote}`}
              after={(p.gross / 1000).toFixed(3)}
            >
              {p.changePriceNote ? <div className="list-subtext1">{p.changePriceNote}</div> : ''}
              <div className="list-subtext2">{quantityDetails(p)}</div>
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
            after={(order.fixedFees / 1000).toFixed(3)} 
          />
          {order.deliveryFees > 0 ? 
            <ListItem 
              title={labels.deliveryFees} 
              className="fees" 
              after={(order.deliveryFees / 1000).toFixed(3)} 
            /> 
          : ''}
          {order.discount > 0 ? 
            <ListItem 
              title={labels.discount} 
              className="discount" 
              after={(order.discount / 1000).toFixed(3)} 
            /> 
          : ''}
          <ListItem 
            title={labels.net} 
            className="net" 
            after={((order.total + order.fixedFees + (order.deliveryFees || 0) - (order.discount || 0)) / 1000).toFixed(3)} 
          />
        </List>
      </Block>
      <Actions id="order-actions">
        <ActionsButton onClick={() => handleEdit()}>{order.status === 'n' ? labels.edit : labels.editRequest}</ActionsButton>
        <ActionsButton onClick={() => handleDelete()}>{order.status === 'n' ? labels.cancel : labels.cancelRequest}</ActionsButton>
        {order.status === 'n' && lastOrder ? 
          <ActionsButton onClick={() => handleMerge()}>{labels.merge}</ActionsButton>
        : ''}
      </Actions>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default OrderDetails
