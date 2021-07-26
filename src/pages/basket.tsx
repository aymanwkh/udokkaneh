import { useContext, useState, useEffect } from 'react'
import { StateContext } from '../data/state-provider'
import labels from '../data/labels'
import { productOfText } from '../data/actions'
import { CachedPack } from '../data/types'
import Footer from './footer'
import { IonContent, IonItem, IonLabel, IonList, IonPage, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import { colors } from '../data/config'

const Basket = () => {
  const { state } = useContext(StateContext)
  const [basket, setBasket] = useState<CachedPack[]>([])
  useEffect(() => {
    setBasket(() => state.basket.map(b => state.cachedPacks.find(p => p.id === b.packId)!))
  }, [state.basket, state.stores, state.packs, state.categories, state.countries, state.trademarks, state.cachedPacks])
  return(
    <IonPage>
      <Header title={labels.basket} />
      <IonContent fullscreen>
        <IonList className="ion-padding">
          {basket.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : basket.map(p => 
              <IonItem key={p.id} routerLink={`/pack-details/${p.id}`}>
                <IonThumbnail slot="start">
                  <img src={p.imageUrl || p.product.imageUrl} alt={labels.noImage} style={{width: '100%'}} />
                </IonThumbnail>
                <IonLabel>
                  <IonText style={{color: colors[0].name}}>{p.product.name}</IonText>
                  <IonText style={{color: colors[1].name}}>{p.product.alias}</IonText>
                  <IonText style={{color: colors[2].name}}>{p.name}</IonText>
                  <IonText style={{color: colors[3].name}}>{p.categoryName}</IonText>
                  <IonText style={{color: colors[4].name}}>{productOfText(p.countryName, p.trademarkName)}</IonText>
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