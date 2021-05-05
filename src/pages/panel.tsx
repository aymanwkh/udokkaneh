import {useContext, useState, useEffect} from 'react'
import {f7, Page, Navbar, List, ListItem} from 'framework7-react'
import {StateContext } from '../data/state-provider'
import {logout} from '../data/actions'
import labels from '../data/labels'

const Panel = () => {
  const {state, dispatch} = useContext(StateContext)
  const [notificationsCount, setNotificationsCount] = useState(0)
  useEffect(() => {
    let notifications = 0, alarms = 0
    if (state.userInfo) {
      notifications = state.notifications.filter(n => n.time > (state.userInfo!.lastSeen || state.userInfo!.time!)).length
    }
    if (state.userInfo?.storeId) {
      alarms = state.alarms.filter(a => a.time > (state.userInfo!.lastSeen || state.userInfo!.time!)).length
    }
    setNotificationsCount(notifications + alarms)
  }, [state.userInfo, state.alarms, state.notifications])
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
        {state.user && <ListItem link="/notifications/" title={labels.notifications} badge={notificationsCount} badgeColor="red" view="#main-view" panelClose />}
        {state.user && state.userInfo?.storeId && <ListItem link="/store-packs/" title={labels.myPacks} view="#main-view" panelClose />}
        {state.user && state.userInfo?.storeId && <ListItem link="/product-requests/" title={labels.productRequests} view="#main-view" panelClose />}
        {!state.user && <ListItem link="/register/o" title={labels.registerStoreOwner} />}
      </List>
    </Page>
  )
}
export default Panel
