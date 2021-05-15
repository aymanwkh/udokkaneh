import {useState, useEffect, useContext} from 'react'
import {getMessage, addPasswordRequest} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonPage, useIonToast } from '@ionic/react'
import Header from './headeri'
import { useHistory, useLocation } from 'react-router'
import { StateContext } from '../data/state-provider'
import { patterns } from '../data/config'

const PasswordRequest = () => {
  const {state} = useContext(StateContext)
  const [mobile, setMobile] = useState('')
  const [mobileInvalid, setMobileInvalid] = useState(false)
  const [error, setError] = useState('')
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast();
  useEffect(() => {
    setMobileInvalid(!mobile || !patterns.mobile.test(mobile))
  }, [mobile])
  useEffect(() => {
    if (error) {
      message(error, 3000)
      setError('')
    }
  }, [error, message])
  const handlePasswordRequest = () => {
    try{
      if (state.passwordRequests.find(r => r.mobile === mobile)) {
        throw new Error('duplicatePasswordRequest')
      }
      addPasswordRequest(mobile)
      message(labels.sendSuccess, 3000)
      history.goBack()
    } catch (err){
      setError(getMessage(location.pathname, err))
    }
  }

  return (
    <IonPage>
      <Header title={labels.passwordRequest} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating" color={mobileInvalid ? 'danger' : ''}>
              {labels.mobile}
            </IonLabel>
            <IonInput 
              value={mobile} 
              type="number" 
              autofocus
              clearInput
              onIonChange={e => setMobile(e.detail.value!)} 
              color={mobileInvalid ? 'danger' : ''}
            />
          </IonItem>
        </IonList>
        {!mobileInvalid &&  
          <IonButton expand="block" fill="clear" onClick={handlePasswordRequest}>{labels.send}</IonButton>
        }
      </IonContent>
    </IonPage>
  )
}
export default PasswordRequest
