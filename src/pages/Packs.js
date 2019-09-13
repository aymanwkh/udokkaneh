import React, { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Button, Popover} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';

const Packs = props => {
  const { state } = useContext(StoreContext)
  let packs = state.packs.filter(rec => props.id ? state.products.find(product => product.id === rec.productId).category === props.id : true)
  packs = packs.filter(rec => rec.stores.length > 0)
  const [categoryPacks, setCategoryPacks] = useState(packs)
  const category = state.categories.find(category => category.id === props.id)
  const [orderBy, setOrderBy] = useState('p')

  const sort = () => {
    switch(orderBy){
      case 'p':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => pack1.price - pack2.price))
        break
      case 's':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => pack2.sales - pack1.sales))
        break
      case 'r':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => pack2.rating - pack1.rating))
        break
      default:
        return null
    }
  }
  useEffect(() => {
    sort(orderBy)
  }, [orderBy])

  const orderByList = state.orderByList.filter(rec => rec.id !== orderBy)
  const orderByListTags = orderByList.map(orderByItem => 
    <ListItem 
      link="#" 
      popoverClose 
      key={orderByItem.id} 
      title={orderByItem.name} 
      onClick={() => setOrderBy(orderByItem.id)}/> 
  )
  return(
    <Page>
      <Navbar title={category ? category.name : state.labels.allProducts} backLink="Back">
        <NavRight>
          <Link searchbarEnable=".searchbar-demo" iconIos="f7:search" iconAurora="f7:search" iconMd="material:search"></Link>
        </NavRight>
        <Searchbar
          className="searchbar-demo"
          searchContainer=".search-list"
          searchIn=".item-title, .item-subtitle"
          clearButton
          expandable
          placeholder={state.labels.search}
        />
      </Navbar>
      <Block inset>
        <Button raised popoverOpen=".popover-menu">{`${state.labels.orderBy} ${state.orderByList.find(rec => rec.id === orderBy).name}`}</Button>
      </Block>
      <Popover className="popover-menu">
        <List>
          {orderByListTags}
        </List>
      </Popover>
      <Block>
        <List className="searchbar-not-found">
          <ListItem title={state.labels.not_found} />
        </List>
        <List mediaList className="search-list searchbar-found">
          {categoryPacks && categoryPacks.map(pack => {
            const productInfo = state.products.find(rec => rec.id === pack.productId)
            return (
              <ListItem
                link={`/pack/${pack.id}`}
                title={productInfo.name}
                after={(pack.price / 1000).toFixed(3)}
                subtitle={pack.name}
                text={`${state.labels.productOf} ${state.countries.find(rec => rec.id === productInfo.country).name}`}
                key={pack.id}
              >
                <img slot="media" src={productInfo.imageUrl} width="80" className="lazy lazy-fadeIn demo-lazy" alt=""/>
                {productInfo.isNew ? <Badge slot="title" color="red">{state.labels.new}</Badge> : null}
                {pack.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : null}
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