import React, { useContext, useState, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Popover } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';

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
      <Navbar title={category?.name ?? state.labels.allProducts} backLink={state.labels.back} className="page-title">
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
            const bonusProduct = p.bonusPackId ? state.products.find(pr => pr.id === state.packs.find(pa => pa.id === p.bonusPackId).productId) : ''
            return (
              <ListItem
                link={`/pack/${p.id}`}
                title={productInfo.name}
                subtitle={p.name}
                after={(p.price / 1000).toFixed(3)}
                key={p.id}
              >
                <div slot="media" className="relative">
                  <img slot="media" src={productInfo.imageUrl} className="img-list" alt={productInfo.name} />
                  {p.offerQuantity > 1 ? <span slot="media" className="offer-quantity-list">{`× ${p.offerQuantity}`}</span> : ''}
                  {p.bonusPackId ? 
                    <div>
                      <img slot="media" src={bonusProduct.imageUrl} className="bonus-img-list" alt={bonusProduct.name} />
                      {p.bonusQuantity > 1 ? <span slot="media" className="bonus-quantity-list">{`× ${p.bonusQuantity}`}</span> : ''}
                    </div>
                  : ''}
                </div>
                {productInfo.isNew ? <Badge slot="title" color="red">{state.labels.new}</Badge> : ''}
                {p.isOffer || p.hasOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : ''}
                {storePackInfo ? <Badge slot="footer" color='green'> {state.labels.myPrice} {(storePackInfo.price / 1000).toFixed(3)} </Badge> : ''}
                <div className="list-line1">{`${state.labels.productOf} ${state.countries.find(c => c.id === productInfo.countryId).name}`}</div>
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