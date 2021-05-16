import {useState, useEffect, useContext} from 'react'
import {addAlarm, getMessage} from '../data/actions'
import labels from '../data/labels'
import { IonActionSheet, IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation, useParams } from 'react-router'
import { StateContext } from '../data/state-provider'
import { menuOutline } from 'ionicons/icons'

type Params = {
  storeId: string,
  packId: string
}
const StoreDetails = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [store, setStore] = useState(() => state.stores.find(s => s.id === params.storeId)!)
  const [actionOpened, setActionOpened] = useState(false);
  const [error, setError] = useState('')
  const [message] = useIonToast();
  const location = useLocation()
  const history = useHistory()
  const [alert] = useIonAlert();
  useEffect(() => {
    setStore(() => state.stores.find(s => s.id === params.storeId)!)
  }, [state.stores, params.storeId])
  useEffect(() => {
    if (error) {
      message(error, 3000)
      setError('')
    }
  }, [error, message])
  const handleAddAlarm = (type: string) => {
    alert({
      header: labels.confirmationTitle,
      message: labels.confirmationText,
      buttons: [
        {text: labels.cancel},
        {text: labels.ok, handler: async () => {
          try{
            if (state.alarms.find(a => a.storeId === params.storeId && a.time === new Date())){
              throw new Error('duplicateAlarms')
            }
            const alarm = {
              packId: params.packId,
              storeId: params.storeId,
              type,
              time: new Date()  
            }
            addAlarm(alarm)
            message(labels.sendSuccess, 3000)
            history.goBack()
          } catch(err) {
            setError(getMessage(location.pathname, err))
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
        </IonList>
      </IonContent>
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setActionOpened(true)}>
          <IonIcon ios={menuOutline} />
        </IonFabButton>
      </IonFab>
      <IonActionSheet
        isOpen={actionOpened}
        onDidDismiss={() => setActionOpened(false)}
        buttons={[
          {
            text: labels.addNotFoundAlarm,
            cssClass: 'success',
            handler: () => handleAddAlarm('m')
          },
          {
            text: labels.addChangePriceAlarm,
            cssClass: 'warning',
            handler: () => handleAddAlarm('p')
          },
        ]}
      />
    </IonPage>
  )
}
export default StoreDetails
