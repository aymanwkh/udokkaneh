import React, { useContext, useState, useEffect } from 'react'
import { f7, Page, Navbar, List, ListItem } from 'framework7-react'
import { StoreContext } from '../data/store'
import { logout } from '../data/actions'
import labels from '../data/labels'

const Panel = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const [notifications, setNotifications] = useState([])
  useEffect(() => {
    setNotifications(() => state.userInfo.notifications?.filter(n => n.status === 'n') || [])
  }, [state.userInfo])
  const handleLogout = () => {
    logout().then(() => {
      f7.views.main.router.navigate('/home/', {reloadAll: true})
      f7.panel.close('right') 
      dispatch({type: 'CLEAR_BASKET'})
    })
  }
  return(
    <Page>
      <Navbar title={labels.mainPanelTitle} />
      <List>
        {user ?
          <ListItem link="#" title={labels.logout} onClick={() => handleLogout()} />
        : 
          <ListItem link="/panel-login/" title={labels.login} />
        }
        {user ? <ListItem link="/change-password/" title={labels.changePassword} /> : ''}
        {user ? <ListItem link="/notifications/" title={labels.notifications} badge={notifications.length} badgeColor="red" view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/packs/0/type/f" title={labels.favorites} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/orders-list/" title={labels.myOrders} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/purchased-packs/" title={labels.purchasedPacks} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/invite-friend/" title={labels.inviteFriend} view="#main-view" panelClose /> : ''}
        {user && (user.displayName === 'c' || user.displayName === 'd') ? <ListItem link={`/followup-orders-list/${user.displayName}`} title={labels.followupOrders} view="#main-view" panelClose /> : ''}
        {user && user.photoURL ? <ListItem link="/store-summary/" title={labels.myPacks} view="#main-view" panelClose /> : ''}
        {user ? '' : <ListItem link="/store-owner/" title={labels.registerStoreOwner} view="#main-view" panelClose />}
        {user ? <ListItem link="/debit/" title={labels.debitRequest} view="#main-view" panelClose /> : ''}
        <ListItem link="/contact-us/" title={labels.contactUsTitle} view="#main-view" panelClose />
      </List>
    </Page>
  )
}
export default Panel
