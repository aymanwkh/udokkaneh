import {useState, useContext} from 'react'
import {addClaim, getMessage, sendNotification} from '../data/actions'
import labels from '../data/labels'
import { IonActionSheet, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation, useParams } from 'react-router'
import { StateContext } from '../data/state-provider'
import { menuOutline } from 'ionicons/icons'
import Footer from './footer'
import { randomColors, userTypes } from '../data/config'

type Params = {
  storeId: string,
  packId: string
}
const StoreDetails = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [store] = useState(() => state.stores.find(s => s.id === params.storeId)!)
  const [pack] = useState(() => state.packs.find(p => p.id === params.packId))
  const [price] = useState(() => state.packStores.find(s => s.packId === params.packId && s.storeId === params.storeId)?.price)
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
  const handleConfirm = () => {
    const myStore = state.stores.find(s => s.ownerId === state.user?.uid)
    const typeName = userTypes.find(t => t.id === state.userInfo?.type)?.name
    let notificationText: string, messageText: string
    if (myStore?.type === 'd' && ['s', 'r'].includes(store.type)) {
      notificationText = `${labels.doYouWant} ${pack?.product.name} ${pack?.name}`
      messageText = labels.confirmRequest
    } else {
      notificationText = `${labels.isPack} ${pack?.product.name} ${pack?.name} ${labels.exists} ${price?.toFixed(2)}`
      messageText = labels.confirmAvailable
    }
    alert({
      header: labels.confirm,
      message: messageText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: async () => {
          try{
            const confirmMessage = {
              id: Math.random().toString(),
              userId: state.user?.uid || null,
              userName: `${state.userInfo?.name} ${myStore ? '-' + (myStore.type === 'd' ? typeName : myStore.name) : ''}` || '',
              title: labels.confirm,
              message: notificationText,
              isResponse: false,
              time: new Date()
            }        
            sendNotification(store.ownerId!, confirmMessage)
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
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.type}
            </IonLabel>
            <IonInput 
              value={userTypes.find(t => t.id === store.type)?.name} 
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
              value={pack?.product.name} 
              readonly
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="primary">
              {labels.price}
            </IonLabel>
            <IonInput 
              value={price?.toFixed(2)} 
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
          {
            text: labels.confirm,
            cssClass: randomColors[i++ % 7].name,
            handler: () => handleConfirm()
          },
        ]}
      />
      <Footer />
    </IonPage>
  )
}
export default StoreDetails
