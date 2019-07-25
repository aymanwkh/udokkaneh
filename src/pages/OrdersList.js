import React, { useContext, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';
import firebase from '../data/firebase'

const OrdersList = props => {
  const { state, currentUser, dispatch } = useContext(StoreContext)
  useEffect(() => {
    const fetchOrders = async () => {
      const docs = await firebase.firestore().collection('orders')
                            .where('user', '==', currentUser.uid)
                            .orderBy('time', 'desc')
                            .get()
      let ordersArray = []
      docs.forEach(doc => {
        ordersArray.push({...doc.data(), id:doc.id})
      })
      ordersArray = ordersArray.filter(order => order.status !== 3)
      dispatch({type: 'GET_ORDERS', ordersArray})
    }
    fetchOrders()
  }, [currentUser])
  return(
    <Page>
      <Navbar title="Orders" backLink="Back" />
      <Block>
          <List mediaList>
            {state.orders && state.orders.map(order =>
              <ListItem
                link={`/order/${order.id}`}
                title={moment(order.time.toDate()).fromNow()}
                after={parseFloat(order.total).toFixed(3)}
                text={state.orderStatus.find(orderStatus => orderStatus.id === order.status).name}
                key={order.id}
              >
              </ListItem>
            )}
            { state.orders.length === 0 ? <ListItem title={state.labels.not_found} /> : null }

          </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default OrdersList
