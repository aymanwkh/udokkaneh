import React, { useContext, useEffect } from 'react'
import { Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Stepper, Badge} from 'framework7-react'
import { StoreContext } from '../data/Store';


const Basket = props => {
  const { state, dispatch } = useContext(StoreContext)
  const totalPrice = state.basket.reduce((a, pack) => a + (pack.price * pack.quantity), 0)
  let packs = state.basket
  packs.sort((pack1, pack2) => pack1.time.seconds - pack2.time.seconds)
  useEffect(() => {
    if (state.basket.length === 0) props.f7router.navigate('/home/')
  }, [state.basket])

  return(
    <Page>
    <Navbar title={state.labels.basket} backLink="Back" />
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
              {pack.quantity > 1 ? <Badge slot="title" color="red">{pack.quantity}</Badge> : null}
              <Stepper 
                slot="after" 
                buttonsOnly={true} 
                small 
                raised
                onStepperPlusClick={() => dispatch({type: 'ADD_QUANTITY', pack})}
                onStepperMinusClick={() => dispatch({type: 'REMOVE_QUANTITY', pack})}
              />
            </ListItem>
          )
        })}
      </List>
    </Block>
    <Fab position="center-bottom" slot="fixed" text={`${state.labels.submit} ${(totalPrice / 1000).toFixed(3)}`} color="green" onClick={() => props.f7router.navigate('/confirmOrder/')}>
      <Icon ios="f7:check" aurora="f7:check" md="material:done"></Icon>
    </Fab>

    <Toolbar bottom>
    <Link href='/home/'>
        <Icon ios="f7:home_fill" aurora="f7:home_fill" md="material:home"></Icon>
      </Link>
      <Link href='#' onClick={() => dispatch({type: 'CLEAR_BASKET'})}>
        <Icon ios="f7:trash_fill" aurora="f7:trash_fill" md="material:delete"></Icon>
      </Link>
    </Toolbar>
  </Page>
  )
}
export default Basket
