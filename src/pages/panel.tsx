import { useContext, useState, useEffect } from 'react'
import { f7, Page, Navbar, List, ListItem } from 'framework7-react'
import { StateContext } from '../data/state-provider'
import { logout } from '../data/actions'
import labels from '../data/labels'
import { Notification } from '../data/types'

const Panel = () => {
  const { state, dispatch } = useContext(StateContext)
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    setNotifications(() => state.userInfo?.notifications?.filter(n => n.status === 'n') || [])
  }, [state.userInfo])
  const handleLogout = () => {
    logout()
    dispatch({type: 'LOGOUT'})
    f7.views.main.router.navigate('/home/', {reloadAll: true})
    f7.panel.close('right') 
    dispatch({type: 'CLEAR_BASKET'})
  }
  return(
    <Page>
      <Navbar title={state.user ? `${labels.loginSuccess} ${state.userInfo?.name}${state.userInfo?.storeId ? '/' + state.userInfo?.storeName : ''}` : labels.mainPanelTitle} />
      <List>
        {state.user ? <ListItem link="#" title={labels.logout} onClick={() => handleLogout()} />
        : <ListItem link="/panel-login/" title={labels.login} />}
        {state.user && <ListItem link="/change-password/" title={labels.changePassword} />}
        {state.user && <ListItem link="/notifications/" title={labels.notifications} badge={notifications.length} badgeColor="red" view="#main-view" panelClose />}
        {state.user && <ListItem link="/packs/0/type/f" title={labels.favorites} view="#main-view" panelClose />}
        {state.user && state.userInfo?.storeId && <ListItem link="/store-summary/" title={labels.myPacks} view="#main-view" panelClose />}
        {!state.user && <ListItem link="/register/o" title={labels.registerStoreOwner} />}
        {state.user && state.userInfo?.storeId && <ListItem link="/add-product-request/" title={labels.addProductRequest} view="#main-view" panelClose />}
      </List>
    </Page>
  )
}
export default Panel
