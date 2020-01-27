import React, { useContext, useEffect, useState } from 'react'
import { f7, Block, Fab, Page, Navbar, List, ListItem, Toolbar, Icon, Stepper } from 'framework7-react'
import { StoreContext } from '../data/store'
import { editOrder, showMessage, showError, getMessage, quantityDetails } from '../data/actions'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'

const EditOrder = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const [order] = useState(() => state.orders.find(o => o.id === props.id))
  const [orderBasket, setOrderBasket] = useState([])
  const [total, setTotal] = useState('')
  const [hasChanged, setHasChanged] = useState(false)
  useEffect(() => {
    dispatch({type: 'LOAD_ORDER_BASKET', order})
  }, [dispatch, order])
  useEffect(() => {
    setOrderBasket(() => {
      let orderBasket = state.orderBasket?.filter(p => p.quantity > 0) || []
      orderBasket = orderBasket.map(p => {
        const packInfo = state.packs.find(pa => pa.id === p.packId) || ''
        return {
          ...p,
          packInfo
        }
      })
      return orderBasket
    })
  }, [state.orderBasket, state.packs])
  useEffect(() => {
    setTotal(() => orderBasket.reduce((sum, p) => sum + p.gross, 0))
  }, [orderBasket])
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
      await editOrder(order, state.orderBasket, state.customerInfo, state.locations)
      setInprocess(false)
      showMessage(order.status === 'n' ? labels.editSuccess : labels.sendSuccess)
      dispatch({type: 'CLEAR_ORDER_BASKET'})
      props.f7router.back()
    } catch(err) {
      setInprocess(false)
			setError(getMessage(props, err))
		}
  }
  const hadnleChange = (pack, value) => {
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
              title={p.packInfo.productName}
              subtitle={p.packInfo.name}
              text={`${labels.unitPrice}: ${(p.price / 1000).toFixed(3)}`}
              footer={quantityDetails(p)}
              key={p.packId}
            >
              <div className="list-subtext1">{`${labels.price}: ${(p.gross / 1000).toFixed(3)}`}</div>
              <Stepper
                slot="after"
                fill
                buttonsOnly
                onStepperPlusClick={() => hadnleChange(p, 1)}
                onStepperMinusClick={() => hadnleChange(p, -1)}
              />
            </ListItem>
          )}
        </List>
      </Block>
      {hasChanged ? 
        <Fab position="center-bottom" slot="fixed" text={`${labels.submit} ${(total / 1000).toFixed(3)}`} color="green" onClick={() => handleSubmit()}>
          <Icon material="done"></Icon>
        </Fab>
      : ''}
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default EditOrder
