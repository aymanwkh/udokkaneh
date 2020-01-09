import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Stepper, Popover } from 'framework7-react'
import { StoreContext } from '../data/store'
import { showError, getMessage, quantityText } from '../data/actions'
import PackImage from './pack-image'
import labels from '../data/labels'
import { setup } from '../data/config'

const Basket = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [submitVisible, setSubmitVisible] = useState(true)
  const [currentPack, setCurrentPack] = useState('')
  const totalPrice = useMemo(() => state.basket.reduce((sum, p) => sum + parseInt(p.price * p.quantity), 0)
  , [state.basket])
  const packs = useMemo(() => {
    const packs = state.basket.map(p => {
      const packInfo = state.packs.find(pa => pa.id === p.packId)
      const otherProducts = state.packs.filter(pa => pa.tagId === packInfo.tagId && (pa.sales > packInfo.sales || pa.rating > packInfo.rating))
      const otherOffers = state.packs.filter(pa => pa.productId === packInfo.productId && pa.id !== packInfo.id && (pa.isOffer || pa.endOffer))
      const otherPacks = state.packs.filter(pa => pa.productId === packInfo.productId && pa.weightedPrice < packInfo.weightedPrice)
      return {
        ...p,
        packInfo,
        otherProducts: otherProducts.length,
        otherOffers: otherOffers.length,
        otherPacks: otherPacks.length
      }
    })
    return packs.sort((p1, p2) => p1.time > p2.time ? 1 : -1)
  }, [state.basket, state.packs])
  const weightedPacks = useMemo(() => state.basket.filter(p => p.byWeight)
  , [state.basket])
  const customerOrdersTotals = useMemo(() => {
    if (state.customer){
      const activeOrders = state.orders.filter(o => ['n', 'a', 'e', 'f', 'p'].includes(o.status))
      return activeOrders.reduce((sum, o) => sum + o.total, 0)
    } else {
      return 0
    }
  }, [state.customer, state.orders])
  useEffect(() => {
    if (state.basket.length === 0) props.f7router.navigate('/home/', {reloadAll: true})
  }, [state.basket, props])
  useEffect(() => {
    if (state.customer.orderLimit){
      if (customerOrdersTotals + totalPrice > (state.customer.orderLimit || setup.orderLimit)){
        setSubmitVisible(false)
      } else {
        setSubmitVisible(true)
      }
    } else {
      setSubmitVisible(true)
    }
  }, [state.customer, customerOrdersTotals, totalPrice])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const handleConfirm = () => {
    try{
      if (state.customer.isBlocked) {
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
      if (customerOrdersTotals + totalPrice > state.customer.orderLimit || setup.orderLimit){
        throw new Error('limitOverFlow')
      }  
    } catch(err) {
			setError(getMessage(props, err))
		}
  }
  return(
    <Page>
    <Navbar title={labels.basket} backLink={labels.back} />
    <Block>
      <List mediaList>
        {packs.map(p => 
          <ListItem
            title={p.packInfo.productName}
            subtitle={p.packInfo.name}
            text={`${labels.price}: ${(parseInt(p.price * p.quantity) / 1000).toFixed(3)} ${p.packInfo.byWeight ? '*' : ''}`}
            footer={`${labels.quantity}: ${quantityText(p.quantity)}`}
            key={p.packId}
          >
            <PackImage slot="media" pack={p.packInfo} type="list" />
            <Stepper 
              slot="after" 
              fill
              buttonsOnly
              onStepperPlusClick={() => handleIncrease(p)}
              onStepperMinusClick={() => dispatch({type: 'DECREASE_QUANTITY', pack: p})}
            />
            {p.otherProducts + p.otherOffers + p.otherPacks === 0 ? '' : 
              <Link className="hints" slot="footer" popoverOpen=".basket-hints" iconMaterial="warning" iconColor="red" onClick={()=> setCurrentPack(p)}/>
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
    : <Fab position="center-bottom" slot="fixed" text={labels.limitOverFlowNote} color="red" href="/help/orderLimit">
        <Icon material="report_problem"></Icon>
      </Fab>
    }
    <Popover className="basket-hints">
      <List>
        {currentPack.otherProducts === 0 ? '' :
          <ListItem 
            link={`/hints/${currentPack.packId}/type/p`}
            popoverClose 
            title={labels.otherProducts} 
          />
        }
        {currentPack.otherOffers === 0 ? '' :
          <ListItem 
            link={`/hints/${currentPack.packId}/type/o`}
            popoverClose 
            title={labels.otherOffers}
          />
        }
        {currentPack.otherPacks === 0 ? '' :
          <ListItem 
            link={`/hints/${currentPack.packId}/type/w`}
            popoverClose 
            title={labels.otherPacks}
          />
        }
      </List>
    </Popover>
    <Toolbar bottom>
      <Link href="/home/" iconMaterial="home" />
      <Link href="#" iconMaterial="delete" onClick={() => dispatch({type: 'CLEAR_BASKET'})} />
    </Toolbar>
  </Page>
  )
}
export default Basket
