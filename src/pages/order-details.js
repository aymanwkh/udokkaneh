import React, { useContext, useState, useMemo, useEffect } from 'react'
import { f7, Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, FabButton, FabButtons } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import { cancelOrder, cancelOrderRequest, showMessage, showError, getMessage, quantityDetails } from '../data/actions'
import labels from '../data/labels'
import { orderPackStatus } from '../data/config'

const OrderDetails = props => {
  const { state, dispatch } = useContext(StoreContext)
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
  const fractionFromProfit = useMemo(() => {
    let fraction = 0
    if (order.fixedFees === 0) {
      const profit = order.basket.reduce((sum, p) => sum + ['p', 'f', 'pu'].includes(p.status) ? parseInt((p.actual - p.cost) * (p.weight || p.purchased)) : 0, 0)
      fraction = profit - order.profit
    }
    return fraction
  }, [order])
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

  const handleEdit = async () => {
    try{
      if (state.basket.length > 0) {
        throw new Error('basketIsNotEmpty')
      }
      setInprocess(true)
      await cancelOrder(order)
      setInprocess(false)
      dispatch({type: 'LOAD_BASKET', basket: order.basket})
      props.f7router.navigate('/basket/')
		} catch (err){
      setInprocess(false)
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
        } else {
          if (state.cancelOrders.find(o => o.order.id === order.id && o.status === 'n')){
            throw new Error('duplicateOrderCancel')
          }
          setInprocess(true)
          await cancelOrderRequest(order)
          setInprocess(false)
          showMessage(labels.sendSuccess)
        }
        props.f7router.back()
      } catch(err) {
        setInprocess(false)
        setError(getMessage(props, err))
      }
    })    
  }
  return(
    <Page>
      <Navbar title={labels.orderDetails} backLink={labels.back} />
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
            after={((order.total + order.fixedFees + (order.deliveryFees || 0) - (order.discount || 0) - fractionFromProfit) / 1000).toFixed(3)} 
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
