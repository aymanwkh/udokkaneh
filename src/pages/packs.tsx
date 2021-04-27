import { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Searchbar, NavRight, Link, Badge, Actions, ActionsButton, ActionsLabel } from 'framework7-react'
import { StateContext } from '../data/state-provider'
import labels from '../data/labels'
import { sortByList } from '../data/config'
import { getChildren, productOfText } from '../data/actions'
import { Pack } from '../data/types'

type Props = {
  id: string,
  type: string
}
type ExtendedPack = Pack & {
  categoryName: string,
  countryName: string,
  trademarkName?: string
}
const Packs = (props: Props) => {
  const { state } = useContext(StateContext)
  const [packs, setPacks] = useState<ExtendedPack[]>([])
  const [category] = useState(() => state.categories.find(category => category.id === props.id))
  const [sortBy, setSortBy] = useState(() => sortByList.find(s => s.id === 'v'))
  const [actionOpened, setActionOpened] = useState(false);
  useEffect(() => {
    setPacks(() => {
      const children = props.type === 'a' ? getChildren(props.id, state.categories) : [props.id]
      const packs = state.packs.filter(p => !props.id || (props.type === 'f' && state.userInfo?.favorites?.includes(p.product.id)) || children.includes(p.product.categoryId))
      let extendedPacks = packs.map(p => {
        const categoryInfo = state.categories.find(c => c.id === p.product.categoryId)!
        const trademarkInfo = state.trademarks.find(t => t.id === p.product.trademarkId)
        const countryInfo = state.countries.find(c => c.id === p.product.countryId)!
        return {
          ...p,
          categoryName: categoryInfo.name,
          trademarkName: trademarkInfo?.name,
          countryName: countryInfo.name,
        }
      })
      return extendedPacks.sort((p1, p2) => p1.weightedPrice - p2.weightedPrice)
    })
  }, [state.packs, state.userInfo, props.id, props.type, state.categories, state.trademarks, state.countries])
  const handleSorting = (sortByValue: string) => {
    setSortBy(() => sortByList.find(s => s.id === sortByValue))
    switch(sortByValue){
      case 'p':
        setPacks([...packs].sort((p1, p2) => p1.price - p2.price))
        break
      case 'r':
        setPacks([...packs].sort((p1, p2) => p2.product.rating - p1.product.rating))
        break
      case 'o':
        setPacks([...packs].sort((p1, p2) => (p2.isOffer || p2.offerEnd ? 1 : 0) - (p1.isOffer || p1.offerEnd ? 1 : 0)))
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
          searchIn=".item-inner"
          clearButton
          expandable
          placeholder={labels.search}
        />
      </Navbar>

      <Block>
        <List className="searchbar-not-found">
          <ListItem title={labels.noData} />
          {state.user && state.userInfo?.storeId && <h3 className="center"><a href="/add-product-request/">{labels.addProductRequest}</a></h3>}
        </List>
        <List mediaList className="search-list searchbar-found">
          {packs.length > 1 &&
            <ListItem 
              title={labels.sortBy} 
              after={sortBy?.name}
              onClick={() => setActionOpened(true)}
            />
          }
          {packs.length === 0 ?
            <ListItem title={labels.noData} />
          : packs.map(p => 
              <ListItem
                link={`/pack-details/${p.id}/type/c`}
                title={p.product.name}
                subtitle={p.product.description}
                text={p.name}
                footer={`${labels.category}: ${p.categoryName}`}
                after={p.isOffer || p.offerEnd ? '' : (p.price / 100).toFixed(2)}
                key={p.id}
              >
                <img src={p.imageUrl} slot="media" className="img-list" alt={labels.noImage} />
                <div className="list-subtext1">{productOfText(p.countryName, p.trademarkName)}</div>
                {(p.isOffer || p.offerEnd) && <Badge slot="after" color="green">{(p.price / 100).toFixed(2)}</Badge>}
              </ListItem>
              
            )
          }
        </List>
      </Block>
      <Actions opened={actionOpened}>
        <ActionsLabel>{labels.sortBy}</ActionsLabel>
        {sortByList.map(o => 
          o.id === sortBy?.id ? ''
          : <ActionsButton key={o.id} onClick={() => handleSorting(o.id)}>{o.name}</ActionsButton>
        )}
      </Actions>
    </Page>
  )
}

export default Packs