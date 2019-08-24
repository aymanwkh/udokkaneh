import React, { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Button, Popover} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import { StoreContext } from '../data/Store';

const Products = props => {
  const { state, products } = useContext(StoreContext)
  const [categoryProducts, setCategoryProducts] = useState(products.filter(product => props.id ? product.category === props.id : true))
  const category = state.categories.find(category => category.id === props.id)
  const [orderBy, setOrderBy] = useState('p')

  const sort = () => {
    switch(orderBy){
      case 'p':
        setCategoryProducts([...categoryProducts].sort((product1, product2) => product1.price - product2.price))
        break
      case 's':
        setCategoryProducts([...categoryProducts].sort((product1, product2) => product2.sales - product1.sales))
        break
      case 'r':
        setCategoryProducts([...categoryProducts].sort((product1, product2) => product2.rating - product1.rating))
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
      <Navbar title={category ? category.name : 'All Products'} backLink="Back">
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
          {categoryProducts && categoryProducts.map(product => {
            return (
              <ListItem
                link={`/product/${product.id}`}
                title={product.name}
                after={(product.price / 1000).toFixed(3)}
                subtitle={product.description}
                text={`${state.labels.productOf} ${state.countries.find(rec => rec.id === product.country).name}`}
                key={product.id}
              >
                <img slot="media" src={product.imageUrl} width="80" className="lazy lazy-fadeIn demo-lazy" alt=""/>
                {product.isNew ? <Badge slot="title" color="red">{state.labels.new}</Badge> : null}
                {product.isOffer ? <Badge slot="title" color='green'>{state.labels.offer}</Badge> : null}
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

export default Products