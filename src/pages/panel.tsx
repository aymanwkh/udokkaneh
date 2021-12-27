import { IonBadge, IonContent, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { logout } from '../data/actions';
import labels from '../data/labels';
import { useDispatch, useSelector } from 'react-redux';
import { PackStore, State, Notification, UserInfo } from '../data/types';
import firebase from '../data/firebase'

const Panel = () => {
  const notifications = useSelector<State, Notification[]>(state => state.notifications)
  const packStores = useSelector<State, PackStore[]>(state => state.packStores)
  const userInfo = useSelector<State, UserInfo | undefined>(state => state.userInfo)
  const user = useSelector<State, firebase.User | undefined>(state => state.user)
  const dispatch = useDispatch()
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [claimsCount, setClaimsCount] = useState(0)
  const menuEl = useRef<HTMLIonMenuElement | null>(null)
  const history = useHistory()
  useEffect(() => {
    setNotificationsCount(() => userInfo ? notifications.filter(n => n.time > (userInfo!.lastSeen || userInfo!.time!)).length : 0)
  }, [userInfo, notifications])
  useEffect(() => {
    setClaimsCount(() => userInfo?.storeId ? packStores.filter(s => s.storeId === userInfo?.storeId && s.claimUserId).length : 0)
  }, [userInfo, packStores])
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
            {user ?
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
            {userInfo?.type && ['s', 'w', 'd'].includes(userInfo?.type) &&
              <IonItem routerLink='/product-requests'>
                <IonLabel>{labels.productRequests}</IonLabel>
              </IonItem>
            }
            {userInfo?.type === 'd' &&
              <IonItem routerLink='/packs/r/0/0'>
                <IonLabel>{labels.requests}</IonLabel>
              </IonItem>
            }
            {userInfo?.storeId &&
              <IonItem routerLink={`/store-details/${userInfo?.storeId}/0`}>
                <IonLabel>{labels.myInfo}</IonLabel>
              </IonItem>
            }
            {userInfo?.type && ['s', 'w'].includes(userInfo?.type) &&
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

export default Panel