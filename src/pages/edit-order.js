import React, { useContext, useEffect, useState, useRef } from 'react'
import { Block, Fab, Page, Navbar, List, ListItem, Toolbar, Icon, Stepper, Link, Actions, ActionsButton } from 'framework7-react'
import { StoreContext } from '../data/store'
import { editOrder, showMessage, showError, getMessage, quantityDetails } from '../data/actions'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'
import { setup } from '../data/config'

const EditOrder = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [order] = useState(() => state.orders.find(o => o.id === props.id))
  const [orderBasket, setOrderBasket] = useState([])
  const [total, setTotal] = useState('')
  const [overLimit, setOverLimit] = useState(false)
  const [currentPack, setCurrentPack] = useState('')
  const [hasChanged, setHasChanged] = useState(false)
  const [customerOrdersTotals] = useState(() => {
    const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
    return activeOrders.reduce((sum, o) => sum + o.total, 0)
  })
  const hintsList = useRef('')
  useEffect(() => {
    dispatch({type: 'LOAD_ORDER_BASKET', order})
  }, [dispatch, order])
  useEffect(() => {
    setOrderBasket(() => {
      const basket = state.orderBasket?.filter(p => p.quantity > 0) || []
      return basket.map(p => {
        const packInfo = state.packs.find(pa => pa.id === p.packId)
        return {
          ...p,
          packInfo
        }
      })
    })
  }, [state.orderBasket, state.packs])
  useEffect(() => {
    setHasChanged(() => state.orderBasket?.find(p => p.oldQuantity !== p.quantity || p.oldWithBestPrice !== p.withBestPrice) ? true : false)
  }, [state.orderBasket])
  useEffect(() => {
    setTotal(() => orderBasket.reduce((sum, p) => sum + p.gross, 0))
  }, [orderBasket])
  useEffect(() => {
    const orderLimit = state.customerInfo.orderLimit || setup.orderLimit
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
  const handleSubmit = () => {
    try{
      editOrder(order, state.orderBasket)
      showMessage(order.status === 'n' ? labels.editSuccess : labels.sendSuccess)
      dispatch({type: 'CLEAR_ORDER_BASKET'})
      props.f7router.back()
    } catch(err) {
			setError(getMessage(props, err))
		}
  }
  const handleHints = pack => {
    setCurrentPack(pack)
    hintsList.current.open()
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
              footer={`${labels.priceIncrease}: ${p.withBestPrice ? labels.withBestPrice : labels.noPurchase}`}
              after={p.packInfo ? '' : labels.unAvailableNote}
              key={p.packId}
              className={(currentPack && currentPack.packId === p.packId) ? 'selected' : ''}
            >
              <div className="list-subtext1">{`${labels.unitPrice}: ${(p.price / 1000).toFixed(3)}`}</div>
              <div className="list-subtext2">{quantityDetails(p)}</div>
              <div className="list-subtext3">{`${labels.price}: ${(p.gross / 1000).toFixed(3)}`}</div>
              {p.packInfo ? 
                <Stepper
                  slot="after"
                  fill
                  buttonsOnly
                  onStepperPlusClick={() => dispatch({type: 'INCREASE_ORDER_QUANTITY', pack: p})}
                  onStepperMinusClick={() => dispatch({type: 'DECREASE_ORDER_QUANTITY', pack: p})}
                />
              : ''}
              <Link className="hints" slot="footer" iconMaterial="warning" iconColor="red" onClick={()=> handleHints(p)}/>
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
      <Actions ref={hintsList}>
        <ActionsButton onClick={() => dispatch({type: 'TOGGLE_ORDER_BEST_PRICE', pack: currentPack})}>{`${labels.priceIncrease}: ${currentPack.withBestPrice ? labels.noPurchase : labels.withBestPrice}`}</ActionsButton>
      </Actions>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default EditOrder
