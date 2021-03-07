import { IonToolbar, IonButtons, IonButton, IonIcon, IonBadge, IonFooter } from '@ionic/react';
import { search, home, cart } from 'ionicons/icons';
import { useContext } from 'react'
import { StoreContext } from '../data/store'
import { useHistory } from 'react-router-dom'

interface Props {
  isHome?: string
}
const BottomToolbar = (props: Props) => {
  const { state } = useContext(StoreContext)
  const history = useHistory()
  return (
    <IonFooter>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton color="secondary" routerLink={props.isHome === '1' ? '/search' : '/home'} >
            <IonIcon slot="icon-only" icon={props.isHome === '1' ? search : home} />
          </IonButton>
        </IonButtons>
        <IonButtons slot="end" style={{position: 'relative'}}>
          <IonButton color="secondary" onClick={() => {if (state.basket.length > 0) history.push('/basket')}}>
            <IonIcon slot="icon-only" icon={cart} />
          </IonButton>
          {state.basket.length > 0 && <IonBadge color="danger" style={{fontSize: '8px', borderRadius: '50%', position: 'absolute', top: '1px', right: '1px'}}>{state.basket.length}</IonBadge>}
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  );
}

export default BottomToolbar

