import React, { useContext } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';

const OrdersList = props => {
  const { state } = useContext(StoreContext)
  let orders = state.orders
  orders.sort((order1, order2) => order2.time.seconds - order1.time.seconds)
  return(
    <Page>
      <Navbar title="Orders" backLink={state.labels.back} />
      <Block>
          <List mediaList>
            {orders && orders.map(order =>
              <ListItem
                link={`/order/${order.id}`}
                title={moment(order.time.toDate()).fromNow()}
                after={order.total}
                text={state.orderStatus.find(orderStatus => orderStatus.id === order.status).name}
                key={order.id}
              />
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
