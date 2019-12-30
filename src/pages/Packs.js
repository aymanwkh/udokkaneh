import React, { useContext, useState, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Popover } from 'framework7-react'
import BottomToolbar from './BottomToolbar'
import { StoreContext } from '../data/store'
import PackImage from './PackImage'
import moment from 'moment'
import labels from '../data/labels'
import { orderByList } from '../data/config'

const Packs = props => {
  const { state } = useContext(StoreContext)
  const packs = useMemo(() => {
    let packs = state.packs.filter(p => p.price > 0 && (props.id ? state.products.find(pr => pr.id === p.productId).categoryId === props.id : true))
    return packs.sort((p1, p2) => p1.price - p2.price)
  }, [state.packs, state.products, props.id]) 
  const [categoryPacks, setCategoryPacks] = useState(packs)
  const category = state.categories.find(category => category.id === props.id)
  const [orderBy, setOrderBy] = useState('p')
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
      <Navbar title={category?.name || labels.allProducts} backLink={labels.back}>
        <NavRight>
          <Link searchbarEnable=".searchbar" iconMaterial="search"></Link>
        </NavRight>
        <Searchbar
          className="searchbar"
          searchContainer=".search-list"
          searchIn=".item-title, .item-subtitle"
          clearButton
          expandable
          placeholder={labels.search}
        />
      </Navbar>
      <Popover className="popover-menu">
        <List>
        {orderByList.map(o => 
          o.id === orderBy ? ''
          : <ListItem 
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
          <ListItem title={labels.noData} />
        </List>
        <List mediaList className="search-list searchbar-found">
          <ListItem 
            link="#"
            popoverOpen=".popover-menu"
            title={labels.orderBy} 
            after={orderByList.find(o => o.id === orderBy).name}
          />
          {categoryPacks.map(p => {
            const productInfo = state.products.find(pr => pr.id === p.productId)
            const storePackInfo = state.customer.storeId ? state.storePacks.find(pa => pa.storeId === state.customer.storeId && pa.packId === p.id) : ''
            return (
              <ListItem
                link={`/pack/${p.id}`}
                title={productInfo.name}
                subtitle={p.name}
                text={`${labels.productOf} ${state.countries.find(c => c.id === productInfo.countryId).name}`}
                footer={p.offerEnd ? `${labels.offerUpTo}: ${moment(p.offerEnd.toDate()).format('Y/M/D')}` : ''}
                after={(p.price / 1000).toFixed(3)}
                key={p.id}
              >
                <PackImage slot="media" pack={p} type="list" />
                {storePackInfo ? <div className="list-subtext1">{labels.myPrice}: {(storePackInfo.price / 1000).toFixed(3)}</div> : ''}
                {productInfo.isNew ? <Badge slot="title" color="red">{labels.new}</Badge> : ''}
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

export default Packs