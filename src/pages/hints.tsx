import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {productOfText} from '../data/actions'
import {Pack} from '../data/types'
import Footer from './footer'
import { IonContent, IonImg, IonItem, IonLabel, IonList, IonPage, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import { useParams } from 'react-router'
import { randomColors } from '../data/config'

type Params = {
  id: string,
  type: string
}
type ExtendedPack = Pack & {
  categoryName: string,
  countryName: string,
  trademarkName?: string
}
const Hints = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [pack] = useState(() => state.packs.find(p => p.id === params.id))
  const [packs, setPacks] = useState<ExtendedPack[]>([])
  useEffect(() => {
    setPacks(() => {
      const packs = state.packs.filter(p => 
        (params.type === 'a' && p.product.id !== pack?.product.id && p.product.categoryId === pack?.product.categoryId) ||
        (params.type === 'p' && p.id !== pack?.id && p.product.id === pack?.product.id)
      )
      const results = packs.map(p => {
        const categoryInfo = state.categories.find(c => c.id === p.product.categoryId)!
        const trademarkInfo = state.trademarks.find(t => t.id === p.product.trademarkId)
        const countryInfo = state.countries.find(c => c.id === p.product.countryId)!
        return {
          ...p, 
          categoryName: categoryInfo.name,
          countryName: countryInfo.name,
          trademarkName: trademarkInfo?.name
        }
      })
      return results.sort((p1, p2) => p1.weightedPrice! - p2.weightedPrice!)  
    })
  }, [pack, state.packs, state.categories, state.trademarks, state.countries, params.type]) 
  return(
    <IonPage>
      <Header title={params.type === 'a' ? labels.otherProducts : labels.otherPacks} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {packs.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : packs.map(p => 
              <IonItem key={p.id} routerLink={`/pack-details/${p.id}/type/c`}>
                <IonThumbnail slot="start">
                  <IonImg src={p.imageUrl || p.product.imageUrl} alt={labels.noImage} />
                </IonThumbnail>
                <IonLabel>
                  <IonText color={randomColors[0].name}>{p.product.name}</IonText>
                  <IonText color={randomColors[1].name}>{p.product.description}</IonText>
                  <IonText color={randomColors[2].name}>{p.name}</IonText>
                  <IonText color={randomColors[3].name}>{productOfText(p.countryName, p.trademarkName)}</IonText>
                  <IonText color={randomColors[4].name}>{p.categoryName}</IonText>
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

export default Hints