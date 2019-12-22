import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';

const OtherOffers = props => {
  const { state } = useContext(StoreContext)
  const pack = useMemo(() => state.packs.find(p => p.id === props.id)
  , [state.packs, props.id])
  const offers = useMemo(() => {
    const productPack = state.products.find(p => p.id === pack.productId)
    let offers = state.packs.filter(p => state.products.find(pr => pr.id === p.productId && pr.categoryId === productPack.categoryId) && (p.isOffer || p.hasOffer))
    offers = offers.filter(p => p.id !== pack.id && p.price > 0)
    return offers.sort((p1, p2) => p1.price - p2.price)
  }, [state.packs, pack, state.products]) 
  return(
    <Page>
      <Navbar title={state.labels.offers} backLink={state.labels.back} className="page-title" />
      <Block>
        <List mediaList>
          {offers.map(p => {
            const productInfo = state.products.find(pr => pr.id === p.productId)
            return (
              <ListItem
                link={`/pack/${p.id}`}
                title={productInfo.name}
                after={(p.price / 1000).toFixed(3)}
                key={p.id}
              >
                <img slot="media" src={productInfo.imageUrl} className="img-list" alt={productInfo.name} />
                {productInfo.isNew ? <Badge slot="title" color="red">{state.labels.new}</Badge> : ''}
                {p.isOffer || p.hasOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
                {state.customer.storeId && state.storePacks.find(pa => pa.storeId === state.customer.storeId) ? 
                  <Badge slot="footer" color='green'> 
                    {state.labels.myPrice} {(state.storePacks.find(pa => pa.storeId === state.customer.storeId).price / 1000).toFixed(3)} 
                  </Badge> 
                : ''}
                <div className="list-line1">{p.name}</div>
                <div className="list-line2">{`${state.labels.productOf} ${state.countries.find(c => c.id === productInfo.countryId).name}`}</div>
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