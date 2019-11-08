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
  const login_logout = user ? <ListItem link="#" onClick={() => handleLogout()} title={state.labels.logout} /> : <ListItem link="/login/panel" title={state.labels.loginTitle} />
  return(
    <Page>
      <Navbar title={state.labels.mainPanelTitle} />
      <Block strong>
        <p>{user ? user.displayName : ''}</p>
      </Block>
      <List>
        {login_logout}
      </List>
      {user ? 
        <List>
          <ListItem 
            link="/changePassword/" 
            title={state.labels.changePassword} 
          />
          <ListItem 
            link="/ordersList/" 
            title={state.labels.orders} 
            view="#main-view" 
            panelClose 
          />
          {state.customer.type === 'b' ? '' : 
            <ListItem 
              link="/inviteFriend/" 
              title={state.labels.inviteFriend} 
              view="#main-view" 
              panelClose 
            />
          }
          {state.customer.type === 'b' ? '' : 
            <ListItem 
              link="/sendSuggestion/" 
              title={state.labels.sendSuggestion} 
              view="#main-view" 
              panelClose
            />
          }
          {state.customer.type === 'o' ?
            <ListItem 
              link="/ownerPacks/" 
              title={state.labels.ownerPacks} 
              view="#main-view" 
              panelClose
            />
            : ''
          }
        </List>
      :
        <List>
          <ListItem 
            link="/storeOwner/" 
            title={state.labels.registerStoreOwner} 
            view="#main-view" 
            panelClose 
          />
        </List>
      }
    </Page>
  )
}
export default PanelPage
