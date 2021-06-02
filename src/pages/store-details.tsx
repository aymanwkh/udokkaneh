import {useState, useContext} from 'react'
import {addClaim, getMessage} from '../data/actions'
import labels from '../data/labels'
import { IonActionSheet, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation, useParams } from 'react-router'
import { StateContext } from '../data/state-provider'
import { menuOutline } from 'ionicons/icons'
import Footer from './footer'
import { randomColors } from '../data/config'

type Params = {
  storeId: string,
  packId: string
}
const StoreDetails = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [store] = useState(() => state.stores.find(s => s.id === params.storeId)!)
  const [actionOpened, setActionOpened] = useState(false)
  const [message] = useIonToast();
  const location = useLocation()
  const history = useHistory()
  const [alert] = useIonAlert()
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
  let i = 0
  return (
    <IonPage>
      <Header title={store.type === 'd' ? labels.salesmanDetails : labels.storeDetails} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.name}
            </IonLabel>
            <IonInput 
              value={store.name} 
              readonly
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.mobile}
            </IonLabel>
            <IonInput 
              value={store.mobile} 
              readonly
            />
          </IonItem>
          {store.type !== 'd' && <>
            <IonItem>
              <IonLabel position="floating" color="primary">
                {labels.region}
              </IonLabel>
              <IonInput 
                value={state.regions.find(r => r.id === store.regionId)?.name || ''} 
                readonly
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating" color="primary">
                {labels.address}
              </IonLabel>
              <IonInput 
                value={store.address} 
                readonly
              />
            </IonItem>
            {state.userInfo?.type === 'n' &&
              <IonItem>
                <IonLabel position="floating" color="primary">
                  {labels.alarmsCount}
                </IonLabel>
                <IonInput 
                  value={store.claimsCount} 
                  readonly
                />
              </IonItem>
            }
          </>}
        {params.packId !== '0' && <>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.productName}
            </IonLabel>
            <IonInput 
              value={state.packs.find(p => p.id === params.packId)?.product.name} 
              readonly
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.price}
            </IonLabel>
            <IonInput 
              value={state.packStores.find(s => s.packId === params.packId && s.storeId === params.storeId)?.price.toFixed(2)} 
              readonly
            />
          </IonItem>
        </>}
        </IonList>
      </IonContent>
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setActionOpened(true)}>
          <IonIcon ios={menuOutline}/>
        </IonFabButton>
      </IonFab>
      <IonActionSheet
        isOpen={actionOpened}
        onDidDismiss={() => setActionOpened(false)}
        buttons={[
          {
            text: labels.packs,
            cssClass: store.type !== 'r' ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => history.push(`/packs/s/0/${store.id}`)
          },
          {
            text: labels.map,
            cssClass: store.type !== 'd' ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => history.push(`/map/${store.position?.lat}/${store.position?.lng}/0`)
          },
          {
            text: labels.addClaim,
            cssClass: state.userInfo?.type === 'n' || store.type === 'w' ? randomColors[i++ % 7].name : 'ion-hide',
            handler: () => handleAddClaim()
          },
        ]}
      />
      <Footer />
    </IonPage>
  )
}
export default StoreDetails
