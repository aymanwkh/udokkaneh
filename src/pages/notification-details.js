import React, { useContext, useEffect, useState } from 'react'
import { Page, Navbar, List, ListInput, Toolbar, Fab, Icon } from 'framework7-react'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import { deleteNotification, getMessage, showError, showMessage } from '../data/actions'
import moment from 'moment'
import 'moment/locale/ar'

const NotificationDetails = props => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [notification] = useState(() => state.userInfo.notifications.find(n => n.id === props.id))
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  const handleDelete = () => {
    try{
      deleteNotification(state.userInfo, notification.id)
      showMessage(labels.deleteSuccess)
      props.f7router.back()
    } catch(err) {
      setError(getMessage(props, err))
    }
  }
  return (
    <Page>
      <Navbar title={notification.title} backLink={labels.back} />
      <List form>
        <ListInput 
          name="message" 
          value={notification.message}
          type="textarea" 
          readonly
        />
        <ListInput 
          name="time" 
          value={moment(notification.time.toDate()).fromNow()}
          type="text" 
          readonly
        />
      </List>
      <Fab position="left-top" slot="fixed" color="red" className="top-fab" onClick={() => handleDelete()}>
        <Icon material="delete"></Icon>
      </Fab>
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default NotificationDetails
