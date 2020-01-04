import React, { useContext, useState, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Popover } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import PackImage from './pack-image'
import moment from 'moment'
import labels from '../data/labels'
import { orderByList } from '../data/config'

const Packs = props => {
  const { state } = useContext(StoreContext)
  const packs = useMemo(() => {
    let packs = state.packs.filter(p => props.id ? state.products.find(pr => pr.id === p.productId).categoryId === props.id : true)
    packs = packs.map(p => {
      const productInfo = state.products.find(pr => pr.id === p.productId)
      return {
        ...p,
        productInfo,
      }
    })
    return packs.sort((p1, p2) => p1.weightedPrice - p2.weightedPrice)
  }, [state.packs, state.products, props.id]) 
  const [orderedPacks, setOrderedPacks] = useState(packs)
  const category = useMemo(() => state.categories.find(category => category.id === props.id)
  , [state.categories, props.id])
  const [orderBy, setOrderBy] = useState('v')
  const handleOrdering = orderByValue => {
    setOrderBy(orderByValue)
    switch(orderByValue){
      case 'p':
        setOrderedPacks([...orderedPacks].sort((p1, p2) => p1.price - p2.price))
        break
      case 's':
        setOrderedPacks([...orderedPacks].sort((p1, p2) => p2.productInfo.sales - p1.productInfo.sales))
        break
      case 'r':
        setOrderedPacks([...orderedPacks].sort((p1, p2) => p2.productInfo.rating - p1.productInfo.rating))
        break
      case 'o':
        setOrderedPacks([...orderedPacks].sort((p1, p2) => p2.isOffer - p1.isOffer))
        break
      case 'v':
        setOrderedPacks([...orderedPacks].sort((p1, p2) => p1.weightedPrice - p2.weightedPrice))
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
      <Popover className="ordering-menu">
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
            popoverOpen=".ordering-menu"
            title={labels.orderBy} 
            after={orderByList.find(o => o.id === orderBy).name}
          />
          {orderedPacks.map(p => 
            <ListItem
              link={`/pack-details/${p.id}`}
              title={p.productInfo.name}
              subtitle={p.name}
              text={`${labels.productOf} ${p.productInfo.trademark ? labels.company + ' ' + p.productInfo.trademark + '-' : ''}${p.productInfo.country}`}
              footer={p.offerEnd ? `${labels.offerUpTo}: ${moment(p.offerEnd.toDate()).format('Y/M/D')}` : ''}
              after={(p.price / 1000).toFixed(3)}
              key={p.id}
            >
              <PackImage slot="media" pack={p} type="list" />
              {p.isOffer ? <Badge slot="title" color='green'>{labels.offer}</Badge> : ''}
            </ListItem>
          )}
        </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Packs