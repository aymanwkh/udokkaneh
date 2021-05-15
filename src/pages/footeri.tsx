import {useContext} from 'react'
import {StateContext} from '../data/state-provider'
import { IonBadge, IonButtons, IonFooter, IonIcon, IonToolbar } from '@ionic/react'
import { cartOutline, homeOutline } from 'ionicons/icons'
import { useHistory } from 'react-router'

const Footer = () => {
  const {state} = useContext(StateContext)
  const history = useHistory()
  return (
    <IonFooter>
      <IonToolbar>
        <IonButtons slot="start" onClick={() => history.push('/')}>
          <IonIcon 
            ios={homeOutline} 
            color="primary" 
            style={{fontSize: '20px', marginRight: '10px'}} 
          />
        </IonButtons>
        <IonButtons slot="end" onClick={() => {if (state.basket.length > 0) history.push('/basket')}}>
          <IonIcon 
            ios={cartOutline} 
            style={{fontSize: '25px', marginLeft: '10px'}} 
            color="primary"
          />
          {state.basket.length > 0 && <IonBadge color="danger" style={{fontSize: '10px', position: 'relative', bottom: '10px', left: '35px'}}>{state.basket.length}</IonBadge>}
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  )
}

export default Footer