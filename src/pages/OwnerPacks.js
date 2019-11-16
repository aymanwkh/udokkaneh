import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';
import moment from 'moment'
import 'moment/locale/ar'

const OwnerPacks = props => {
  const { state } = useContext(StoreContext)
  let ownerPacks = useMemo(() => {
    let ownerPacks = state.packs.filter(pack => pack.stores.find(store => store.id === props.id))
    return ownerPacks.sort((rec1, rec2) => rec1.price - rec2.price)
  }, [state.packs, props.id])
  const store = useMemo(() => state.stores.find(rec => rec.id === props.id)
  , [state.stores, props.id])
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
          {ownerPacks.map(pack => {
            const productInfo = state.products.find(rec => rec.id === pack.productId)
            return (
              <ListItem
                link={`/pack/${pack.id}`}
                title={productInfo.name}
                after={(pack.price / 1000).toFixed(3)}
                subtitle={pack.name}
                text={moment(pack.stores.find(rec => rec.id === props.id).time.toDate()).fromNow()}
                key={pack.id}
              >
                <img slot="media" src={productInfo.imageUrl} className="lazy lazy-fadeIn avatar" alt={pack.productName} />
                {productInfo.isNew ? <Badge slot="title" color='red'>{state.labels.new}</Badge> : ''}
                {pack.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
                <Badge slot="footer" color='green'> {state.labels.myPrice} {(pack.stores.find(rec => rec.id === props.id).price / 1000).toFixed(3)} </Badge>
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
