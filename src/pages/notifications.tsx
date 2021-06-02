import {useContext, useState, useEffect} from 'react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import {deleteNotification, getMessage, updateLastSeen} from '../data/actions'
import Footer from './footer'
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText, useIonToast } from '@ionic/react'
import Header from './header'
import { useLocation } from 'react-router'
import {Notification} from '../data/types'
import moment from 'moment'
import 'moment/locale/ar'
import { trashOutline } from 'ionicons/icons'
import { randomColors } from '../data/config'

const Notifications = () => {
  const {state} = useContext(StateContext)
  const location = useLocation()
  const [message] = useIonToast();
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    updateLastSeen()
  }, [])
  useEffect(() => {
    setNotifications(() => [...state.notifications].sort((n1, n2) => n1.time > n2.time ? -1 : 1))
  }, [state.notifications])
  const handleDelete = (notificationId: string) => {
    try{
      deleteNotification(state.notifications, notificationId)
      message(labels.deleteSuccess, 3000) 
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
                  <IonText style={{color: randomColors[0].name}}>{n.title}</IonText>
                  <IonText style={{color: randomColors[1].name}}>{n.message}</IonText>
                  <IonText style={{color: randomColors[2].name}}>{moment(n.time).fromNow()}</IonText>
                </IonLabel>
                <IonIcon 
                  ios={trashOutline} 
                  slot="end" 
                  color="danger"
                  style={{fontSize: '20px', marginRight: '10px'}} 
                  onClick={()=> handleDelete(n.id)}
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