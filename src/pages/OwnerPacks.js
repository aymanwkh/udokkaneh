import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';
import moment from 'moment'
import 'moment/locale/ar'

const OwnerPacks = props => {
  const { state } = useContext(StoreContext)
  let ownerPacks = useMemo(() => {
    let ownerPacks = state.storePacks.filter(p => p.storeId === props.id)
    return ownerPacks.sort((p1, p2) => p1.price - p2.price)
  }, [state.storePacks, props.id])
  const store = useMemo(() => state.stores.find(s => s.id === props.id)
  , [state.stores, props.id])
  return(
    <Page>
      <Navbar title={`${store.name}`} backLink={state.labels.back} className="page-title">
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
          {ownerPacks.map(p => {
            const packInfo = state.packs.find(pa => pa.id === p.packId)
            const productInfo = state.products.find(pr => pr.id === packInfo.productId)
            return (
              <ListItem
                link={`/pack/${p.id}`}
                title={productInfo.name}
                after={(p.price / 1000).toFixed(3)}
                subtitle={packInfo.name}
                text={moment(p.time.toDate()).fromNow()}
                key={p.id}
              >
                <img slot="media" src={productInfo.imageUrl} className="img-list" alt={productInfo.name} />
                {productInfo.isNew ? <Badge slot="title" color='red'>{state.labels.new}</Badge> : ''}
                {packInfo.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
                <Badge slot="footer" color='green'> {state.labels.myPrice} {(p.price / 1000).toFixed(3)} </Badge>
              </ListItem>
            )
          }
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
