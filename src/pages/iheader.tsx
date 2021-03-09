import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonMenu, IonTitle, IonToolbar } from '@ionic/react';
import { menuOutline } from 'ionicons/icons';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom'

interface Props {
  title?: string
}
const Header = (props: Props) => {
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const history = useHistory()
  const openMenu = async () => {
    await menuRef.current?.open()
  }
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={openMenu}>
              <IonIcon slot="icon-only" icon={menuOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Ionic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonMenu side="start" contentId="main" ref={menuRef} >
        <IonContent id="main">
          <IonList>
            <IonItem routerLink="/" onClick={() => history.push('/')}>home</IonItem>
            <IonItem routerLink="/search">search</IonItem>
            <IonItem>Menu Item</IonItem>
            <IonItem>Menu Item</IonItem>
            <IonItem>Menu Item</IonItem>
            <IonItem>Menu Item</IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  )
}

export default Header