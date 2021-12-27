import { useMemo } from 'react'
import { IonCard, IonCol, IonContent, IonGrid, IonImg, IonPage, IonRow } from '@ionic/react'
import Header from './header'
import labels from '../data/labels'
import { useSelector } from 'react-redux'
import { Advert, State } from '../data/types'

const AdvertDetail = () => {
  const adverts = useSelector<State, Advert[]>(state => state.adverts)
  const advert = useMemo(() => adverts[0], [adverts])
  return (
    <IonPage>
      <Header title={labels.advert} />
      <IonContent fullscreen>
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol className="card-title">{advert.title}</IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                {advert.imageUrl && <IonImg src={advert.imageUrl} alt={advert.title} />}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">{advert.text}</IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default AdvertDetail
