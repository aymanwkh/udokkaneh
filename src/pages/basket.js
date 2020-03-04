import React, { useContext, useEffect, useState, useRef } from 'react'
import { f7, Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Stepper, Actions, ActionsButton } from 'framework7-react'
import { StoreContext } from '../data/store'
import { showError, getMessage, quantityText, getBasket } from '../data/actions'
import labels from '../data/labels'
import { setup } from '../data/config'

const Basket = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [submitVisible, setSubmitVisible] = useState(true)
  const [currentPack, setCurrentPack] = useState('')
  const [basket, setBasket] = useState([])
  const [totalPrice, setTotalPrice] = useState('')
  const [weightedPacks, setWeightedPacks] = useState('')
  const [customerOrdersTotals] = useState(() => {
    const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
    return activeOrders.reduce((sum, o) => sum + o.total, 0)
  })
  const hintsList = useRef('')
  useEffect(() => {
    if (state.basket.length === 0) props.f7router.navigate('/home/', {reloadAll: true})
    else setBasket(getBasket(state.basket, state.packs))
  }, [state.basket, state.packs, props])
  useEffect(() => {
    setTotalPrice(() => basket.reduce((sum, p) => sum + Math.trunc(p.price * p.quantity), 0))
    setWeightedPacks(() => basket.filter(p => p.byWeight))
  }, [basket])
  useEffect(() => {
    const orderLimit = state.customerInfo.orderLimit || setup.orderLimit
    if (customerOrdersTotals + totalPrice > orderLimit){
      setSubmitVisible(false)
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
      dispatch({type: 'INCREASE_QUANTITY', pack})
      const orderLimit = state.customerInfo.orderLimit || setup.orderLimit
      if (customerOrdersTotals + totalPrice > orderLimit){
        throw new Error('limitOverFlow')
      }  
    } catch(err) {
			setError(getMessage(props, err))
		}
  }
  const handleIncreasePrice = () => {
    if (currentPack.price === currentPack.priceLimit) {
      f7.dialog.prompt(labels.enterPriceLimit, labels.priceLimit, price => {
        try {
          if (price * 1000 <= currentPack.price) {
            throw new Error('invalidPrice')
          }
          dispatch({type: 'SET_PRICE_LIMIT', pack: {...currentPack, priceLimit: price * 1000}})  
        } catch(err) {
          setError(getMessage(props, err))
        }
      })  
    } else {
      dispatch({type: 'SET_PRICE_LIMIT', pack: {...currentPack, priceLimit: currentPack.price}}) 
    }
  }
  const handleHints = pack => {
    setCurrentPack(pack)
    hintsList.current.open()
  }
  return(
    <Page>
    <Navbar title={labels.basket} backLink={labels.back} />
    <Block>
      <List mediaList>
        {basket.map(p => 
          <ListItem
            title={p.productName}
            subtitle={p.productAlias}
            text={p.packName}
            footer={`${labels.priceIncrease}: ${p.priceLimit === p.price ? labels.noPurchase : labels.priceLimit + ' ' + (p.priceLimit / 1000).toFixed(3)}`}
            key={p.packId}
            className={(currentPack && currentPack.packId === p.packId) ? 'selected' : ''}
          >
            <img src={p.imageUrl} slot="media" className="img-list" alt={labels.noImage} />
            <div className="list-subtext1">{p.priceText}</div>
            <div className="list-subtext2">{`${labels.quantity}: ${quantityText(p.quantity)}`}</div>
            <div className="list-subtext3">{`${labels.totalPrice}:${p.totalPriceText}`}</div>
            {p.price === 0 ? '' : 
              <Stepper 
                slot="after" 
                fill
                buttonsOnly
                onStepperPlusClick={() => handleIncrease(p)}
                onStepperMinusClick={() => dispatch({type: 'DECREASE_QUANTITY', pack: p})}
              />
            }
            <Link className="hints" slot="footer" iconMaterial="warning" iconColor="red" onClick={()=> handleHints(p)}/>
          </ListItem>
        )}
      </List>
      <p className="note">{weightedPacks.length > 0 ? labels.weightedPricesNote : ''}</p>
    </Block>
    {submitVisible ? 
      <Fab position="center-bottom" slot="fixed" text={`${labels.submit} ${(totalPrice / 1000).toFixed(3)}`} color="green" onClick={() => handleConfirm()}>
        <Icon material="done"></Icon>
      </Fab>
    : <Fab position="center-bottom" slot="fixed" text={labels.limitOverFlowNote} color="red" href="/help/ol">
        <Icon material="report_problem"></Icon>
      </Fab>
    }
    <Actions ref={hintsList}>
      <ActionsButton onClick={() => handleIncreasePrice()}>{`${labels.priceIncrease}: ${currentPack.priceLimit === currentPack.price ? labels.priceLimit : labels.noPurchase}`}</ActionsButton>
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
