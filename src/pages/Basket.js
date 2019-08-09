import React, { useContext, useEffect } from 'react'
import { Block, Fab, Page, Navbar, List, ListItem, Toolbar, Link, Icon, Row, Col} from 'framework7-react'
import { StoreContext } from '../data/Store';


const Basket = props => {
  const { state, dispatch } = useContext(StoreContext)
  const totalPrice = parseFloat(state.basket.reduce((a, product) => a + Number(product.netPrice), 0)).toFixed(3)
  let products = state.basket
  products.sort((product1, product2) => product1.time - product2.time)
  useEffect(() => {
    if (state.basket.length === 0) props.f7router.navigate('/home/')
  }, [state.basket])

  return(
    <Page>
    <Navbar title={state.labels.basket} backLink="Back" />
    <Block>
        <List mediaList>
          {products && products.map(product => 
            <ListItem
              title={product.name}
              after={product.netPrice}
              subtitle={`${product.size} ${state.units.find(rec => rec.id === product.unit).name}`}
              text={`${state.labels.productOf} ${state.countries.find(rec => rec.id === product.country).name}`}
              key={product.id}
            >
              <img slot="media" src={product.imageUrl} width="80" alt=""/>
              <Row noGap>
                <Col width="60"></Col>
                <Col width="10">
                  <Link onClick={() => dispatch({type: 'ADD_QUANTITY', product})}>
                    <Icon ios="f7:chevron_up" aurora="f7:chevron_up" md="material:keyboard_arrow_up"></Icon>                    
                  </Link>
                </Col>
                <Col width="20" className="center">
                  {product.quantity}
                </Col>
                <Col width="10">
                  <Link onClick={() => dispatch({type: 'REMOVE_QUANTITY', product})}>
                    <Icon ios="f7:chevron_down" aurora="f7:chevron_down" md="material:keyboard_arrow_down"></Icon>
                  </Link>              
                </Col>
              </Row>
            </ListItem>
          )}
        </List>
    </Block>
    <Fab position="center-bottom" slot="fixed" text={`${state.labels.confirm} ${totalPrice}`} color="red" onClick={() => props.f7router.navigate('/confirmOrder/')}>
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
