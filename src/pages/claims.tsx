import { useContext, useState } from 'react'
import { StateContext } from '../data/state-provider'
import labels from '../data/labels'
import Footer from './footer'
import { IonContent, IonImg, IonItem, IonLabel, IonList, IonPage, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import moment from 'moment'
import 'moment/locale/ar'
import { colors } from '../data/config'
import { getCategoryName, productOfText } from '../data/actions'

const Claims = () => {
  const { state } = useContext(StateContext)
  const [claims] = useState(() => {
    const claims = state.packStores.filter(s => s.storeId === state.userInfo?.storeId && s.claimUserId)
    const result = claims.map(c => {
      const packInfo = state.packs.find(p => p.id === c.packId)!
      const categoryInfo = state.categories.find(c => c.id === packInfo.product.categoryId)!
      const trademarkName = state.trademarks.find(t => t.id === packInfo.product.trademarkId)?.name
      const countryName = state.countries.find(c => c.id === packInfo.product.countryId)!.name
      return {
        ...c,
        packInfo,
        categoryName: getCategoryName(categoryInfo, state.categories),
        trademarkName,
        countryName
      }

    })
    return result.sort((c1, c2) => c1.time > c2.time ? 1 : -1)
  })
  return(
    <IonPage>
      <Header title={labels.claims} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {claims.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : claims.map(c => 
            <IonItem key={c.packId} routerLink={`/pack-details/${c.packId}`}>
              <IonThumbnail slot="start">
                <IonImg src={c.packInfo.imageUrl || c.packInfo.product.imageUrl} alt={labels.noImage} />
              </IonThumbnail>
              <IonLabel>
                <IonText style={{color: colors[0].name}}>{c.packInfo.product.name}</IonText>
                <IonText style={{color: colors[1].name}}>{c.packInfo.product.alias}</IonText>
                <IonText style={{color: colors[2].name}}>{c.packInfo.name}</IonText>
                <IonText style={{color: colors[3].name}}>{c.categoryName}</IonText>
                <IonText style={{color: colors[4].name}}>{productOfText(c.countryName, c.trademarkName)}</IonText>
                <IonText style={{color: colors[5].name}}>{c.isActive ? labels.oneClaim : labels.twoClaims}</IonText>
                <IonText style={{color: colors[6].name}}>{moment(c.time).fromNow()}</IonText>
              </IonLabel>
              <IonLabel slot="end" className={c.isActive ? 'price' : 'price-off'}>{c.price!.toFixed(2)}</IonLabel>
          </IonItem>    
          )}
        </IonList>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export default Claims