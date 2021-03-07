import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import { menuOutline } from 'ionicons/icons';

const Header = () => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton>
            <IonIcon slot="icon-only" icon={menuOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle>Header</IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

export default Header