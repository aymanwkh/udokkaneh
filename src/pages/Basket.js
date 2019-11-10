import React, { useContext, useEffect, useMemo } from 'react'
import { Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Stepper, Badge} from 'framework7-react'
import { StoreContext } from '../data/Store';


const Basket = props => {
  const { state, dispatch } = useContext(StoreContext)
  const totalPrice = useMemo(() => state.basket.reduce((a, pack) => a + (pack.price * pack.quantity), 0), [state.basket])
  const packs = useMemo(() => [...state.basket].sort((rec1, rec2) => rec1.time.seconds - rec2.time.seconds), [state.basket])
  useEffect(() => {
    if (state.basket.length === 0) props.f7router.navigate('/home/')
  }, [state.basket])

  return(
    <Page>
    <Navbar title={state.labels.basket} backLink={state.labels.back} />
    <Block>
      <List mediaList>
        {packs && packs.map(pack => {
          const productInfo = state.products.find(rec => rec.id === pack.productId)
          return (
            <ListItem
              title={productInfo.name}
              footer={(pack.price * pack.quantity / 1000).toFixed(3)}
              subtitle={pack.name}
              key={pack.id}
            >
              <img slot="media" src={productInfo.imageUrl} width="80" alt=""/>
              <Stepper 
                slot="after" 
                fill
                value={pack.quantity}
                onStepperPlusClick={() => dispatch({type: 'ADD_QUANTITY', pack})}
                onStepperMinusClick={() => dispatch({type: 'REMOVE_QUANTITY', pack})}
              />
            </ListItem>
          )
        })}
      </List>
    </Block>
    {state.customer.type === 'b' ? '' : 
      <Fab position="center-bottom" slot="fixed" text={`${state.labels.submit} ${(totalPrice / 1000).toFixed(3)}`} color="green" onClick={() => props.f7router.navigate('/confirmOrder/')}>
        <Icon material="done"></Icon>
      </Fab>
    }
    <Toolbar bottom>
      <Link href='/home/' iconMaterial="home" />
      <Link href='#' iconMaterial="delete" onClick={() => dispatch({type: 'CLEAR_BASKET'})} />
    </Toolbar>
  </Page>
  )
}
export default Basket
