import React, { useContext, useMemo, useEffect, useState } from 'react'
import { f7, Page, Navbar, List, ListInput, Toolbar } from 'framework7-react'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import { readNotification, getMessage, showError } from '../data/actions'
import moment from 'moment'
import 'moment/locale/ar'

const NotificationDetails = props => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const notification = useMemo(() => state.notifications.find(c => c.id === props.id)
  , [state.notifications, props.id])
  useEffect(() => {
    const updateNotification = async () => {
      try{
        setInprocess(true)
        await readNotification(notification)
        setInprocess(false)
      } catch(err) {
        setInprocess(false)
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
  useEffect(() => {
    if (inprocess) {
      f7.dialog.preloader(labels.inprocess)
    } else {
      f7.dialog.close()
    }
  }, [inprocess])

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
