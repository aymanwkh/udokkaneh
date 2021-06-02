import {IonBadge, IonContent, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { StateContext } from '../data/state-provider';
import { logout } from '../data/actions';
import labels from '../data/labels';

const Panel = () => {
  const {state, dispatch} = useContext(StateContext)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [claimsCount, setClaimsCount] = useState(0)
  const menuEl = useRef<HTMLIonMenuElement | null>(null);
  const history = useHistory()
  useEffect(() => {
    setNotificationsCount(() => state.userInfo ? state.notifications.filter(n => n.time > (state.userInfo!.lastSeen || state.userInfo!.time!)).length : 0)
  }, [state.userInfo, state.notifications])
  useEffect(() => {
    setClaimsCount(() => state.userInfo?.storeId ? state.packStores.filter(s => s.storeId === state.userInfo?.storeId && s.claimUserId).length : 0)
  }, [state.userInfo, state.packStores])
  const handleLogout = () => {
    logout()
    dispatch({type: 'LOGOUT'})
    history.push('/')
    if (menuEl.current) menuEl.current.close()
    dispatch({type: 'CLEAR_BASKET'})
  }

  return (
    <IonMenu contentId="main" type="overlay" ref={menuEl} className="dark">
      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            {state.user ?
              <>
                <IonItem href="#" onClick={handleLogout}>
                  <IonLabel style={{marginBottom: '5px'}}>{labels.logout}</IonLabel>
                </IonItem>
                <IonItem routerLink="/change-password" style={{marginBottom: '0px', marginTop: '0px'}}>
                  <IonLabel>{labels.changePassword}</IonLabel>
                </IonItem>
                <IonItem routerLink="/notifications">
                  <IonLabel>{labels.notifications}</IonLabel>
                  {notificationsCount > 0 && <IonBadge color="danger">{notificationsCount}</IonBadge>}
                </IonItem>
              </>
            : <IonItem routerLink='/login'>
                <IonLabel>{labels.login}</IonLabel>
              </IonItem>
            }
            {state.userInfo?.type && ['s', 'w', 'd'].includes(state.userInfo?.type) &&
              <IonItem routerLink='/product-requests'>
                <IonLabel>{labels.productRequests}</IonLabel>
              </IonItem>
            }
            {state.userInfo?.type === 'd' &&
              <IonItem routerLink='/packs/r/0/0'>
                <IonLabel>{labels.requests}</IonLabel>
              </IonItem>
            }
            {state.userInfo?.storeId &&
              <IonItem routerLink={`/store-details/${state.userInfo?.storeId}/0`}>
                <IonLabel>{labels.myInfo}</IonLabel>
              </IonItem>
            }
            {state.userInfo?.type && ['s', 'w'].includes(state.userInfo?.type) &&
              <IonItem routerLink='/claims'>
                <IonLabel>{labels.claims}</IonLabel>
                {claimsCount > 0 && <IonBadge color="danger">{claimsCount}</IonBadge>}
              </IonItem>
            }
            <IonItem routerLink='/help'>
              <IonLabel>{labels.contactUs}</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Panel;