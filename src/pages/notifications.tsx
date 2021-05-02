import {useContext, useState, useEffect} from 'react'
import {f7, Block, Page, Navbar, List, ListItem, Link} from 'framework7-react'
import {StateContext} from '../data/state-provider'
import labels from '../data/labels'
import moment from 'moment'
import 'moment/locale/ar'
import {updateLastSeen, deleteNotification, getMessage, showError, showMessage } from '../data/actions'
import {Notification} from '../data/types'

const Notifications = () => {
  const {state} = useContext(StateContext)
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    updateLastSeen()
  }, [])
  useEffect(() => {
    setNotifications(() => [...state.notifications].sort((n1, n2) => n1.time > n2.time ? -1 : 1))
  }, [state.notifications])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleDelete = (notificationId: string) => {
    try{
      deleteNotification(state.notifications, notificationId)
      showMessage(labels.deleteSuccess) 
    } catch(err) {
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  return (
    <Page>
      <Navbar title={labels.notifications} backLink={labels.back} />
      <Block>
        <List mediaList>
          {notifications.length === 0 ? 
            <ListItem title={labels.noData} />
          : notifications.map(n =>
              <ListItem
                title={n.title}
                subtitle={n.message}
                footer={moment(n.time).fromNow()}
                key={n.id}
              >
                <Link slot="after" iconMaterial="delete" onClick={()=> handleDelete(n.id)}/>
              </ListItem>
            )
          }
        </List>
      </Block>
    </Page>
  )
}

export default Notifications
