import {useContext, useEffect, useState} from 'react'
import {f7, Block, Page, Navbar, List, ListItem, Toolbar, Actions, ActionsButton} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import Footer from './footer'
import { Pack, PackStore, Store } from '../data/types'
import { productOfText } from '../data/actions'

type ExtendedBasket = PackStore & {
  storeInfo: Store,
  packInfo: Pack,
  countryName: string,
  categoryName: string,
  trademarkName?: string
}
const Basket = () => {
  const {state, dispatch} = useContext(StateContext)
  const [currentPack, setCurrentPack] = useState<PackStore | undefined>(undefined)
  const [basket, setBasket] = useState<ExtendedBasket[]>([])
  const [actionOpened, setActionOpened] = useState(false);
  useEffect(() => {
    setBasket(() => {
      return state.basket.map(p => {
        const storeInfo = state.stores.find(s => s.id === p.storeId)!
        const packInfo = state.packs.find(pp => pp.id === p.packId)!
        const countryName = state.countries.find(c => c.id === packInfo.product.countryId)!.name
        const categoryName = state.categories.find(c => c.id === packInfo.product.categoryId)!.name
        const trademarkName = state.trademarks.find(t => t.id === packInfo.product.trademarkId)?.name
        return {
          ...p,
          storeInfo,
          packInfo,
          countryName,
          categoryName,
          trademarkName
        }
      })
    })
  }, [state.basket, state.stores, state.packs, state.categories, state.countries, state.trademarks])
  const handleMore = (packStore: PackStore) => {
    setCurrentPack(packStore)
    setActionOpened(true)
  }
  return(
    <Page>
    <Navbar title={labels.basket} backLink={labels.back} />
    <Block>
      <List mediaList>
        {basket.length === 0 ?
          <ListItem title={labels.noData} />
        : basket.map(p => 
          <ListItem
            title={p.packInfo.product.name}
            subtitle={p.packInfo.product.description}
            text={p.packInfo.name}
            footer={`${labels.bestPrice}: ${p.packInfo.price?.toFixed(2)}`}
            after={p.price?.toFixed(2)}
            key={p.packId}
            className={(currentPack && currentPack.packId === p.packId) ? 'selected' : ''}
            onClick={()=> handleMore(p)}
          >
            <img src={p.packInfo.imageUrl} slot="media" className="img-list" alt={labels.noImage}/>
            <div className="list-subtext1">{p.categoryName}</div>
            <div className="list-subtext2">{productOfText(p.countryName, p.trademarkName)}</div>
            <div className="list-subtext3">{`${p.storeInfo.name}-${state.locations.find(l => l.id === p.storeInfo.locationId)?.name}`}</div>
          </ListItem>
        )}
      </List>
    </Block>
    <Actions opened={actionOpened} onActionsClosed={() => setActionOpened(false)}>
      <ActionsButton onClick={() => f7.views.current.router.navigate(`/pack-details/${currentPack?.packId}`)}>
        {labels.details}
      </ActionsButton>
      <ActionsButton onClick={() => dispatch({type: 'DELETE_FROM_BASKET', payload: currentPack})}>
        {labels.delete}
      </ActionsButton>
    </Actions>
    <Toolbar bottom>
      <Footer />
    </Toolbar>
  </Page>
  )
}
export default Basket