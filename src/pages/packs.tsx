import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {sortByList} from '../data/config'
import {getChildren, productOfText} from '../data/actions'
import {Pack} from '../data/types'
import Footer from './footer'
import { IonContent, IonImg, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonThumbnail } from '@ionic/react'
import Header from './header'
import { useParams } from 'react-router'

type ExtendedPack = Pack & {
  categoryName: string,
  countryName: string,
  trademarkName?: string,
  myPrice: number
}
type Params = {
  id: string,
  type: string
}
const Packs = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [packs, setPacks] = useState<ExtendedPack[]>([])
  const [category] = useState(() => state.categories.find(category => category.id === params.id))
  const [sortBy, setSortBy] = useState('v')
  useEffect(() => {
    setPacks(() => {
      const children = params.type === 'a' ? getChildren(params.id, state.categories) : [params.id]
      const packs = state.packs.filter(p => (params.type === 's' && state.packStores.find(s => s.packId === p.id && s.storeId === state.userInfo?.storeId)) || (p.price! > 0 && children.includes(p.product.categoryId)))
      const results = packs.map(p => {
        const categoryInfo = state.categories.find(c => c.id === p.product.categoryId)!
        const trademarkInfo = state.trademarks.find(t => t.id === p.product.trademarkId)
        const countryInfo = state.countries.find(c => c.id === p.product.countryId)!
        const myPrice = (state.userInfo?.storeId && state.packStores.find(s => s.packId === p.id && s.storeId === state.userInfo?.storeId)?.price) || 0
        return {
          ...p,
          categoryName: categoryInfo.name,
          trademarkName: trademarkInfo?.name,
          countryName: countryInfo.name,
          myPrice
        }
      })
      return results.sort((p1, p2) => p1.weightedPrice! - p2.weightedPrice!)
    })
  }, [state.packs, state.userInfo, params.id, params.type, state.categories, state.trademarks, state.countries, state.packStores])
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
      <Header title={category?.name || labels.allProducts} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {packs.length > 1 &&
            <IonItem>
              <IonLabel>{labels.sortBy}</IonLabel>
              <IonSelect value={sortBy} interface="action-sheet" cancelText={labels.cancel} onIonChange={e => handleSorting(e.detail.value)}>
                {sortByList.map(s => <IonSelectOption key={s.id} value={s.id}>{s.name}</IonSelectOption>)}
              </IonSelect>
            </IonItem>
          }
          {packs.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : packs.map(p => 
              <IonItem key={p.id} routerLink={`/pack-details/${p.id}`}>
                <IonThumbnail slot="start">
                  <IonImg src={p.imageUrl || p.product.imageUrl} alt={labels.noImage} />
                </IonThumbnail>
                <IonLabel>
                  <div className="list-row1">{p.product.name}</div>
                  <div className="list-row2">{p.product.description}</div>
                  <div className="list-row3">{p.name}</div>
                  <div className="list-row4">{p.categoryName}</div>
                  <div className="list-row5">{productOfText(p.countryName, p.trademarkName)}</div>
                  <div className="list-row6">{p.myPrice > 0 ? `${labels.myPrice}:${p.myPrice.toFixed(2)}` : ''}</div>
                </IonLabel>
                <IonLabel slot="end" className="ion-text-end">{p.price!.toFixed(2)}</IonLabel>
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