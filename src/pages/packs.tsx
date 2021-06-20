import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {colors} from '../data/config'
import {getChildren, productOfText} from '../data/actions'
import {CachedPack, PackStore} from '../data/types'
import Footer from './footer'
import { IonContent, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import { useParams } from 'react-router'
import Fuse from "fuse.js"
import RatingStars from './rating-stars'

type ExtendedPack = CachedPack & {
  packStoreInfo?: PackStore
}
type Params = {
  id: string,
  type: string,
  storeId: string
}
const Packs = () => {
  const {state, dispatch} = useContext(StateContext)
  const params = useParams<Params>()
  const [packs, setPacks] = useState<ExtendedPack[]>([])
  const [category] = useState(() => state.categories.find(category => category.id === params.id))
  const [sortBy, setSortBy] = useState('v')
  const [data, setData] = useState<ExtendedPack[]>([])
  const [title, setTitle] = useState('')
  useEffect(() => {
    return function cleanUp() {
      dispatch({type: 'CLEAR_SEARCH'})
    }
  }, [dispatch])
  useEffect(() => {
    setTitle(() => {
      switch (params.type) {
        case 's':
          return `${labels.packs}-${state.stores.find(s => s.id === params.storeId)?.name}`
        case 'r':
          return labels.requests
        case 'a':
          return labels.allProducts
        case 'p':
          return labels.otherProducts
        default:
          return category?.name || ''
      }
    })
  }, [params, state.stores, category])
  useEffect(() => {
    setPacks(() => {
      let packs
      switch (params.type){
        case 'a':
          const children = getChildren(params.id, state.categories)
          packs = state.cachedPacks.filter(p => (p.price! > 0 || (state.userInfo?.type === 's' && p.forSale) || (state.userInfo && ['w', 'd'].includes(state.userInfo.type))) && children.includes(p.product.categoryId))
          break
        case 's':
          packs = state.cachedPacks.filter(p => state.packStores.find(s => s.packId === p.id && s.storeId === params.storeId))
          break
        case 'r':
          packs = state.cachedPacks.filter(p => state.storeRequests.find(r => r.packId === p.id))
          break
        case 'p':
          const pack = state.packs.find(p => p.id === params.id)
          packs = state.cachedPacks.filter(p => p.product.id !== pack?.product.id && p.product.categoryId === pack?.product.categoryId)
          break
        default:
          packs = state.cachedPacks.filter(p => (p.price! > 0 || (state.userInfo?.type === 's' && p.forSale) || (state.userInfo && ['w', 'd'].includes(state.userInfo.type))) && p.product.categoryId === params.id)
      }
      const results = packs.map(p => {
        const packStoreInfo = state.packStores.find(s => s.packId === p.id && s.storeId === (params.storeId === '0' ? state.userInfo?.storeId : params.storeId))
        return {
          ...p,
          packStoreInfo
        }
      })
      return results.sort((p1, p2) => p1.weightedPrice! - p2.weightedPrice!)
    })
  }, [state.packs, state.userInfo, params, state.categories, state.trademarks, state.countries, state.packStores, state.storeRequests])
  useEffect(() => {
    if (!state.searchText) {
      setData(packs)
      return
    }
    const options = {
      includeScore: true,
      findAllMatches: true,
      threshold: 0.1,
      keys: ['product.name', 'product.alias', 'name', 'categoryName', 'trademarkName', 'countryName']
    }
    const fuse = new Fuse(packs, options);
    const result = fuse.search(state.searchText);
    setData(result.map(p => p.item));
  }, [state.searchText, packs])
  const handleSorting = (sortByValue: string) => {
    setSortBy(sortByValue)
    switch(sortByValue){
      case 'p':
        setPacks([...packs].sort((p1, p2) => (p1.price! - (p1.withGift ? 0.01 : 0)) - (p2.price! - (p2.withGift ? 0.01 : 0))))
        break
      case 'r':
        setPacks([...packs].sort((p1, p2) => (p1.product.rating === 0 ? 2.5 : p1.product.rating) === (p2.product.rating === 0 ? 2.5 : p2.product.rating) ? (p2.product.ratingCount - p1.product.ratingCount) : (p2.product.rating === 0 ? 2.5 : p2.product.rating) - (p1.product.rating === 0 ? 2.5 : p1.product.rating)))
        break
      case 'v':
        setPacks([...packs].sort((p1, p2) => (p1.weightedPrice! - (p1.withGift ? 0.01 : 0)) - (p2.weightedPrice! - (p2.withGift ? 0.01 : 0))))
        break
      default:
    }
  }
  return(
    <IonPage>
      <Header title={title} withSearch/>
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {data.length > 1 && ['a', 'c'].includes(params.type) && <>
            <IonText style={{marginBottom: '2px', color: 'blue'}}>{labels.sortBy}</IonText>
            <IonSegment value={sortBy} onIonChange={e => handleSorting(e.detail.value!)}>
              <IonSegmentButton value="v">
                <IonLabel>{labels.value}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="r">
                <IonLabel>{labels.rating}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="p">
                <IonLabel>{labels.price}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </>}
          {data.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : data.map(p => 
              <IonItem key={p.id} routerLink={`/pack-details/${p.id}`}>
                <IonThumbnail slot="start">
                  <img src={p.imageUrl || p.product.imageUrl} alt={labels.noImage} />
                </IonThumbnail>
                <IonLabel>
                  <IonText style={{color: colors[0].name}}>{p.product.name}</IonText>
                  <IonText style={{color: colors[1].name}}>{p.product.alias}</IonText>
                  <IonText style={{color: colors[2].name}}>{p.name}</IonText>
                  <IonText style={{color: colors[3].name}}>{p.categoryName}</IonText>
                  <IonText style={{color: colors[4].name}}>{productOfText(p.countryName, p.trademarkName)}</IonText>
                  <IonText style={{color: colors[5].name}}>{params.type !== 's' && p.packStoreInfo ? `${labels.myPrice}:${p.packStoreInfo?.price.toFixed(2)} ${p.packStoreInfo?.isActive ? '' : '(' + labels.inActive + ')'}` : ''}</IonText>
                  <IonText style={{color: colors[6].name}}>{params.type === 'r' ? `${labels.requestsCount}:${state.storeRequests.filter(r => r.packId === p.id).length}` : ''}</IonText>
                  <IonText><RatingStars rating={p.product.rating} count={p.product.ratingCount} size="s" /></IonText>
                </IonLabel>
                <IonLabel slot="end" className={params.type === 's' && !p.packStoreInfo?.isActive ? 'price-off' : 'price'}><IonText style={{color: 'red', fontSize: '1rem'}}>{params.type === 's' ? p.packStoreInfo?.price.toFixed(2) : p.price! > 0 ? p.price!.toFixed(2) : ''}</IonText></IonLabel>
              </IonItem>    
            )
          }
        </IonList>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export default Packs