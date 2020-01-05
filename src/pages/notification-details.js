import React, { useContext, useMemo, useEffect, useState } from 'react'
import { Page, Navbar, List, ListInput, Toolbar } from 'framework7-react'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import { readNotification, getMessage, showError } from '../data/actions'
import moment from 'moment'
import 'moment/locale/ar'

const NotificationDetails = props => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
  const notification = useMemo(() => state.notifications.find(c => c.id === props.id)
  , [state.notifications, props.id])
  useEffect(() => {
    const updateNotification = async () => {
      try{
        await readNotification(notification)
      } catch(err) {
			  setError(getMessage(props, err))
		  }
    }
    if (notification.toCustomerId !== '0') updateNotification()
  }, [notification, props])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
  return (
    <Page>
      <Navbar title={labels.notificationDetails} backLink={labels.back} />
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
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default NotificationDetails
