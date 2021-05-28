import {useState, useContext} from 'react'
import {addClaim, getMessage} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation, useParams } from 'react-router'
import { StateContext } from '../data/state-provider'
import { warningOutline } from 'ionicons/icons'
import Footer from './footer'

type Params = {
  storeId: string,
  packId: string
}
const StoreDetails = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [store] = useState(() => state.stores.find(s => s.id === params.storeId)!)
  const [message] = useIonToast();
  const location = useLocation()
  const history = useHistory()
  const [alert] = useIonAlert();
  const handleAddClaim = () => {
    alert({
      header: labels.claimTitle,
      message: labels.claimText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: async () => {
          try{
            const packStore = state.packStores.find(s => s.storeId === params.storeId && s.packId === params.packId)
            if (packStore?.claimUserId === state.user?.uid){
              throw new Error('duplicateClaims')
            }
            addClaim(params.storeId, params.packId, state.packStores)
            message(labels.sendSuccess, 3000)
            history.goBack()
          } catch(err) {
            message(getMessage(location.pathname, err), 3000)
          }
        }},
      ],
    })
  }
  return (
    <IonPage>
      <Header title={store.type === 'd' ? labels.salesmanDetails : labels.storeDetails} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">
              {labels.name}
            </IonLabel>
            <IonInput 
              value={store.name} 
              readonly
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              {labels.mobile}
            </IonLabel>
            <IonInput 
              value={store.mobile} 
              readonly
            />
          </IonItem>
          {store.type !== 'd' && <>
            <IonItem>
              <IonLabel position="floating">
                {labels.region}
              </IonLabel>
              <IonInput 
                value={state.regions.find(r => r.id === store.regionId)?.name || ''} 
                readonly
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">
                {labels.address}
              </IonLabel>
              <IonInput 
                value={store.address} 
                readonly
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">
                {labels.alarmsCount}
              </IonLabel>
              <IonInput 
                value={store.claimsCount} 
                readonly
              />
            </IonItem>
          </>}
        </IonList>
        {store.type !== 'd' && 
          <div className="ion-padding" style={{textAlign: 'center'}}>
            <IonButton 
              fill="solid" 
              style={{width: '10rem'}}
              routerLink={`/map/${store.position?.lat}/${store.position?.lng}/0`}
            >
              {labels.map}
            </IonButton>
          </div>
        }
      </IonContent>
      {!state.userInfo?.storeId &&
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleAddClaim} color="danger">
            <IonIcon ios={warningOutline}/>
          </IonFabButton>
        </IonFab>
      }
      <Footer />
    </IonPage>
  )
}
export default StoreDetails
