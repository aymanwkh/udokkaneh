import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Badge } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import PackImage from './pack-image'
import moment from 'moment'
import labels from '../data/labels'

const OtherOffers = props => {
  const { state } = useContext(StoreContext)
  const pack = useMemo(() => state.packs.find(p => p.id === props.id)
  , [state.packs, props.id])
  const offers = useMemo(() => {
    const productPack = state.products.find(p => p.id === pack.productId)
    let offers = state.packs.filter(p => state.products.find(pr => pr.id === p.productId && pr.categoryId === productPack.categoryId) && (p.isOffer || p.offerEnd))
    offers = offers.filter(p => p.id !== pack.id && p.price > 0)
    offers = offers.map(o => {
      const productInfo = state.products.find(pr => pr.id === o.productId)
      const countryInfo = state.countries.find(c => c.id === productInfo.countryId)
      const storePackInfo = state.customer.storeId ? state.storePacks.find(pa => pa.storeId === state.customer.storeId && pa.packId === o.id) : ''
      return {
        ...o,
        productInfo,
        countryInfo,
        storePackInfo
      }
    })
    return offers.sort((p1, p2) => p1.price - p2.price)
  }, [pack, state.packs, state.products, state.storePacks, state.customer, state.countries]) 
  return(
    <Page>
      <Navbar title={labels.offers} backLink={labels.back} />
      <Block>
        <List mediaList>
          {offers.map(p => {
            return (
              <ListItem
                link={`/pack/${p.id}`}
                title={p.productInfo.name}
                subtitle={p.name}
                text={`${labels.productOf} ${p.countryInfo.name}`}
                footer={p.offerEnd ? `${labels.offerUpTo}: ${moment(p.offerEnd.toDate()).format('Y/M/D')}` : ''}
                after={(p.price / 1000).toFixed(3)}
                key={p.id}
              >
                <PackImage slot="media" pack={p} type="list" />
                {p.storePackInfo ? <div className="list-subtext1">{labels.myPrice}: {(p.storePackInfo.price / 1000).toFixed(3)}</div> : ''}
                {p.isOffer ? <Badge slot="title" color='green'>{labels.offer}</Badge> : ''}
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