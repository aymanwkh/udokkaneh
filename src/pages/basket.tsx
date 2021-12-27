import { useMemo } from 'react'
import labels from '../data/labels'
import { productOfText } from '../data/actions'
import { BasketItem, CachedPack, State } from '../data/types'
import Footer from './footer'
import { IonContent, IonItem, IonLabel, IonList, IonPage, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import { colors } from '../data/config'
import { useSelector } from 'react-redux'

const Basket = () => {
  const cachedPacks = useSelector<State, CachedPack[]>(state => state.cachedPacks)
  const basket = useSelector<State, BasketItem[]>(state => state.basket)
  const basketItems = useMemo(() => basket.map(b => cachedPacks.find(p => p.id === b.packId)!), [basket, cachedPacks])
  return(
    <IonPage>
      <Header title={labels.basket} />
      <IonContent fullscreen>
        <IonList className="ion-padding">
          {basketItems.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : basketItems.map(p => 
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