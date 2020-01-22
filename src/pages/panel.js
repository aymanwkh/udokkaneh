import React, { useContext, useMemo } from 'react'
import { f7, Page, Navbar, List, ListItem, Badge } from 'framework7-react'
import { StoreContext } from '../data/store'
import { logout } from '../data/actions'
import labels from '../data/labels'

const Panel = props => {
  const { state, user, dispatch } = useContext(StoreContext)
  const notifications = useMemo(() => state.userInfo.notifications?.filter(n => n.status === 'n') || []
  , [state.userInfo])
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
          <ListItem link="/panel-login/" title={labels.loginTitle} />
        }
        {user ? <ListItem link="/change-password/" title={labels.changePassword} /> : ''}
        {user ? 
          <ListItem link="/notifications/" title={labels.notifications} view="#main-view" panelClose >
            {notifications.length > 0 ? <Badge color="red">{notifications.length}</Badge> : ''}
          </ListItem> 
        : ''}
        {user ? <ListItem link="/packs/f" title={labels.favorites} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/orders-list/" title={labels.myOrders} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/purchased-packs/" title={labels.purchasedPacks} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/invite-friend/" title={labels.inviteFriend} view="#main-view" panelClose /> : ''}
        {user && (user.displayName === 'c' || user.displayName === 'd') ? <ListItem link={`/followup-orders-list/${user.displayName}`} title={labels.followupOrders} view="#main-view" panelClose /> : ''}
        {user && user.photoURL ? <ListItem link="/store-summary/" title={labels.myPacks} view="#main-view" panelClose /> : ''}
        {user ? '' : <ListItem link="/store-owner/" title={labels.registerStoreOwner} view="#main-view" panelClose />}
        <ListItem link="/contact-us/" title={labels.contactUsTitle} view="#main-view" panelClose />
      </List>
    </Page>
  )
}
export default Panel
