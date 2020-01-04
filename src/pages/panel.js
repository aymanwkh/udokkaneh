import React, { useContext } from 'react'
import { f7, Page, Navbar, List, ListItem, Badge } from 'framework7-react'
import { StoreContext } from '../data/store'
import { logout } from '../data/actions'
import labels from '../data/labels'

const Panel = props => {
  const { user, state, dispatch } = useContext(StoreContext)
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
          <ListItem 
            link="#" 
            title={labels.logout} 
            onClick={() => handleLogout()} 
          />
        : 
          <ListItem 
            link="/panel-login/" 
            title={labels.loginTitle} 
          />
        }
        {user ? 
          <ListItem 
            link="/basket/"
            view="#main-view"
            title={labels.basket} 
            panelClose
          >
            {state.basket.length > 0 ? <Badge color="red">{state.basket.length}</Badge> : ''}
          </ListItem>
        : ''}
        {user ? <ListItem link="/change-password/" title={labels.changePassword} /> : ''}
        {user ? <ListItem link="/orders-list/" title={labels.myOrders} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/invite-friend/" title={labels.inviteFriend} view="#main-view" panelClose /> : ''}
        {state.customer.storeId ? <ListItem link={`/owner-packs/${state.customer.storeId}`} title={labels.ownerPacks} view="#main-view" panelClose /> : ''}
        {user ? '' : <ListItem link="/store-owner/" title={labels.registerStoreOwner} view="#main-view" panelClose />}
        <ListItem link="/contact-us/" title={labels.contactUsTitle} view="#main-view" panelClose />
      </List>
    </Page>
  )
}
export default Panel
