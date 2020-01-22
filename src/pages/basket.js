import React, { useContext, useEffect, useMemo, useState, useRef } from 'react'
import { f7, Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Stepper, Actions, ActionsButton } from 'framework7-react'
import { StoreContext } from '../data/store'
import { showError, getMessage, quantityText } from '../data/actions'
import labels from '../data/labels'
import { setup } from '../data/config'

const Basket = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [submitVisible, setSubmitVisible] = useState(true)
  const [currentPack, setCurrentPack] = useState('')
  const totalPrice = useMemo(() => state.basket.reduce((sum, p) => sum + parseInt(p.price * p.quantity), 0)
  , [state.basket])
  const packs = useRef(state.packs)
  const basket = useMemo(() => {
    const basket = state.basket.map(p => {
      const packInfo = packs.current.find(pa => pa.id === p.packId) || ''
      const otherProducts = packs.current.filter(pa => pa.tagId === packInfo.tagId && (pa.sales > packInfo.sales || pa.rating > packInfo.rating))
      const otherOffers = packs.current.filter(pa => pa.productId === packInfo.productId && pa.id !== packInfo.id && (pa.isOffer || pa.endOffer))
      const otherPacks = packs.current.filter(pa => pa.productId === packInfo.productId && pa.weightedPrice < packInfo.weightedPrice)
      return {
        ...p,
        packInfo,
        otherProducts: otherProducts.length,
        otherOffers: otherOffers.length,
        otherPacks: otherPacks.length
      }
    })
    return basket.sort((p1, p2) => p1.time > p2.time ? 1 : -1)
  }, [state.basket])
  const weightedPacks = useMemo(() => state.basket.filter(p => p.byWeight)
  , [state.basket])
  const customerOrdersTotals = useMemo(() => {
    if (state.customerInfo){
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      return activeOrders.reduce((sum, o) => sum + o.total, 0)
    } else {
      return 0
    }
  }, [state.customerInfo, state.orders])
  useEffect(() => {
    if (state.basket.length === 0) props.f7router.navigate('/home/', {reloadAll: true})
  }, [state.basket, props])
  useEffect(() => {
    if (state.customerInfo.orderLimit){
      if (customerOrdersTotals + totalPrice > (state.customerInfo.orderLimit || setup.orderLimit)){
        setSubmitVisible(false)
      } else {
        setSubmitVisible(true)
      }
    } else {
      setSubmitVisible(true)
    }
  }, [state.customerInfo, customerOrdersTotals, totalPrice])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const handleConfirm = () => {
    try{
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      props.f7router.navigate('/confirm-order/')
    } catch(err) {
			setError(getMessage(props, err))
		}
  }
  const handleIncrease = pack => {
    try{
      if (pack.orderLimit && pack.orderLimit <= pack.quantity){
        throw new Error('ExceedPackLimit')
      }
      dispatch({type: 'INCREASE_QUANTITY', pack})
      if (customerOrdersTotals + totalPrice > state.customerInfo.orderLimit || setup.orderLimit){
        throw new Error('limitOverFlow')
      }  
    } catch(err) {
			setError(getMessage(props, err))
		}
  }
  const handleHints = pack => {
    setCurrentPack(pack)
    f7.actions.open('#basket-hints')
  }
  return(
    <Page>
    <Navbar title={labels.basket} backLink={labels.back} />
    <Block>
      <List mediaList>
        {basket.map(p => 
          <ListItem
            title={p.productName}
            subtitle={p.name}
            text={`${labels.unitPrice}: ${(p.price / 1000).toFixed(3)}`}
            footer={`${labels.quantity}: ${quantityText(p.quantity)}`}
            key={p.packId}
            className={currentPack && currentPack.packId === p.packId ? 'selected' : ''}
          >
            <div className="list-subtext1">{`${labels.price}: ${(parseInt(p.price * p.quantity) / 1000).toFixed(3)} ${p.packInfo?.byWeight ? '*' : ''}`}</div>
            <Stepper 
              slot="after" 
              fill
              buttonsOnly
              onStepperPlusClick={() => handleIncrease(p)}
              onStepperMinusClick={() => dispatch({type: 'DECREASE_QUANTITY', pack: p})}
            />
            {p.otherProducts + p.otherOffers + p.otherPacks === 0 ? '' : 
              <Link className="hints" slot="footer" iconMaterial="warning" iconColor="red" onClick={()=> handleHints(p)}/>
            }
          </ListItem>
        )}
      </List>
      <p className="note">{weightedPacks.length > 0 ? labels.weightedPricesNote : ''}</p>
    </Block>
    {submitVisible ? 
      <Fab position="center-bottom" slot="fixed" text={`${labels.submit} ${(totalPrice / 1000).toFixed(3)}`} color="green" onClick={() => handleConfirm()}>
        <Icon material="done"></Icon>
      </Fab>
    : <Fab position="center-bottom" slot="fixed" text={labels.limitOverFlowNote} color="red" href="/help/o">
        <Icon material="report_problem"></Icon>
      </Fab>
    }
    <Actions id="basket-hints">
      {currentPack.otherProducts === 0 ? '' :
        <ActionsButton onClick={() => props.f7router.navigate(`/hints/${currentPack.packId}/type/p`)}>{labels.otherProducts}</ActionsButton>
      }
      {currentPack.otherOffers === 0 ? '' :
        <ActionsButton onClick={() => props.f7router.navigate(`/hints/${currentPack.packId}/type/o`)}>{labels.otherOffers}</ActionsButton>
      }
      {currentPack.otherPacks === 0 ? '' :
        <ActionsButton onClick={() =>props.f7router.navigate(`/hints/${currentPack.packId}/type/w`)}>{labels.otherPacks}</ActionsButton>
      }
    </Actions>

    <Toolbar bottom>
      <Link href="/home/" iconMaterial="home" />
      <Link href="#" iconMaterial="delete" onClick={() => dispatch({type: 'CLEAR_BASKET'})} />
    </Toolbar>
  </Page>
  )
}
export default Basket
