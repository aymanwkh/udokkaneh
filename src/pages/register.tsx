import {useState, useEffect, useContext} from 'react'
import {getMessage, registerUser} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonLoading, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation } from 'react-router'
import { Region, UserInfo } from '../data/types'
import { patterns, userTypes } from '../data/config'
import { StateContext } from '../data/state-provider'
import { checkmarkOutline } from 'ionicons/icons'

const Register = () => {
  const {state, dispatch} = useContext(StateContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState<string | null>(null)
  const [nameInvalid, setNameInvalid] = useState(true)
  const [passwordInvalid, setPasswordInvalid] = useState(true)
  const [mobileInvalid, setMobileInvalid] = useState(true)
  const [position, setPosition] = useState({lat: 0, lng: 0})
  const [positionError, setPositionError] = useState(false)
  const [regionId, setRegionId] = useState<string | null>(null)
  const [type, setType] = useState('n')
  const history = useHistory()
  const location = useLocation()
  const [message] = useIonToast()
  const [loading, dismiss] = useIonLoading()
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setPasswordInvalid(!password || !patterns.password.test(password))
  }, [password])
  useEffect(() => {
    setNameInvalid(!name || !patterns.name.test(name))
  }, [name])
  useEffect(() => {
    setMobileInvalid(!mobile || !patterns.mobile.test(mobile))
  }, [mobile])
  useEffect(() => {
    if (state.mapPosition) setPosition(state.mapPosition)
    return function cleanUp() {
      dispatch({type: 'CLEAR_MAP_POSITION'})
    }
  }, [state.mapPosition, dispatch])
  const handleSetPosition = () => {
    loading()
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dismiss()
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        message(labels.browserGPSNote, 3000)
      },
      () => {
        dismiss()
        setPositionError(true)
        message(labels.positionError, 3000)
      }
    );
  }
  const handleRegister = async () => {
    try{
      loading()
      let user: UserInfo = {
        mobile,
        name,
        password,
        position,
        type,
        isActive: type === 'n',
        storeName,
        regionId,
      }
      await registerUser(user)
      dismiss()
      message(type === 'n' ? labels.registerSuccess : labels.registerStoreOwnerSuccess, 3000)
      history.goBack()
    } catch (err){
      dismiss()
      message(getMessage(location.pathname, err), 3000)
    }
  }
  const handlePositionByMap = () => {
    if (position.lat) {
      history.push(`/map/${position.lat}/${position.lng}/1`)
    } else {
      setShowModal(true)
    }
  }
  const goToMap = (region: Region) => {
    setRegionId(region.id)
    history.push(`/map/${region.position.lat}/${region.position.lng}/1`)
    setShowModal(false)
  }
  return (
    <IonPage>
      <Header title={labels.newUser} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating" color={nameInvalid ? 'danger' : 'primary'}>
              {labels.name}
            </IonLabel>
            <IonInput 
              value={name} 
              type="text" 
              placeholder={labels.namePlaceholder}
              autofocus
              clearInput
              onIonChange={e => setName(e.detail.value!)} 
              color={nameInvalid ? 'danger' : ''}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color={mobileInvalid ? 'danger' : 'primary'}>
              {labels.mobile}
            </IonLabel>
            <IonInput 
              value={mobile} 
              type="number" 
              placeholder={labels.mobilePlaceholder}
              clearInput
              onIonChange={e => setMobile(e.detail.value!)} 
              color={mobileInvalid ? 'danger' : ''}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color={passwordInvalid ? 'danger' : 'primary'}>
              {labels.password}
            </IonLabel>
            <IonInput 
              value={password} 
              type="number" 
              placeholder={labels.passwordPlaceholder}
              clearInput
              onIonChange={e => setPassword(e.detail.value!)} 
              color={passwordInvalid ? 'danger' : ''}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating" color="primary">{labels.type}</IonLabel>
            <IonSelect 
              ok-text={labels.ok} 
              cancel-text={labels.cancel} 
              value={type}
              onIonChange={e => setType(e.detail.value)}
            >
              {userTypes.map(t => <IonSelectOption key={t.id} value={t.id}>{t.name}</IonSelectOption>)}
            </IonSelect>
          </IonItem>
          {['s', 'w', 'r'].includes(type) && 
            <IonItem>
              <IonLabel position="floating" color="primary">
                {labels.storeName}
              </IonLabel>
              <IonInput 
                value={storeName} 
                type="text" 
                clearInput
                onIonChange={e => setStoreName(e.detail.value!)} 
              />
            </IonItem>
          }
          <div className="ion-padding">
            <div className="ion-text-center">
              {labels.setPosition}
            </div>
            <div className="ion-text-center">
              <IonButton 
                fill="solid" 
                shape="round"
                style={{width: '10rem'}}
                onClick={handleSetPosition}
                disabled={positionError}
              >
                {labels.currentPosition}
              </IonButton>
            </div>
            <div className="ion-text-center">
              {labels.or}
            </div>
            <div className="ion-text-center">
              <IonButton 
                fill="solid" 
                shape="round"
                color="secondary"
                style={{width: '10rem'}}
                onClick={handlePositionByMap}
              >
                {labels.byMap}
              </IonButton>
            </div>
          </div>
        </IonList>
      </IonContent>
      {(storeName || ['n', 'd'].includes(type)) && position.lat && !nameInvalid && !mobileInvalid && !passwordInvalid &&
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleRegister} color="success">
            <IonIcon ios={checkmarkOutline} />
          </IonFabButton>
        </IonFab>
      }
      <IonModal isOpen={showModal} animated mode="ios">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setShowModal(false)}>{labels.cancel}</IonButton>
            </IonButtons>
            <IonTitle>{labels.region}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonList>
            {state.regions.map(r => 
              <IonItem key={r.id} detail onClick={() => goToMap(r)}>
                <IonLabel>{r.name}</IonLabel>
              </IonItem>
            )}
          </IonList>
        </IonContent>
      </IonModal>
    </IonPage>
  )
}
export default Register
