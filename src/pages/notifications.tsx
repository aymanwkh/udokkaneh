import { useEffect } from 'react'
import labels from '../data/labels'
import { deleteNotification, getMessage, sendNotification, updateLastSeen } from '../data/actions'
import Footer from './footer'
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText, useIonAlert, useIonToast } from '@ionic/react'
import Header from './header'
import { useLocation } from 'react-router'
import { Notification, State, Store, UserInfo } from '../data/types'
import moment from 'moment'
import 'moment/locale/ar'
import { refreshOutline, trashOutline } from 'ionicons/icons'
import { colors } from '../data/config'
import { useSelector } from 'react-redux'
import firebase from '../data/firebase'

const Notifications = () => {
  const notifications = useSelector<State, Notification[]>(state => state.notifications)
  const stores = useSelector<State, Store[]>(state => state.stores)
  const user = useSelector<State, firebase.User | undefined>(state => state.user)
  const userInfo = useSelector<State, UserInfo | undefined>(state => state.userInfo)
  const location = useLocation()
  const [message] = useIonToast()
  const [alert] = useIonAlert()
  useEffect(() => {
    updateLastSeen()
  }, [])
  const handleResponse = (notification: Notification, flag: boolean) => {
    const myStore = stores.find(s => s.ownerId === user?.uid)
    const senderStore = stores.find(s => s.ownerId === notification.userId)
    let messageText
    if (myStore && ['s', 'r'].includes(myStore.type) && senderStore?.type === 'd') {
      messageText = flag ? labels.stillWant : labels.dontWant
    } else {
      messageText = flag ? labels.stillAvailable : labels.unAvailable
    }
    const response = {
      id: Math.random().toString(),
      userId: user?.uid || null,
      userName: `${userInfo?.name} ${myStore ? '-' + myStore.name : ''}` || '',
      title: labels.response,
      message: messageText,
      isResponse: true,
      time: new Date()
    }
    sendNotification(notification.userId!, response)
    deleteNotification(notification.id, notifications)
    message(labels.sendSuccess, 3000)
  }
  const handleNotification = (notification: Notification) => {
    try{
      if (notification.isResponse || !notification.userId) {
        deleteNotification(notification.id, notifications)
        message(labels.deleteSuccess, 3000)
      } else {
        alert({
          header: labels.response,
          message: notification.message,
          buttons: [
            {text: labels.no, handler: () => handleResponse(notification, false)},
            {text: labels.yes, handler: () => handleResponse(notification, true)},
          ],
        })
      }
    } catch(err) {
      message(getMessage(location.pathname, err), 3000)
    }
  }
  return(
    <IonPage>
      <Header title={labels.notifications} />
      <IonContent fullscreen className="ion-padding">
        <IonList>
          {notifications.length === 0 ?
            <IonItem> 
              <IonLabel>{labels.noData}</IonLabel>
            </IonItem>
          : notifications.map(n => 
              <IonItem key={n.id}>
                <IonLabel>
                  <IonText style={{color: colors[0].name}}>{`${labels.from} ${n.userName}`}</IonText>
                  <IonText style={{color: colors[1].name}}>{n.title}</IonText>
                  <IonText style={{color: colors[2].name}}><p>{n.message}</p></IonText>
                  <IonText style={{color: colors[3].name}}>{moment(n.time).fromNow()}</IonText>
                </IonLabel>
                <IonIcon 
                  ios={n.isResponse || !n.userId ? trashOutline : refreshOutline} 
                  slot="end" 
                  color="danger"
                  style={{fontSize: '20px', marginRight: '10px'}} 
                  onClick={()=> handleNotification(n)}
                />
              </IonItem>    
            )
          }
        </IonList>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export default Notifications