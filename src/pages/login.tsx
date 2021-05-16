import {useState, useEffect} from 'react'
import {login, getMessage} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonButtons, IonContent, IonFooter, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonToolbar, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { patterns } from '../data/config'

const Login = () => {
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [passwordInvalid, setPasswordInvalid] = useState(true)
  const [mobileInvalid, setMobileInvalid] = useState(true)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast();
  useEffect(() => {
    setPasswordInvalid(!password || !patterns.password.test(password))
  }, [password])
  useEffect(() => {
    setMobileInvalid(!mobile || !patterns.mobile.test(mobile))
  }, [mobile])
  useEffect(() => {
    if (error) {
      message(error, 3000)
      setError('')
    }
  }, [error, message])

  const handleLogin = async () => {
    try{
      setInprocess(true)
      await login(mobile, password)
      setInprocess(false)
      message(labels.loginSuccess, 3000)
      history.goBack()
    } catch (err){
      setInprocess(false)
      setError(getMessage(location.pathname, err))
    }
  }
  return (
    <IonPage>
      <Header title={labels.login} />
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
          <IonItem>
            <IonLabel position="floating" color={passwordInvalid ? 'danger' : ''}>
              {labels.password}
            </IonLabel>
            <IonInput 
              value={password} 
              type="number" 
              clearInput
              onIonChange={e => setPassword(e.detail.value!)} 
              color={passwordInvalid ? 'danger' : ''}
            />
          </IonItem>
        </IonList>
        {!mobileInvalid && passwordInvalid && 
          <IonButton expand="block" fill="clear" onClick={handleLogin}>{labels.login}</IonButton>
        }
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <Link to="/register">{labels.newUser}</Link>
          </IonButtons>
          <IonButtons slot="end">
            <Link to="/password-request">{labels.forgetPassword}</Link>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
      <IonLoading
        isOpen={inprocess}
        message={labels.inprocess}
      />
    </IonPage>
  )
}
export default Login
