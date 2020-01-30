import React, { useContext, useState, useEffect, useRef } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar, Searchbar, NavRight, Link, Badge, Actions, ActionsButton, ActionsLabel } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import PackImage from './pack-image'
import moment from 'moment'
import labels from '../data/labels'
import { sortByList } from '../data/config'
import { isSubCategory } from '../data/actions'

const Packs = props => {
  const { state } = useContext(StoreContext)
  const [packs, setPacks] = useState([])
  const [category] = useState(() => state.categories.find(category => category.id === props.id))
  const [sortBy, setSortBy] = useState('v')
  const sortList = useRef('')
  useEffect(() => {
    setPacks(() => {
      const packs = state.packs.filter(p => !props.id || (props.type === 'f' && state.userInfo.favorites?.includes(p.productId)) || (props.type === 'a' && isSubCategory(p.categoryId, props.id, state.categories)) || (props.type === 'n' && p.categoryId === props.id))
      return packs.sort((p1, p2) => p1.weightedPrice - p2.weightedPrice)  
    })
  }, [state.packs, state.userInfo, props.id, props.type, state.categories])
  const handleSorting = sortByValue => {
    setSortBy(sortByValue)
    switch(sortByValue){
      case 'p':
        setPacks([...packs].sort((p1, p2) => p1.price - p2.price))
        break
      case 's':
        setPacks([...packs].sort((p1, p2) => p2.sales - p1.sales))
        break
      case 'r':
        setPacks([...packs].sort((p1, p2) => p2.rating - p1.rating))
        break
      case 'o':
        setPacks([...packs].sort((p1, p2) => p2.isOffer - p1.isOffer))
        break
      case 'v':
        setPacks([...packs].sort((p1, p2) => p1.weightedPrice - p2.weightedPrice))
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
          {packs.length > 1 ?
            <ListItem 
              title={labels.sortBy} 
              after={sortByList.find(o => o.id === sortBy).name}
              onClick={() => sortList.current.open()}
            />
          : ''}
          {packs.length === 0 ?
            <ListItem title={labels.noData} />
          : packs.map(p => 
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
      <Actions ref={sortList}>
        <ActionsLabel>{labels.sortBy}</ActionsLabel>
        {sortByList.map(o => 
          o.id === sortBy ? ''
          : <ActionsButton key={o.id} onClick={() => handleSorting(o.id)}>{o.name}</ActionsButton>
        )}
      </Actions>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Packs