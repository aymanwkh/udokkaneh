import React, { useContext } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';
import firebase from '../data/firebase'

const OrdersList = props => {
  const { state, orders } = useContext(StoreContext)
  const sortedOrders = orders.sort((ordera, orderb) => orderb.time.seconds - ordera.time.seconds)
  return(
    <Page>
      <Navbar title="Orders" backLink="Back" />
      <Block>
          <List mediaList>
            {sortedOrders && sortedOrders.map(order =>
              <ListItem
                link={`/order/${order.id}`}
                title={moment(order.time.toDate()).fromNow()}
                after={order.total}
                text={state.orderStatus.find(orderStatus => orderStatus.id === order.status).name}
                key={order.id}
              >
              </ListItem>
            )}
            { orders.length === 0 ? <ListItem title={state.labels.not_found} /> : null }

          </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default OrdersList
