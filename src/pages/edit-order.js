import React, { useContext, useEffect, useState } from 'react'
import { f7, Block, Fab, Page, Navbar, List, ListItem, Toolbar, Icon, Stepper } from 'framework7-react'
import { StoreContext } from '../data/store'
import { editOrder, showMessage, showError, getMessage, quantityDetails } from '../data/actions'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'
import { setup } from '../data/config'

const EditOrder = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const [order] = useState(() => state.orders.find(o => o.id === props.id))
  const [orderBasket, setOrderBasket] = useState([])
  const [total, setTotal] = useState('')
  const [overLimit, setOverLimit] = useState(false)
  const [hasChanged, setHasChanged] = useState(false)
  const [customerOrdersTotals] = useState(() => {
    const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
    return activeOrders.reduce((sum, o) => sum + o.total, 0)
  })
  useEffect(() => {
    dispatch({type: 'LOAD_ORDER_BASKET', order})
  }, [dispatch, order])
  useEffect(() => {
    setOrderBasket(() => state.orderBasket?.filter(p => p.quantity > 0) || [])
  }, [state.orderBasket, state.packs])
  useEffect(() => {
    setTotal(() => orderBasket.reduce((sum, p) => sum + p.gross, 0))
  }, [orderBasket])
  useEffect(() => {
    const orderLimit = (state.customerInfo?.ordersCount || 0) === 0 ? setup.firstOrderLimit : state.customerInfo.orderLimit || setup.orderLimit
    if (customerOrdersTotals + total > orderLimit){
      setOverLimit(true)
    } else {
      setOverLimit(false)
    }
  }, [state.customerInfo, customerOrdersTotals, total])

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
      await editOrder(order, state.orderBasket)
      setInprocess(false)
      showMessage(order.status === 'n' ? labels.editSuccess : labels.sendSuccess)
      dispatch({type: 'CLEAR_ORDER_BASKET'})
      props.f7router.back()
    } catch(err) {
      setInprocess(false)
			setError(getMessage(props, err))
		}
  }
  const handleChange = (pack, value) => {
    if (value === 1) {
      dispatch({type: 'INCREASE_ORDER_QUANTITY', pack})
    } else {
      dispatch({type: 'DECREASE_ORDER_QUANTITY', pack})
    }
    setHasChanged(true)
  }
  return (
    <Page>
      <Navbar title={labels.editOrder} backLink={labels.back} />
      <Block>
        <List mediaList>
          {orderBasket.map(p =>
            <ListItem
              title={p.productName}
              subtitle={p.productAlias}
              text={p.packName}
              footer={quantityDetails(p)}
              key={p.packId}
            >
              <div className="list-subtext1">{`${labels.unitPrice}: ${(p.price / 1000).toFixed(3)}`}</div>
              <div className="list-subtext2">{`${labels.price}: ${(p.gross / 1000).toFixed(3)}`}</div>
              <Stepper
                slot="after"
                fill
                buttonsOnly
                onStepperPlusClick={() => handleChange(p, 1)}
                onStepperMinusClick={() => handleChange(p, -1)}
              />
            </ListItem>
          )}
        </List>
      </Block>
      {!overLimit & hasChanged ? 
        <Fab position="center-bottom" slot="fixed" text={`${labels.submit} ${(total / 1000).toFixed(3)}`} color="green" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      : ''}
      {overLimit ? 
        <Fab position="center-bottom" slot="fixed" text={labels.limitOverFlowNote} color="red" href="/help/ol">
          <Icon material="report_problem"></Icon>
        </Fab>
      : ''}
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default EditOrder
