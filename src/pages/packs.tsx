import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {randomColors} from '../data/config'
import {getCategoryName, getChildren, productOfText} from '../data/actions'
import {Pack, PackStore} from '../data/types'
import Footer from './footer'
import { IonContent, IonImg, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import { useParams } from 'react-router'
import Fuse from "fuse.js";

type ExtendedPack = Pack & {
  categoryName: string,
  countryName: string,
  trademarkName?: string,
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
  const [title] = useState(() => {
    let title
    switch (params.type) {
      case 's':
        title = `${labels.storePacks} ${state.stores.find(s => s.id === params.storeId)?.name}`
        break
      case 'r':
        title = labels.requests
        break
      case 'n':
        title = labels.notShowedPacks
        break
      case 'a':
        title = labels.allProducts
        break
      case 'p':
        title = labels.otherProducts
        break
      default:
        title = category?.name
    }
    return title
  })
  useEffect(() => {
    setPacks(() => {
      let packs
      switch (params.type){
        case 'a':
          const children = getChildren(params.id, state.categories)
          packs = state.packs.filter(p => p.price! > 0 && children.includes(p.product.categoryId))
          break
        case 's':
          packs = state.packs.filter(p => state.packStores.find(s => s.packId === p.id && s.storeId === params.storeId))
          break
        case 'r':
          packs = state.packs.filter(p => state.storeRequests.find(r => r.packId === p.id))
          break
        case 'n':
          packs = state.packs.filter(p => p.price! === 0 && p.forSale)
          break
        case 'p':
          const pack = state.packs.find(p => p.id === params.id)
          packs = state.packs.filter(p => p.product.id !== pack?.product.id && p.product.categoryId === pack?.product.categoryId)
          break
        default:
          packs = state.packs.filter(p => p.price! > 0 && p.product.categoryId === params.id)
      }
      const results = packs.map(p => {
        const categoryInfo = state.categories.find(c => c.id === p.product.categoryId)!
        const trademarkName = state.trademarks.find(t => t.id === p.product.trademarkId)?.name
        const countryName = state.countries.find(c => c.id === p.product.countryId)!.name
        const packStoreInfo = state.packStores.find(s => s.packId === p.id && s.storeId === params.storeId)
        return {
          ...p,
          categoryName: getCategoryName(categoryInfo, state.categories),
          trademarkName,
          countryName,
          packStoreInfo
        }
      })
      return results.sort((p1, p2) => p1.weightedPrice! - p2.weightedPrice!)
    })
  }, [state.packs, state.userInfo, params, params.type, state.categories, state.trademarks, state.countries, state.packStores, state.storeRequests])
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
    return function cleanUp() {
      dispatch({type: 'CLEAR_SEARCH'})
    }
  }, [state.searchText, packs, dispatch])
  const handleSorting = (sortByValue: string) => {
    setSortBy(sortByValue)
    switch(sortByValue){
      case 'p':
        setPacks([...packs].sort((p1, p2) => (p1.price! - (p1.withGift ? 0.01 : 0)) - (p2.price! - (p2.withGift ? 0.01 : 0))))
        break
      case 'r':
        setPacks([...packs].sort((p1, p2) => (p2.product.rating * p2.product.ratingCount) - (p1.product.rating * p1.product.ratingCount)))
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
          {data.length > 1 && ['a', 'c'].includes(params.type) &&
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
          }
          {data.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : data.map(p => 
              <IonItem key={p.id} routerLink={`/pack-details/${p.id}`}>
                <IonThumbnail slot="start">
                  <IonImg src={p.imageUrl || p.product.imageUrl} alt={labels.noImage} />
                </IonThumbnail>
                <IonLabel>
                  <IonText color={randomColors[0].name}>{p.product.name}</IonText>
                  <IonText color={randomColors[1].name}>{p.product.alias}</IonText>
                  <IonText color={randomColors[2].name}>{p.name}</IonText>
                  <IonText color={randomColors[3].name}>{p.categoryName}</IonText>
                  <IonText color={randomColors[4].name}>{productOfText(p.countryName, p.trademarkName)}</IonText>
                  <IonText color={randomColors[5].name}>{params.type !== 's' && p.packStoreInfo?.price ? `${labels.myPrice}:${p.packStoreInfo.price.toFixed(2)} ${p.packStoreInfo.isActive ? '' : '(' + labels.inActive + ')'}` : ''}</IonText>
                  <IonText color={randomColors[6].name}>{params.type === 'r' ? `${labels.requestsCount}:${state.storeRequests.filter(r => r.packId === p.id).length}` : ''}</IonText>
                </IonLabel>
                <IonLabel slot="end" className="price">{params.type === 's' ? p.packStoreInfo?.price.toFixed(2) : p.price!.toFixed(2)}</IonLabel>
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