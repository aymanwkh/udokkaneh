import React, { useContext, useState, useEffect } from 'react'
import { f7, Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Actions, ActionsButton, ActionsLabel } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import PackImage from './pack-image'
import moment from 'moment'
import labels from '../data/labels'
import { orderByList } from '../data/config'
import { isSubCategory } from '../data/actions'

const Packs = props => {
  const { state } = useContext(StoreContext)
  const [packs, setPacks] = useState([])
  const [orderedPacks, setOrderedPacks] = useState([])
  const [category] = useState(() => state.categories.find(category => category.id === props.id))
  const [orderBy, setOrderBy] = useState('v')
  useEffect(() => {
    setPacks(() => {
      const packs = state.packs.filter(p => !props.id || (props.type === 'f' && state.userInfo.favorites?.includes(p.productId)) || (props.type === 'a' && isSubCategory(p.categoryId, props.id, state.categories)) || (props.type === 'n' && p.categoryId === props.id))
      return packs.sort((p1, p2) => p1.weightedPrice - p2.weightedPrice)  
    })
  }, [state.packs, state.userInfo, props.id, props.type, state.categories])
  useEffect(() => {
    setOrderedPacks(packs)
  }, [packs])
  const handleOrdering = orderByValue => {
    setOrderBy(orderByValue)
    switch(orderByValue){
      case 'p':
        setOrderedPacks([...orderedPacks].sort((p1, p2) => p1.price - p2.price))
        break
      case 's':
        setOrderedPacks([...orderedPacks].sort((p1, p2) => p2.sales - p1.sales))
        break
      case 'r':
        setOrderedPacks([...orderedPacks].sort((p1, p2) => p2.rating - p1.rating))
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
      <Navbar title={category?.name || (props.type === 'f' ? labels.favorites : labels.allProducts)} backLink={labels.back}>
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

      <Block>
        <List className="searchbar-not-found">
          <ListItem title={labels.noData} />
        </List>
        <List mediaList className="search-list searchbar-found">
          {orderedPacks.length > 0 ?
            <ListItem 
              link="#"
              title={labels.orderBy} 
              after={orderByList.find(o => o.id === orderBy).name}
              onClick={() => f7.actions.open('#actions')}
            />
          : ''}
          {orderedPacks.length === 0 ?
            <ListItem title={labels.noData} />
          : orderedPacks.map(p => 
              <ListItem
                link={`/pack-details/${p.id}/type/c`}
                title={p.productName}
                subtitle={p.name}
                text={`${labels.productOf} ${p.trademark ? labels.company + ' ' + p.trademark + '-' : ''}${p.country}`}
                footer={p.offerEnd ? `${labels.offerUpTo}: ${moment(p.offerEnd.toDate()).format('Y/M/D')}` : ''}
                after={(p.price / 1000).toFixed(3)}
                key={p.id}
              >
                <PackImage slot="media" pack={p} type="list" />
                {p.isOffer ? <Badge slot="title" color='green'>{labels.offer}</Badge> : ''}
              </ListItem>
            )
          }
        </List>
      </Block>
      <Actions id="actions">
        <ActionsLabel>{labels.orderBy}</ActionsLabel>
        {orderByList.map(o => 
          o.id === orderBy ? ''
          : <ActionsButton key={o.id} onClick={() => handleOrdering(o.id)}>{o.name}</ActionsButton>
        )}
      </Actions>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Packs