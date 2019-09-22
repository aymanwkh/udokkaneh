import React, { useContext } from 'react';
import { Page, Navbar, Block, List, ListItem } from 'framework7-react';
import { StoreContext } from '../data/Store';
import { logout } from '../data/Actions'

const PanelPage = props => {
  const { user, state, dispatch } = useContext(StoreContext)
  const handleLogout = () => {
    logout().then(() => {
      dispatch({type: 'CLEAR_BASKET'})
    })
  }
  const login_logout = user ? <ListItem link="#" onClick={() => handleLogout()} title={state.labels.logout} /> : <ListItem link="/login/panel" title="Login" />
  return(
    <Page>
      <Navbar title={state.labels.mainPanelTitle} />
      <Block strong>
        <p>{user ? user.displayName : ''}</p>
      </Block>
      <List>
        {login_logout}
      </List>
      <List>
        { user ? <ListItem link="/ordersList/" title={state.labels.orders} view="#main-view" panelClose /> : null }
        { user ? <ListItem link="/inviteFriend/" title={state.labels.inviteFriend} view="#main-view" panelClose /> : null }
        { user ? <ListItem link="/sendSuggestion/" title={state.labels.sendSuggestion} view="#main-view" panelClose /> : null }
      </List>
    </Page>
  )
}
export default PanelPage
