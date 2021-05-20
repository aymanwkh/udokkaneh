import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {productOfText} from '../data/actions'
import {Pack} from '../data/types'
import Footer from './footer'
import { IonContent, IonImg, IonItem, IonLabel, IonList, IonPage, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import { randomColors } from '../data/config'

type ExtendedPack = Pack & {
  countryName: string,
  categoryName: string,
  trademarkName?: string
}
const Basket = () => {
  const {state} = useContext(StateContext)
  const [basket, setBasket] = useState<ExtendedPack[]>([])
  useEffect(() => {
    setBasket(() => {
      return state.basket.map(b => {
        const packInfo = state.packs.find(p => p.id === b)!
        const countryName = state.countries.find(c => c.id === packInfo.product.countryId)!.name
        const categoryName = state.categories.find(c => c.id === packInfo.product.categoryId)!.name
        const trademarkName = state.trademarks.find(t => t.id === packInfo.product.trademarkId)?.name
        return {
          ...packInfo,
          countryName,
          categoryName,
          trademarkName
        }
      })
    })
  }, [state.basket, state.stores, state.packs, state.categories, state.countries, state.trademarks])
  return(
    <IonPage>
      <Header title={labels.basket} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {basket.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : basket.map(p => 
              <IonItem 
                key={p.id} 
                routerLink={`/pack-details/${p.id}`}
              >
                <IonThumbnail slot="start">
                  <IonImg src={p.imageUrl || p.product.imageUrl} alt={labels.noImage} />
                </IonThumbnail>
                <IonLabel>
                  <IonText color={randomColors[0].name}>{p.product.name}</IonText>
                  <IonText color={randomColors[1].name}>{p.product.alias}</IonText>
                  <IonText color={randomColors[2].name}>{p.name}</IonText>
                  <IonText color={randomColors[3].name}>{p.categoryName}</IonText>
                  <IonText color={randomColors[4].name}>{productOfText(p.countryName, p.trademarkName)}</IonText>
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

export default Basket