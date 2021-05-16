import {useState, useEffect} from 'react'
import {getMessage, changePassword} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation } from 'react-router'
import { patterns } from '../data/config'

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordInvalid, setOldPasswordInvalid] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordInvalid, setNewPasswordInvalid] = useState(false)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast();
  useEffect(() => {
    setOldPasswordInvalid(!patterns.password.test(oldPassword))
  }, [oldPassword])
  useEffect(() => {
    setNewPasswordInvalid(!patterns.password.test(newPassword))
  }, [newPassword])

  useEffect(() => {
    if (error) {
      message(error, 3000)
      setError('')
    }
  }, [error, message])

  const handleSubmit = async () => {
    try{
      setInprocess(true)
      await changePassword(oldPassword, newPassword)
      setInprocess(false)
      message(labels.changePasswordSuccess, 3000)
      history.goBack()
    } catch (err){
      setInprocess(false)
      setError(getMessage(location.pathname, err))
    }
  }
  return (
    <IonPage>
      <Header title={labels.changePassword} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating" color={oldPasswordInvalid ? 'danger' : ''}>
              {labels.oldPassword}
            </IonLabel>
            <IonInput 
              value={oldPassword} 
              type="number" 
              autofocus
              clearInput
              onIonChange={e => setOldPassword(e.detail.value!)} 
              color={oldPasswordInvalid ? 'danger' : ''}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color={newPasswordInvalid ? 'danger' : ''}>
              {labels.newPassword}
            </IonLabel>
            <IonInput 
              value={newPassword} 
              type="number" 
              clearInput
              onIonChange={e => setNewPassword(e.detail.value!)} 
              color={newPasswordInvalid ? 'danger' : ''}
            />
          </IonItem>
        </IonList>
        {!oldPasswordInvalid && !newPasswordInvalid && 
          <IonButton expand="block" fill="clear" onClick={handleSubmit}>{labels.submit}</IonButton>
        }
      </IonContent>
      <IonLoading
        isOpen={inprocess}
        message={labels.inprocess}
      />
    </IonPage>
  )
}
export default ChangePassword
