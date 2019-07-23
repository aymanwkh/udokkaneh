import React, { useContext } from 'react';
import { Page, Navbar, Block, BlockTitle, List, ListItem } from 'framework7-react';
import { StoreContext } from '../data/Store';
import firebase from '../data/firebase'

const PanelPage = props => {
  const { currentUser, dispatch } = useContext(StoreContext)
  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      dispatch({type: 'CLEAR_BASKET'})
    })
  }
  const login_logout = currentUser ? <ListItem link="#" onClick={() => handleLogout()} title="Log Out"></ListItem> : <ListItem link="/login/panel" title="Login"></ListItem>
  return(
    <Page>
      <Navbar title="Right Panel" />
      <Block strong>
        <p>{currentUser ? currentUser.displayName : ''}</p>
      </Block>
      <BlockTitle>Load page in panel</BlockTitle>
      <List>
        {login_logout}
      </List>
      <BlockTitle>Load page in main view</BlockTitle>
      <List>
        { currentUser ? <ListItem link="/ordersList/" title="Orders" view="#main-view" panelClose></ListItem> : null }
      </List>
    </Page>
  )
}
export default PanelPage
