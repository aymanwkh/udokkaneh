import React, { useContext, useState, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Popover } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';

const Packs = props => {
  const { state } = useContext(StoreContext)
  const packs = useMemo(() => {
    let packs = state.packs.filter(rec => props.id ? state.products.find(product => product.id === rec.productId).category === props.id : true)
    packs = packs.filter(rec => rec.price > 0)
    return packs.sort((pack1, pack2) => pack1.price - pack2.price)
  }, [state.packs, state.products, props.id]) 
  const [categoryPacks, setCategoryPacks] = useState(packs)
  const category = state.categories.find(category => category.id === props.id)
  const [orderBy, setOrderBy] = useState('p')
  const handleOrdering = orderByValue => {
    setOrderBy(orderByValue)
    switch(orderByValue){
      case 'p':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => pack1.price - pack2.price))
        break
      case 's':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => pack2.sales - pack1.sales))
        break
      case 'r':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => pack2.rating - pack1.rating))
        break
      case 'o':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => pack2.isOffer - pack1.isOffer))
        break
      case 'v':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => pack1.value - pack2.value))
        break
      case 't':
        setCategoryPacks([...categoryPacks].sort((pack1, pack2) => state.products.find(rec => rec.id === pack1.productId).name > state.products.find(rec => rec.id === pack2.productId).name ? 1 : -1))
        break
      default:
    }
  }
  const orderByList = useMemo(() => state.orderByList.filter(rec => rec.id !== orderBy)
  , [state.orderByList, orderBy]) 
  return(
    <Page>
      <Navbar title={category ? category.name : state.labels.allProducts} backLink={state.labels.back}>
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
        {orderByList.map(rec => 
          <ListItem 
            link="#" 
            popoverClose 
            key={rec.id} 
            title={rec.name} 
            onClick={() => handleOrdering(rec.id)}
          />
        )}
        </List>
      </Popover>
      <Block>
        <List className="searchbar-not-found">
          <ListItem title={state.labels.not_found} />
        </List>
        <List mediaList className="search-list searchbar-found">
          <ListItem 
            link="#"
            popoverOpen=".popover-menu"
            title={state.labels.orderBy} 
            after={state.orderByList.find(rec => rec.id === orderBy).name}
          />
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
                <img slot="media" src={productInfo.imageUrl} className="lazy lazy-fadeIn avatar" alt=""/>
                {productInfo.isNew ? <Badge slot="title" color="red">{state.labels.new}</Badge> : ''}
                {pack.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
                {state.customer.type === 'o' && pack.stores.find(rec => rec.id === state.customer.storeId) ? <Badge slot="footer" color='green'> {state.labels.myPrice} {(pack.stores.find(rec => rec.id === state.customer.storeId).price / 1000).toFixed(3)} </Badge> : ''}
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