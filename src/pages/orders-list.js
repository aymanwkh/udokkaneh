import React, { useContext, useState, useEffect } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import { orderStatus } from '../data/config'

const OrdersList = props => {
  const { state } = useContext(StoreContext)
  const [orders, setOrders] = useState([])
  useEffect(() => {
    setOrders(() => {
      const orders = state.orders.filter(o => ['n', 'a', 'e', 'u', 'f', 'p', 'd'].includes(o.status))
      return orders.sort((o1, o2) => o2.time.seconds - o1.time.seconds)
    })
  }, [state.orders])
  return(
    <Page>
      <Navbar title={labels.myOrders} backLink={labels.back} />
      <Block>
        <List mediaList>
          {orders.length === 0 ? 
            <ListItem title={labels.noData} /> 
          : orders.map(o =>
              <ListItem
                link={`/order-details/${o.id}`}
                title={orderStatus.find(s => s.id === o.status).name}
                subtitle={moment(o.time.toDate()).fromNow()}
                after={(o.total / 100).toFixed(2)}
                key={o.id}
              />
            )
          }
        </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default OrdersList
