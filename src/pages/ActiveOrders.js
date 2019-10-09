import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';


const ActiveOrders = props => {
  const { state } = useContext(StoreContext)
  const orders = useMemo(() => {
    let orders = state.orders.filter(order => order.status === 'a')
    return orders.sort((rec1, rec2) => rec2.time.seconds - rec1.time.seconds)
  }, [state.orders]) 
  
  return(
    <Page>
      <Navbar title="Orders" backLink={state.labels.back} />
      <Block>
          <List mediaList>
            {orders && orders.map(order =>
              <ListItem
                link={`/order/${order.id}`}
                title={order.user}
                after={order.total}
                text={moment(order.time.toDate()).fromNow()}
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

export default ActiveOrders
