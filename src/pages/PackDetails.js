import React, { useContext, useMemo } from 'react'
import { Page, Navbar, Card, CardContent, CardHeader, Link, Fab, Toolbar, Icon} from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import Rating from './Rating'
import RateProduct from './RateProduct'
import { StoreContext } from '../data/Store'
import { showMessage } from '../data/Actions'

const PackDetails = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const pack = useMemo(() => state.packs.find(rec => rec.id === props.id), [state.packs])
  const product = useMemo(() => state.products.find(rec => rec.id === pack.productId), [state.products])
  const handleAddPack = () => {
    dispatch({type: 'ADD_TO_BASKET', pack})
    showMessage(props, 'success', state.labels.addToBasketSuccess)
    props.f7router.back()
  }

  const rating_links = !user || state.customer.type === 'b' || state.rating.find(rating => rating.productId === props.id) ? '' : <RateProduct product={product} />
  const priceAlarmText = useMemo(() => {
    if (state.customer.type === 'o') {
      if (pack.stores.find(rec => rec.id === state.customer.storeId)) {
        return `${state.labels.changePrice} ${(pack.stores.find(rec => rec.id === state.customer.storeId).price / 1000).toFixed(3)}`
      } else {
       return state.labels.havePack
      }
    } else {
      return state.labels.lessPrice
    }
  }, [state.packs])
  return (
    <Page>
      <Navbar title={product.name} backLink={state.labels.back} />
      <Card>
        <CardHeader className="card-title">
          <p className="less-price">
            <span className="price">
              {(pack.price / 1000).toFixed(3)}
            </span> <br />
            {state.customer.type === 'b' ? '' : 
              <Link 
                iconMaterial="notifications_none" 
                text={priceAlarmText} 
                color="red" 
                onClick={() => props.f7router.navigate(`/priceAlarm/${props.id}`)}
              />
            }
          </p>
          <p className="rating"><Rating rating={product.rating} /> </p>
        </CardHeader>
        <CardContent>
          <img src={product.imageUrl} width="100%" height="250" alt=""/>
          <p>{pack.name}</p>
          <p>{`${state.labels.productOf} ${state.countries.find(rec => rec.id === product.country).name}`}</p>
        </CardContent>
      </Card>
      {state.customer.type === 'b' ? '' :
        <Fab position="center-bottom" slot="fixed" text={state.labels.addToBasket} color="green" onClick={() => handleAddPack()}>
          <Icon material="add"></Icon>
        </Fab>
      }
      {rating_links}
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>

    </Page>
  )
}

export default PackDetails
