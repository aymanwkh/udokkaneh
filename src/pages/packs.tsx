import { useState, useEffect } from 'react'
import labels from '../data/labels'
import { colors } from '../data/config'
import { getChildren, productOfText } from '../data/actions'
import { CachedPack, Category, Pack, PackStore, State, Store, StoreRequest, UserInfo } from '../data/types'
import Footer from './footer'
import { IonContent, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import { useParams } from 'react-router'
import Fuse from "fuse.js"
import RatingStars from './rating-stars'
import { useDispatch, useSelector } from 'react-redux'

type ExtendedPack = CachedPack & {
  packStoreInfo?: PackStore
}
type Params = {
  id: string,
  type: string,
  storeId: string
}
const Packs = () => {
  const packs = useSelector<State, Pack[]>(state => state.packs)
  const categories = useSelector<State, Category[]>(state => state.categories)
  const stores = useSelector<State, Store[]>(state => state.stores)
  const cachedPacks = useSelector<State, CachedPack[]>(state => state.cachedPacks)
  const packStores = useSelector<State, PackStore[]>(state => state.packStores)
  const storeRequests = useSelector<State, StoreRequest[]>(state => state.storeRequests)
  const userInfo = useSelector<State, UserInfo | undefined>(state => state.userInfo)
  const searchText = useSelector<State, string>(state => state.searchText)
  const dispatch = useDispatch()
  const params = useParams<Params>()
  const [packList, setPackList] = useState<ExtendedPack[]>([])
  const [category] = useState(() => categories.find(c => c.id === params.id))
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
          return `${labels.packs}-${stores.find(s => s.id === params.storeId)?.name}`
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
  }, [params, stores, category])
  useEffect(() => {
    setPackList(() => {
      let result
      switch (params.type){
        case 'a':
          const children = getChildren(params.id, categories)
          result = cachedPacks.filter(p => (p.price! > 0 || (userInfo?.type === 's' && p.forSale) || (userInfo && ['w', 'd'].includes(userInfo.type))) && children.includes(p.product.categoryId))
          break
        case 's':
          result = cachedPacks.filter(p => packStores.find(s => s.packId === p.id && s.storeId === params.storeId))
          break
        case 'r':
          result = cachedPacks.filter(p => storeRequests.find(r => r.packId === p.id))
          break
        case 'p':
          const pack = packs.find(p => p.id === params.id)
          result = cachedPacks.filter(p => p.product.id !== pack?.product.id && p.product.categoryId === pack?.product.categoryId)
          break
        default:
          result = cachedPacks.filter(p => (p.price! > 0 || (userInfo?.type === 's' && p.forSale) || (userInfo && ['w', 'd'].includes(userInfo.type))) && p.product.categoryId === params.id)
      }
      const results = result.map(p => {
        const packStoreInfo = packStores.find(s => s.packId === p.id && s.storeId === (params.storeId === '0' ? userInfo?.storeId : params.storeId))
        return {
          ...p,
          packStoreInfo
        }
      })
      return results.sort((p1, p2) => p1.weightedPrice! - p2.weightedPrice!)
    })
  }, [packs, userInfo, params, categories, packStores, storeRequests, cachedPacks])
  useEffect(() => {
    if (!searchText) {
      setData(packList)
      return
    }
    const options = {
      includeScore: true,
      findAllMatches: true,
      threshold: 0.1,
      keys: ['product.name', 'product.alias', 'name', 'categoryName', 'trademarkName', 'countryName']
    }
    const fuse = new Fuse(packList, options);
    const result = fuse.search(searchText);
    setData(result.map(p => p.item));
  }, [searchText, packList])
  const handleSorting = (sortByValue: string) => {
    setSortBy(sortByValue)
    switch(sortByValue){
      case 'p':
        setPackList([...packList].sort((p1, p2) => (p1.price! - (p1.withGift ? 0.01 : 0)) - (p2.price! - (p2.withGift ? 0.01 : 0))))
        break
      case 'r':
        setPackList([...packList].sort((p1, p2) => (p1.product.rating === 0 ? 2.5 : p1.product.rating) === (p2.product.rating === 0 ? 2.5 : p2.product.rating) ? (p2.product.ratingCount - p1.product.ratingCount) : (p2.product.rating === 0 ? 2.5 : p2.product.rating) - (p1.product.rating === 0 ? 2.5 : p1.product.rating)))
        break
      case 'v':
        setPackList([...packList].sort((p1, p2) => (p1.weightedPrice! - (p1.withGift ? 0.01 : 0)) - (p2.weightedPrice! - (p2.withGift ? 0.01 : 0))))
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
                  <img src={p.imageUrl || p.product.imageUrl} alt={labels.noImage} style={{width: '100%'}}/>
                </IonThumbnail>
                <IonLabel>
                  <IonText style={{color: colors[0].name}}>{p.product.name}</IonText>
                  <IonText style={{color: colors[1].name}}>{p.product.alias}</IonText>
                  <IonText style={{color: colors[2].name}}>{p.name}</IonText>
                  <IonText style={{color: colors[3].name}}>{p.categoryName}</IonText>
                  <IonText style={{color: colors[4].name}}>{productOfText(p.countryName, p.trademarkName)}</IonText>
                  <IonText style={{color: colors[5].name}}>{params.type !== 's' && p.packStoreInfo ? `${labels.myPrice}:${p.packStoreInfo?.price.toFixed(2)} ${p.packStoreInfo?.isActive ? '' : '(' + labels.inActive + ')'}` : ''}</IonText>
                  <IonText style={{color: colors[6].name}}>{params.type === 'r' ? `${labels.requestsCount}:${storeRequests.filter(r => r.packId === p.id).length}` : ''}</IonText>
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