import {useState, useEffect, useContext} from 'react'
import {getMessage, registerUser} from '../data/actions'
import labels from '../data/labels'
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonLoading, useIonToast } from '@ionic/react'
import Header from './header'
import { useHistory, useLocation } from 'react-router'
import { Location, UserInfo } from '../data/types'
import { patterns, storeTypes } from '../data/config'
import { StateContext } from '../data/state-provider'
import { checkmarkOutline } from 'ionicons/icons'

const Register = () => {
  const {state, dispatch} = useContext(StateContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [nameInvalid, setNameInvalid] = useState(true)
  const [passwordInvalid, setPasswordInvalid] = useState(true)
  const [mobileInvalid, setMobileInvalid] = useState(true)
  const [position, setPosition] = useState({lat: 0, lng: 0})
  const [positionError, setPositionError] = useState(false)
  const [loctionId, setLocationId] = useState('')
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
        type
      }
      if (['s', 'w'].includes(type)) {
        user.storeName = storeName
        user.locationId = loctionId
      }
      await registerUser(user)
      dismiss()
      message(type === 'n' ? labels.registerSuccess : labels.registerStoreOwnerSuccess, 3000)
      history.push('/')
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
  const goToMap = (location: Location) => {
    setLocationId(location.id)
    history.push(`/map/${location.position.lat}/${location.position.lng}/1`)
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
          {['s', 'w'].includes(type) && <>
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
            <IonItem>
            <IonLabel position="floating" color="primary">{labels.type}</IonLabel>
            <IonSelect 
              ok-text={labels.ok} 
              cancel-text={labels.cancel}
              value={type} 
              onIonChange={e => setType(e.detail.value)}
            >
              {storeTypes.map(t => <IonSelectOption key={t.id} value={t.id}>{t.name}</IonSelectOption>)}
            </IonSelect>
          </IonItem>

          </>}
          {type !== 'd' &&
            <div className="ion-padding">
              <div className="ion-text-center">
                {labels.setPosition}
              </div>
              <div className="ion-text-center">
                <IonButton 
                  fill="solid" 
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
                  color="secondary"
                  style={{width: '10rem'}}
                  onClick={handlePositionByMap}
                >
                  {labels.byMap}
                </IonButton>
              </div>
            </div>
          }
        </IonList>
      </IonContent>
      {(position.lat || type ==='d') && (storeName || ['n', 'd'].includes(type)) && !nameInvalid && !mobileInvalid && !passwordInvalid &&
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleRegister}>
            <IonIcon ios={checkmarkOutline} />
          </IonFabButton>
        </IonFab>
      }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={() => setType(type === 's' ? 'n': 's')}>{type === 's' ? labels.normalUser : labels.storeOwner}</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={() => setType(type === 'd' ? 'n' : 'd')}>{type === 'd' ? labels.normalUser : labels.salesman}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
      <IonModal isOpen={showModal} animated mode="ios">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setShowModal(false)}>{labels.cancel}</IonButton>
            </IonButtons>
            <IonTitle>{labels.location}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <IonList>
            {state.locations.map(l => 
              <IonItem key={l.id} detail onClick={() => goToMap(l)}>
                <IonLabel>{l.name}</IonLabel>
              </IonItem>
            )}
          </IonList>
        </IonContent>
      </IonModal>
    </IonPage>
  )
}
export default Register
