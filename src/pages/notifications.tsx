import { useContext, useState, useEffect } from 'react'
import { f7, Block, Page, Navbar, List, ListItem } from 'framework7-react'
import { StateContext } from '../data/state-provider'
import labels from '../data/labels'
import moment from 'moment'
import 'moment/locale/ar'
import { readNotification, getMessage, showError } from '../data/actions'
import { Notification } from '../data/types'

const Notifications = () => {
  const { state } = useContext(StateContext)
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    const notifications = state.userInfo?.notifications?.slice()
    if (notifications) {
      setNotifications(() => notifications.sort((n1, n2) => n2.time > n1.time ? -1 : 1))
    }
  }, [state.userInfo])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleOpen = (notificationId: string) => {
    try{
      if (state.userInfo) {
        readNotification(state.userInfo, notificationId)
        f7.views.current.router.navigate(`/notification-details/${notificationId}`)  
      }
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
                link="#"
                title={n.title}
                subtitle={n.status === 'n' ? labels.notRead : labels.read}
                footer={moment(n.time).fromNow()}
                key={n.id}
                onClick={() => handleOpen(n.id)}
              />
            )
          }
        </List>
      </Block>
    </Page>
  )
}

export default Notifications
