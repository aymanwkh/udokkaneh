import {useState, useContext} from 'react'
import {addAlarm, getMessage} from '../data/actions'
import labels from '../data/labels'
import { IonActionSheet, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation, useParams } from 'react-router'
import { StateContext } from '../data/state-provider'
import { thumbsDownOutline } from 'ionicons/icons'

type Params = {
  storeId: string,
  packId: string
}
const StoreDetails = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [store] = useState(() => state.stores.find(s => s.id === params.storeId)!)
  const [alarmsCount] = useState(() => state.alarms.filter(a => a.storeId === params.storeId).length)
  const [actionOpened, setActionOpened] = useState(false);
  const [message] = useIonToast();
  const location = useLocation()
  const history = useHistory()
  const [alert] = useIonAlert();
  const handleAddAlarm = (type: string) => {
    alert({
      header: labels.confirmationTitle,
      message: labels.confirmationText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: async () => {
          try{
            if (state.alarms.find(a => a.userId === state.user?.uid && a.storeId === params.storeId && a.time === new Date())){
              throw new Error('duplicateAlarms')
            }
            const alarm = {
              userId: state.user?.uid!,
              packId: params.packId,
              storeId: params.storeId,
              type,
              time: new Date()  
            }
            addAlarm(alarm)
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
      <Header title={labels.storeDetails} />
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
          <IonItem>
            <IonLabel position="floating">
              {labels.location}
            </IonLabel>
            <IonInput 
              value={state.locations.find(l => l.id === store.locationId)?.name || ''} 
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
              value={alarmsCount} 
              readonly
            />
          </IonItem>
        </IonList>
      </IonContent>
      {!state.userInfo?.storeId &&
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setActionOpened(true)} color="warning">
            <IonIcon ios={thumbsDownOutline}/>
          </IonFabButton>
        </IonFab>
      }
      <IonActionSheet
        isOpen={actionOpened}
        onDidDismiss={() => setActionOpened(false)}
        buttons={[
          {
            text: labels.addNotFoundAlarm,
            cssClass: 'primary',
            handler: () => handleAddAlarm('f')
          },
          {
            text: labels.addChangePriceAlarm,
            cssClass: 'secondary',
            handler: () => handleAddAlarm('p')
          },
        ]}
      />
    </IonPage>
  )
}
export default StoreDetails
