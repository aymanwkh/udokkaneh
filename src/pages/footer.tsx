import { IonBadge, IonButtons, IonFooter, IonIcon, IonToolbar } from '@ionic/react'
import { cartOutline, homeOutline } from 'ionicons/icons'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { BasketItem, State } from '../data/types'

const Footer = () => {
  const basket = useSelector<State, BasketItem[]>(state => state.basket)
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
        <IonButtons slot="end" onClick={() => {if (basket.length > 0) history.push('/basket')}}>
          {basket.length > 0 && <IonBadge className="badge" style={{right: '10px'}}>{basket.length}</IonBadge>}
          <IonIcon 
            ios={cartOutline} 
            style={{fontSize: '25px', marginLeft: '10px'}} 
            color="primary"
          />
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  )
}

export default Footer