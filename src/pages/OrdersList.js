import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';

const OrdersList = props => {
  const { state } = useContext(StoreContext)
  const orders = useMemo(() => {
    const orders = state.orders.filter(o => ['n', 'a', 'e', 'u', 'f', 'p', 'd'].includes(o.status))
    return orders.sort((o1, o2) => o2.time.seconds - o1.time.seconds)
  }, [state.orders])
  return(
    <Page>
      <Navbar title={state.labels.myOrders} backLink={state.labels.back} className="page-title" />
      <Block>
          <List mediaList>
            {orders.length === 0 ? 
              <ListItem title={state.labels.noData} /> 
            : orders.map(o =>
                <ListItem
                  link={`/order/${o.id}`}
                  title={moment(o.time.toDate()).fromNow()}
                  after={(o.total / 1000).toFixed(3)}
                  key={o.id}
                >
                  <div className="list-line1">{state.orderStatus.find(s => s.id === o.status).name}</div>
                </ListItem>
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
