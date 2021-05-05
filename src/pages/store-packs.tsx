import {useContext, useState, useEffect} from 'react'
import {Block, Page, Navbar, List, ListItem, NavRight, Searchbar, Link} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import 'moment/locale/ar'
import labels from '../data/labels'
import {productOfText} from '../data/actions'
import {Pack} from '../data/types'

type ExtendedPack = Pack & {
  countryName: string,
  trademarkName?: string,
  storePrice: number,
  stores: number,
  nearStores: number,
  bestPriceStores: number,
  bestPriceNearStores: number
}

const StorePacks = () => {
  const {state} = useContext(StateContext)
  const [storeLocation] = useState(() => state.stores.find(s => s.id === state.userInfo?.storeId)?.locationId)
  const [packs, setPacks] = useState<ExtendedPack[]>([])
  useEffect(() => {
    setPacks(() => {
      const packs = state.packs.filter(p => state.packStores.find(pr => pr.packId === p.id && pr.storeId === state.userInfo?.storeId))
      const results = packs.map(p => {
        const trademarkInfo = state.trademarks.find(t => t.id === p.product.trademarkId)
        const countryInfo = state.countries.find(c => c.id === p.product.countryId)!
        const storePrice = state.packStores.find(pr => pr.packId === p.id && pr.storeId === state.userInfo?.storeId)?.price!
        const stores = state.packStores.filter(pr => pr.packId === p.id).length
        const nearStores = state.packStores.filter(pr => pr.packId === p.id && state.stores.find(s => s.id === pr.storeId)?.locationId === storeLocation).length
        const bestPriceStores = state.packStores.filter(pr => pr.packId === p.id && pr.price === p.price).length
        const bestPriceNearStores = state.packStores.filter(pr => pr.packId === p.id && pr.price === p.price && state.stores.find(s => s.id === pr.storeId)?.locationId === storeLocation).length
        return {
          ...p,
          countryName: countryInfo.name,
          trademarkName: trademarkInfo?.name,
          storePrice,
          stores,
          nearStores,
          bestPriceStores,
          bestPriceNearStores
        }
      })
      return results.sort((r1, r2) => r1.name > r2.name ? 1 : -1)
    })
  }, [state.packStores, state.packs, state.userInfo, state.trademarks, state.countries, state.packRequests, state.stores, storeLocation])
  let i = 0
  return(
    <Page>
      <Navbar title={labels.myPacks} backLink={labels.back} >
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
        </List>
        <List mediaList className="search-list searchbar-found">
          {packs.length === 0 ? 
            <ListItem title={labels.noData} /> 
          : packs.map(p => 
              <ListItem
                link={`/pack-details/${p.id}`}
                title={p.product.name}
                subtitle={p.product.description}
                text={p.name}
                footer={`${labels.bestPrice}: ${p.price!.toFixed(2)}`}
                after={p.storePrice > 0 ? p.storePrice.toFixed(2): ''}
                key={i++}
              >
                <img src={p.imageUrl} slot="media" className="img-list" alt={labels.noImage} />
                <div className="list-subtext1">{productOfText(p.countryName, p.trademarkName)}</div>
                <div className="list-subtext2">{`${labels.storesCount}: ${p.stores}, ${labels.nearBy}: ${p.nearStores}`}</div>
                <div className="list-subtext3">{`${labels.bestStoresCount}: ${p.bestPriceStores}, ${labels.nearBy}: ${p.bestPriceNearStores}`}</div>
              </ListItem>
            )
          }
        </List>
      </Block>
    </Page>
  )
}

export default StorePacks
