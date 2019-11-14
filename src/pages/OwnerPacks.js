import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';
import moment from 'moment'
import 'moment/locale/ar'

const OwnerPacks = props => {
  const { state } = useContext(StoreContext)
  let ownerPacks = useMemo(() => {
    let ownerPacks = state.packs.filter(pack => pack.stores.find(store => store.id === state.customer.storeId))
    ownerPacks = ownerPacks.map(pack => {
      const productInfo = state.products.find(rec => rec.id === pack.productId)
      return {
        id: pack.id,
        productName: productInfo.name,
        name: pack.name,
        isNew: productInfo.isNew,
        isOffer: pack.isOffer,
        price: pack.stores.find(rec => rec.id === props.id).price,
        time: pack.stores.find(rec => rec.id === props.id).time,
        imageUrl: productInfo.imageUrl
      }
    })
    return ownerPacks.sort((rec1, rec2) => rec2.time.seconds - rec1.time.seconds)
  }, [state.packs, state.products, state.customer, props.id])
  const store = useMemo(() => state.stores.find(rec => rec.id === state.customer.storeId)
  , [state.stores, state.customer])
  return(
    <Page>
      <Navbar title={`${store.name}`} backLink={state.labels.back}>
        <NavRight>
          <Link searchbarEnable=".searchbar" iconMaterial="search"></Link>
        </NavRight>
        <Searchbar
          className="searchbar"
          searchContainer=".search-list"
          searchIn=".item-title, .item-subtitle"
          clearButton
          expandable
          placeholder={state.labels.search}
        ></Searchbar>
      </Navbar>
      <Block>
        <List className="searchbar-not-found">
          <ListItem title={state.labels.noData} />
        </List>
        <List mediaList className="search-list searchbar-found">
          {ownerPacks.map(pack => 
            <ListItem
              link={`/pack/${pack.id}`}
              title={pack.productName}
              after={(pack.price / 1000).toFixed(3)}
              subtitle={pack.name}
              text={moment(pack.time.toDate()).fromNow()}
              key={pack.id}
            >
              <img slot="media" src={pack.imageUrl} className="lazy lazy-fadeIn avatar" alt={pack.productName} />
              {pack.isNew ? <Badge slot="title" color='red'>{state.labels.new}</Badge> : ''}
              {pack.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
              <Badge slot="footer" color='green'> {state.labels.myPrice} {(pack.stores.find(rec => rec.id === state.customer.storeId).price / 1000).toFixed(3)} </Badge>
            </ListItem>
          )}
          {ownerPacks.length === 0 ? <ListItem title={state.labels.noData} /> : ''}
        </List>
      </Block>

      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default OwnerPacks
