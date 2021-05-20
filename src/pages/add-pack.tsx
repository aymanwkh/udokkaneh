import {useState, useContext} from 'react'
import {getMessage, addPackRequest} from '../data/actions'
import labels from '../data/labels'
import { IonContent, IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation, useParams } from 'react-router'
import { StateContext } from '../data/state-provider'
import { checkmarkOutline } from 'ionicons/icons'

type Params = {
  id: string
}
const AddPack = () => {
  const {state} = useContext(StateContext)
  const params = useParams<Params>()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [product] = useState(() => state.packs.find(p => p.id === params.id)!.product)
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast()
  const handleSubmit = () => {
    try{
      if (+price <= 0 || +price !== Number((+price).toFixed(2))) {
        throw new Error('invalidPrice')
      }
      const packRequest = {
        id: Math.random().toString(),
        storeId: state.userInfo?.storeId!,
        siblingPackId: params.id,
        name,
        specialImage: false,
        price: +price,
        time: new Date()
      }
      addPackRequest(packRequest)
      message(labels.sendRequestSuccess, 3000)
      history.goBack()
    } catch(err) {
			message(getMessage(location.pathname, err), 3000)
		}
  }
  return (
    <IonPage>
      <Header title={labels.addPack} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">
              {labels.productName}
            </IonLabel>
            <IonInput 
              value={product.name} 
              readonly
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              {labels.weightVolume}
            </IonLabel>
            <IonInput 
              value={name} 
              type="text" 
              autofocus
              clearInput
              onIonChange={e => setName(e.detail.value!)} 
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              {labels.price}
            </IonLabel>
            <IonInput 
              value={price} 
              type="number" 
              clearInput
              onIonChange={e => setPrice(e.detail.value!)} 
            />
          </IonItem>
        </IonList>
        {price && name &&
          <IonFab vertical="top" horizontal="end" slot="fixed">
            <IonFabButton onClick={handleSubmit}>
              <IonIcon ios={checkmarkOutline} />
            </IonFabButton>
          </IonFab>
        }
      </IonContent>
    </IonPage>
  )
}
export default AddPack
