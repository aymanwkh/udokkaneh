import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Stepper, Badge } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { showError, getMessage, quantityText } from '../data/Actions'

const Basket = props => {
  const { state, dispatch } = useContext(StoreContext)
  const [error, setError] = useState('')

  const totalPrice = useMemo(() => state.basket.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  , [state.basket])
  const packs = useMemo(() => [...state.basket].sort((p1, p2) => p1.time > p2.time ? 1 : -1)
  , [state.basket])
  const weightedPacks = useMemo(() => state.basket.filter(p => p.byWeight)
  , [state.basket])

  useEffect(() => {
    if (state.basket.length === 0) props.f7router.navigate('/home/', {reloadAll: true})
  }, [state.basket, props])
  useEffect(() => {
    if (error) {
      showError(props, error)
      setError('')
    }
  }, [error, props])

  const handleConfirm = () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      props.f7router.navigate('/confirmOrder/')
    } catch(err) {
			setError(getMessage(err, state.labels, props.f7route.route.component.name))
		}
  }
  return(
    <Page>
    <Navbar title={state.labels.basket} backLink={state.labels.back} />
    <Block>
      <List mediaList>
        {packs && packs.map(p => {
          const packInfo = state.packs.find(pa => pa.id === p.packId)
          const productInfo = state.products.find(pr => pr.id === packInfo.productId)
          return (
            <ListItem
              title={productInfo.name}
              subtitle={packInfo.name}
              footer={`${state.labels.price}: ${(p.price * p.quantity / 1000).toFixed(3)} ${packInfo.byWeight ? '*' : ''}`}
              key={p.packId}
            >
              <Badge slot="title" color="green">{quantityText(p.quantity, state.labels)}</Badge>
              <img slot="media" src={productInfo.imageUrl} className="img-list" alt={productInfo.name} />
              <Stepper 
                slot="after" 
                fill
                buttonsOnly
                onStepperPlusClick={() => dispatch({type: 'INCREASE_QUANTITY', pack: p})}
                onStepperMinusClick={() => dispatch({type: 'DECREASE_QUANTITY', pack: p})}
              />
            </ListItem>
          )
        })}
      </List>
      <p className="note">{weightedPacks.length > 0 ? state.labels.weightedPricesNote : ''}</p>
    </Block>
    <Fab position="center-bottom" slot="fixed" text={`${state.labels.submit} ${(totalPrice / 1000).toFixed(3)}`} color="green" onClick={() => handleConfirm()}>
      <Icon material="done"></Icon>
    </Fab>
    <Toolbar bottom>
      <Link href='/home/' iconMaterial="home" />
      <Link href='#' iconMaterial="delete" onClick={() => dispatch({type: 'CLEAR_BASKET'})} />
    </Toolbar>
  </Page>
  )
}
export default Basket
