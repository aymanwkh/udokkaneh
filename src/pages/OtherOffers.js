import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';

const OtherOffers = props => {
  const { state } = useContext(StoreContext)
  const pack = useMemo(() => state.packs.find(rec => rec.id === props.id)
  , [state.packs, props.id])
  const offers = useMemo(() => {
    const productPack = state.products.find(rec => rec.id === pack.productId)
    let offers = state.packs.filter(rec1 => state.products.find(rec2 => rec2.id === rec1.productId && rec2.category === productPack.category) && rec1.isOffer === true)
    offers = offers.filter(rec => rec.id !== pack.id && rec.price > 0)
    return offers.sort((rec1, rec2) => rec1.price - rec2.price)
  }, [state.packs, pack, state.products]) 
  return(
    <Page>
      <Navbar title={`${state.labels.productOffers} ${state.products.find(rec => rec.id === pack.productId).name}`} backLink={state.labels.back} />
      <Block>
        <List mediaList>
          {offers && offers.map(rec1 => {
            const productInfo = state.products.find(rec2 => rec2.id === rec1.productId)
            return (
              <ListItem
                link={`/pack/${rec1.id}`}
                title={productInfo.name}
                after={(rec1.price / 1000).toFixed(3)}
                subtitle={rec1.name}
                text={`${state.labels.productOf} ${state.countries.find(rec3 => rec3.id === productInfo.country).name}`}
                key={rec1.id}
              >
                <img slot="media" src={productInfo.imageUrl} className="lazy lazy-fadeIn avatar" alt={rec1.name} />
                {productInfo.isNew ? <Badge slot="title" color="red">{state.labels.new}</Badge> : ''}
                {rec1.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
                {state.customer.type === 'o' && rec1.stores.find(rec4 => rec4.id === state.customer.storeId) ? <Badge slot="footer" color='green'> {state.labels.myPrice} {(rec1.stores.find(rec5 => rec5.id === state.customer.storeId).price / 1000).toFixed(3)} </Badge> : ''}
              </ListItem>
            )
          })}
        </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default OtherOffers