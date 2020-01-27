import React, { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import moment from 'moment'
import 'moment/locale/ar'


const Notifications = props => {
  const { state } = useContext(StoreContext)
  const [notifications, setNotifications] = useState([])
  useEffect(() => {
    setNotifications(() => [...state.userInfo.notifications].sort((n1, n2) => n2.time.seconds - n1.time.seconds))
  }, [state.userInfo])
  return (
    <Page>
      <Navbar title={labels.notifications} backLink={labels.back} />
      <Block>
        <List mediaList>
          {notifications.length === 0 ? 
            <ListItem title={labels.noData} />
          : notifications.map(n =>
              <ListItem
                link={`/notification-details/${n.id}`}
                title={n.title}
                subtitle={n.status === 'n' ? labels.notRead : labels.read}
                footer={moment(n.time.toDate()).fromNow()}
                key={n.id}
              />
            )
          }
        </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Notifications
