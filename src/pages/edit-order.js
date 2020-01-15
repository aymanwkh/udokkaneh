import React, { useContext, useMemo, useEffect, useState } from 'react'
import { f7, Block, Fab, Page, Navbar, List, ListItem, Toolbar, Icon, Stepper, Toggle } from 'framework7-react'
import { StoreContext } from '../data/store'
import { editOrder, showMessage, showError, getMessage, quantityDetails } from '../data/actions'
import PackImage from './pack-image'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'

const EditOrder = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const order = useMemo(() => state.orders.find(o => o.id === props.id)
  , [state.orders, props.id])
  const [withDelivery, setWithDelivery] = useState(order.withDelivery)
  const [urgent, setUrgent] = useState(order.urgent)
  const customerLocation = useMemo(() => state.customer.locationId ? state.locations.find(l => l.id === state.customer.locationId) : ''
  , [state.locations, state.customer])
  const orderBasket = useMemo(() => {
    let orderBasket = state.orderBasket ? state.orderBasket.filter(p => p.quantity > 0) : []
    orderBasket = orderBasket.map(p => {
      const packInfo = state.packs.find(pa => pa.id === p.packId)
      return {
        ...p,
        packInfo
      }
    })
    return orderBasket
  }, [state.orderBasket, state.packs])
  const total = useMemo(() => orderBasket.reduce((sum, p) => sum + p.gross, 0)
  , [orderBasket])
  useEffect(() => {
    dispatch({type: 'LOAD_ORDER_BASKET', order})
  }, [dispatch, order])
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

  const handleSubmit = async () => {
    try{
      setInprocess(true)
      await editOrder({...order, withDelivery, urgent}, state.orderBasket, state.customer, state.locations)
      setInprocess(false)
      showMessage(order.status === 'n' ? labels.editSuccess : labels.sendSuccess)
      dispatch({type: 'CLEAR_ORDER_BASKET'})
      props.f7router.back()
    } catch(err) {
      setInprocess(false)
			setError(getMessage(props, err))
		}
  }
  return (
    <Page>
      <Navbar title={labels.editOrder} backLink={labels.back} />
      <Block>
        <List mediaList>
          {orderBasket.map(p =>
            <ListItem
              title={p.packInfo.productName}
              subtitle={p.packInfo.name}
              text={`${labels.unitPrice}: ${(p.price / 1000).toFixed(3)}`}
              footer={quantityDetails(p)}
              key={p.packId}
            >
              <PackImage slot="media" pack={p.packInfo} type="list" />
              <div className="list-subtext1">{`${labels.price}: ${(p.gross / 1000).toFixed(3)}`}</div>
              <Stepper
                slot="after"
                fill
                buttonsOnly
                onStepperPlusClick={() => dispatch({type: 'INCREASE_ORDER_QUANTITY', pack: p})}
                onStepperMinusClick={() => dispatch({type: 'DECREASE_ORDER_QUANTITY', pack: p})}
              />
            </ListItem>
          )}
        </List>
        <List form>
          <ListItem>
            <span>{labels.withDelivery}</span>
            <Toggle 
              name="withDelivery" 
              color="green" 
              checked={withDelivery} 
              onToggleChange={() => setWithDelivery(!withDelivery)}
              disabled={customerLocation ? !customerLocation.hasDelivery : false}
            />
          </ListItem>
          <ListItem>
            <span>{labels.urgent}</span>
            <Toggle 
              name="urgent" 
              color="green" 
              checked={urgent} 
              onToggleChange={() => setUrgent(!urgent)}
            />
          </ListItem>
        </List>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={`${labels.submit} ${(total / 1000).toFixed(3)}`} color="green" onClick={() => handleSubmit()}>
        <Icon material="done"></Icon>
      </Fab>

      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default EditOrder
