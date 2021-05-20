import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {randomColors} from '../data/config'
import {getCategoryName, getChildren, productOfText} from '../data/actions'
import {Pack} from '../data/types'
import Footer from './footer'
import { IonContent, IonImg, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import { useParams } from 'react-router'
import Fuse from "fuse.js";

type ExtendedPack = Pack & {
  categoryName: string,
  countryName: string,
  trademarkName?: string,
  myPrice?: number
}
type Params = {
  id: string,
  type: string
}
const Packs = () => {
  const {state, dispatch} = useContext(StateContext)
  const params = useParams<Params>()
  const [packs, setPacks] = useState<ExtendedPack[]>([])
  const [category] = useState(() => state.categories.find(category => category.id === params.id))
  const [sortBy, setSortBy] = useState('v')
  const [data, setData] = useState<ExtendedPack[]>([])
  useEffect(() => {
    setPacks(() => {
      const children = params.type === 'a' ? getChildren(params.id, state.categories) : [params.id]
      const packs = state.packs.filter(p => params.type === 's' ? state.packStores.find(s => s.packId === p.id && s.storeId === state.userInfo?.storeId) : p.price! > 0 && children.includes(p.product.categoryId))
      const results = packs.map(p => {
        const categoryInfo = state.categories.find(c => c.id === p.product.categoryId)!
        const trademarkInfo = state.trademarks.find(t => t.id === p.product.trademarkId)
        const countryInfo = state.countries.find(c => c.id === p.product.countryId)!
        const myPrice = state.userInfo?.storeId ? state.packStores.find(s => s.packId === p.id && s.storeId === state.userInfo?.storeId)?.price : 0
        return {
          ...p,
          categoryName: getCategoryName(categoryInfo, state.categories),
          trademarkName: trademarkInfo?.name,
          countryName: countryInfo.name,
          myPrice
        }
      })
      return results.sort((p1, p2) => p1.weightedPrice! - p2.weightedPrice!)
    })
  }, [state.packs, state.userInfo, params.id, params.type, state.categories, state.trademarks, state.countries, state.packStores])
  useEffect(() => {
    dispatch({type: 'CLEAR_SEARCH'})
  }, [dispatch])
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
        setPacks([...packs].sort((p1, p2) => p1.price! - p2.price!))
        break
      case 'r':
        setPacks([...packs].sort((p1, p2) => (p2.product.rating * p2.product.ratingCount) - (p1.product.rating * p1.product.ratingCount)))
        break
      case 'v':
        setPacks([...packs].sort((p1, p2) => p1.weightedPrice! - p2.weightedPrice!))
        break
      default:
    }
  }
  return(
    <IonPage>
      <Header title={params.type === 's' ? labels.myPacks : category?.name || labels.allProducts} withSearch/>
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {data.length > 1 &&
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
                  <IonText color={randomColors[0].name}>{p.myPrice ? `${labels.myPrice}:${p.myPrice.toFixed(2)}` : ''}</IonText>
                </IonLabel>
                <IonLabel slot="end" className="price">{p.price!.toFixed(2)}</IonLabel>
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