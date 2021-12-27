import { useMemo } from 'react'
import labels from '../data/labels'
import Footer from './footer'
import { IonContent, IonImg, IonItem, IonLabel, IonList, IonPage, IonText, IonThumbnail } from '@ionic/react'
import Header from './header'
import moment from 'moment'
import 'moment/locale/ar'
import { colors } from '../data/config'
import { getCategoryName, productOfText } from '../data/actions'
import { useSelector } from 'react-redux'
import { Category, Country, Pack, PackStore, State, Trademark, UserInfo } from '../data/types'

const Claims = () => {
  const packStores = useSelector<State, PackStore[]>(state => state.packStores)
  const packs = useSelector<State, Pack[]>(state => state.packs)
  const categories = useSelector<State, Category[]>(state => state.categories)
  const trademarks = useSelector<State, Trademark[]>(state => state.trademarks)
  const countries = useSelector<State, Country[]>(state => state.countries)
  const userInfo = useSelector<State, UserInfo | undefined>(state => state.userInfo)
  const claims = useMemo(() => 
    packStores
      .filter(s => s.storeId === userInfo?.storeId && s.claimUserId)
      .map(c => {
        const packInfo = packs.find(p => p.id === c.packId)!
        const categoryInfo = categories.find(c => c.id === packInfo.product.categoryId)!
        const trademarkName = trademarks.find(t => t.id === packInfo.product.trademarkId)?.name
        const countryName = countries.find(c => c.id === packInfo.product.countryId)!.name
        return {
          ...c,
          packInfo,
          categoryName: getCategoryName(categoryInfo, categories),
          trademarkName,
          countryName
        }})
      .sort((c1, c2) => c1.time > c2.time ? 1 : -1)
  , [packStores, packs, categories, trademarks, countries, userInfo])
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