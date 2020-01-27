import React, { useContext, useState, useEffect } from 'react'
import { f7, Block, Page, Navbar, List, ListItem, Toolbar, Fab, Icon, Toggle } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import { confirmOrder, showMessage, showError, getMessage, quantityText, getBasket } from '../data/actions'
import labels from '../data/labels'
import { setup } from '../data/config'

const ConfirmOrder = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [withDelivery, setWithDelivery] = useState(state.customerInfo.withDelivery || false)
  const [urgent, setUrgent] = useState(false)
  const [helpParam, setHelpParam] = useState('r')
  const [customerLocation] = useState(() => state.locations.find(l => l.id === state.customerInfo.locationId) || '')
  const [deliveryFees, setDeliveryFees] = useState('')
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const [basket, setBasket] = useState([])
  const [total, setTotal] = useState('')
  const [fixedFees, setFixedFees] = useState('')
  const [discount, setDiscount] = useState('')
  const [weightedPacks, setWeightedPacks] = useState('')
  useEffect(() => {
    setBasket(getBasket(state.basket, state.packs))
  }, [state.basket, state.packs])
  useEffect(() => {
    setTotal(() => basket.reduce((sum, p) => sum + p.price * p.quantity, 0))
    setWeightedPacks(() => basket.filter(p => p.byWeight))
  }, [basket])
  useEffect(() => {
    setFixedFees(() => {
      const fraction = total - Math.floor(total / 50) * 50
      const fees = Math.ceil((urgent ? 1.5 : 1) * setup.fixedFees * total / 50) * 50
      return fees - fraction
    })
  }, [urgent, total])
  useEffect(() => {
    setDiscount(() => {
      const orders = state.orders.filter(o => o.status !== 'c')
      let discount = 0
      if (orders.length === 0) {
        discount = setup.firstOrderDiscount
      } else if (state.customerInfo.discounts > 0) {
        discount = Math.min(state.customerInfo.discounts, setup.maxDiscount)
      }
      return discount
    }) 
  }, [state.orders, state.customerInfo])
  useEffect(() => {
    if (withDelivery) {
      setDeliveryFees((customerLocation?.deliveryFees || setup.deliveryFees) * (urgent ? 1.5 : 1) - (state.customerInfo.deliveryDiscount || 0))
      setHelpParam(urgent ? 'ud' : 'd')
    } else {
      setDeliveryFees('')
      setHelpParam(urgent ? 'ur' : 'r')
    }
  }, [withDelivery, urgent, customerLocation, state.customerInfo])

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

  const handleConfirm = async () => {
    try{
      if (state.adverts[0]?.type === 'n') {
        showMessage(state.adverts[0].message)
        return
      }
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.orders.filter(o => o.status === 'n').length > 0) {
        throw new Error('unapprovedOrder')
      }
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      const totalOrders = activeOrders.reduce((sum, o) => sum + o.total, 0)
      if (totalOrders + total > (state.customerInfo.orderLimit || setup.orderLimit)) {
        throw new Error('limitOverFlow')
      }
      let packs = basket.filter(p => p.price > 0)
      packs = packs.map(p => {
        return {
          packId: p.packId,
          productName: p.productName,
          packName: p.packName,
          price: p.price,
          quantity: p.quantity,
          gross: parseInt(p.price * p.quantity),
          offerId: p.offerId || '',
          purchased: 0,
          status: 'n'
        }
      })
      const order = {
        basket: packs,
        fixedFees,
        deliveryFees,
        discount,
        withDelivery,
        urgent,
        total,
        deliveryDiscount: withDelivery ? state.customerInfo.deliveryDiscount : 0
      }
      setInprocess(true)
      await confirmOrder(order)
      setInprocess(false)
      showMessage(labels.confirmSuccess)
      props.f7router.navigate('/home/', {reloadAll: true})
      dispatch({ type: 'CLEAR_BASKET' })
    } catch (err){
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }
  if (!user) return <Page><h3 className="center"><a href="/login/">{labels.relogin}</a></h3></Page>
  return (
    <Page>
      <Navbar title={labels.confirmOrder} backLink={labels.back} />
      <Block>
        <p className="note">{labels.feesDeliveryHelp} <a href={`/help/${helpParam}`}>{labels.clickHere}</a></p>
        <List>
          <ListItem>
            <span>{customerLocation?.hasDelivery ? labels.withDelivery : labels.noDelivery}</span>
            {customerLocation?.hasDelivery ?
              <Toggle 
                name="withDelivery" 
                color="green" 
                checked={withDelivery} 
                onToggleChange={() => setWithDelivery(!withDelivery)}
              />
            : ''}
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
        <List mediaList>
          {basket.map(p => 
            <ListItem
              key={p.packId}
              title={p.productName}
              subtitle={p.packName}
              text={`${labels.quantity}: ${quantityText(p.quantity)}`}
              footer={p.priceText}
              after={p.totalPriceText}
            />
          )}
          <ListItem 
            title={labels.total} 
            className="total" 
            after={(total / 1000).toFixed(3)} 
          />
          <ListItem 
            title={labels.fixedFees} 
            className="fees" 
            after={(fixedFees / 1000).toFixed(3)} 
          />
          {withDelivery ? 
            <ListItem 
              title={labels.deliveryFees} 
              className="fees" 
              after={(deliveryFees / 1000).toFixed(3)} 
            />
          : ''}
          {discount > 0 ? 
            <ListItem 
              title={labels.discount}
              className="discount" 
              after={(discount / 1000).toFixed(3)} 
            /> 
          : ''}
          <ListItem 
            title={labels.net} 
            className="net" 
            after={((total + fixedFees + deliveryFees - discount) / 1000).toFixed(3)} 
          />
          </List>
        <p className="note">{weightedPacks.length > 0 ? labels.weightedPricesNote : ''}</p>
      </Block>
      <Fab position="center-bottom" slot="fixed" text={labels.confirm} color="green" onClick={() => handleConfirm()}>
        <Icon material="done"></Icon>
      </Fab>
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default ConfirmOrder
