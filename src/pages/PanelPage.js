import React, { useContext } from 'react';
import { Page, Navbar, Block, List, ListItem, Badge } from 'framework7-react';
import { StoreContext } from '../data/Store';
import { logout } from '../data/Actions'

const PanelPage = props => {
  const { user, state, dispatch } = useContext(StoreContext)
  const handleLogout = () => {
    logout().then(() => {
      props.f7router.app.views.main.router.navigate('/home/', {reloadAll: true})
      props.f7router.app.panel.close('right') 
      dispatch({type: 'CLEAR_BASKET'})
    })
  }
  const login_logout = user ? <ListItem link="#" onClick={() => handleLogout()} title={state.labels.logout} /> : <ListItem link="/panelLogin/" title={state.labels.loginTitle} />
  return(
    <Page>
      <Navbar title={state.labels.mainPanelTitle} />
      <Block strong>
        <p>{user ? user.displayName : ''}</p>
      </Block>
      <List>
        {login_logout}
        {user ? 
          <ListItem 
            link="/basket/"
            view="#main-view"
            title={state.labels.basket} 
            panelClose
          >
            {state.basket.length > 0 ? <Badge color="red">{state.basket.length}</Badge> : ''}
          </ListItem>
          : ''
        }
        {user ? <ListItem link="/changePassword/" title={state.labels.changePassword} /> : ''}
        {user ? <ListItem link="/ordersList/" title={state.labels.myOrders} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/inviteFriend/" title={state.labels.inviteFriend} view="#main-view" panelClose /> : ''}
        {user ? <ListItem link="/sendSuggestion/" title={state.labels.sendSuggestion} view="#main-view" panelClose /> : ''}
        {state.customer.type === 'o' ? <ListItem link={`/ownerPacks/${state.customer.storeId}`} title={state.labels.ownerPacks} view="#main-view" panelClose /> : ''}
        {user ? '' : <ListItem link="/storeOwner/" title={state.labels.registerStoreOwner} view="#main-view" panelClose />}
        <ListItem link="/contactUs/" title={state.labels.contactUsTitle} view="#main-view" panelClose />
      </List>
    </Page>
  )
}
export default PanelPage
