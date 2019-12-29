import React, { useContext, useState, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Popover } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import { StoreContext } from '../data/store'
import PackImage from './PackImage'
import moment from 'moment'

const Packs = props => {
  const { state } = useContext(StoreContext)
  const packs = useMemo(() => {
    let packs = state.packs.filter(p => p.price > 0 && (props.id ? state.products.find(pr => pr.id === p.productId).categoryId === props.id : true))
    return packs.sort((p1, p2) => p1.price - p2.price)
  }, [state.packs, state.products, props.id]) 
  const [categoryPacks, setCategoryPacks] = useState(packs)
  const category = state.categories.find(category => category.id === props.id)
  const [orderBy, setOrderBy] = useState('p')
  const orderByList = useMemo(() => state.orderByList.filter(o => o.id !== orderBy)
  , [state.orderByList, orderBy]) 
  const handleOrdering = orderByValue => {
    setOrderBy(orderByValue)
    switch(orderByValue){
      case 'p':
        setCategoryPacks([...categoryPacks].sort((p1, p2) => p1.price - p2.price))
        break
      case 's':
        setCategoryPacks([...categoryPacks].sort((p1, p2) => state.products.find(p => p.id === p2.productId).sales - state.products.find(p => p.id === p1.productId).sales))
        break
      case 'r':
        setCategoryPacks([...categoryPacks].sort((p1, p2) => state.products.find(p => p.id === p2.productId).rating - state.products.find(p => p.id === p1.productId).rating))
        break
      case 'o':
        setCategoryPacks([...categoryPacks].sort((p1, p2) => p2.isOffer - p1.isOffer))
        break
      case 'v':
        setCategoryPacks([...categoryPacks].sort((p1, p2) => p1.weightedPrice - p2.weightedPrice))
        break
      case 't':
        setCategoryPacks([...categoryPacks].sort((p1, p2) => state.products.find(p => p.id === p1.productId).name > state.products.find(p => p.id === p2.productId).name ? 1 : -1))
        break
      default:
    }
  }
  return(
    <Page>
      <Navbar title={category?.name || state.labels.allProducts} backLink={state.labels.back}>
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
        />
      </Navbar>
      <Popover className="popover-menu">
        <List>
        {orderByList.map(o => 
          <ListItem 
            link="#" 
            popoverClose 
            key={o.id} 
            title={o.name} 
            onClick={() => handleOrdering(o.id)}
          />
        )}
        </List>
      </Popover>
      <Block>
        <List className="searchbar-not-found">
          <ListItem title={state.labels.noData} />
        </List>
        <List mediaList className="search-list searchbar-found">
          <ListItem 
            link="#"
            popoverOpen=".popover-menu"
            title={state.labels.orderBy} 
            after={state.orderByList.find(o => o.id === orderBy).name}
          />
          {categoryPacks.map(p => {
            const productInfo = state.products.find(pr => pr.id === p.productId)
            const storePackInfo = state.customer.storeId ? state.storePacks.find(pa => pa.storeId === state.customer.storeId && pa.packId === p.id) : ''
            return (
              <ListItem
                link={`/pack/${p.id}`}
                title={productInfo.name}
                subtitle={p.name}
                text={`${state.labels.productOf} ${state.countries.find(c => c.id === productInfo.countryId).name}`}
                footer={p.offerEnd ? `${state.labels.offerUpTo}: ${moment(p.offerEnd.toDate()).format('Y/M/D')}` : ''}
                after={(p.price / 1000).toFixed(3)}
                key={p.id}
              >
                <PackImage slot="media" pack={p} type="list" />
                {productInfo.isNew ? <Badge slot="title" color="red">{state.labels.new}</Badge> : ''}
                {p.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
                {storePackInfo ? <Badge slot="footer" color='green'> {state.labels.myPrice} {(storePackInfo.price / 1000).toFixed(3)} </Badge> : ''}
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

export default Packs