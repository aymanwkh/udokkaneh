import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar} from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';


const ActiveOrders = props => {
  const { state } = useContext(StoreContext)
  const orders = useMemo(() => {
    let orders = state.orders.filter(o => o.status === 'a')
    return orders.sort((o1, o2) => o2.time.seconds - o1.time.seconds)
  }, [state.orders]) 
  
  return(
    <Page>
      <Navbar title="Orders" backLink={state.labels.back} />
      <Block>
          <List mediaList>
            {orders && orders.map(o =>
              <ListItem
                link={`/order/${o.id}`}
                title={o.userId}
                after={o.total}
                text={moment(o.time.toDate()).fromNow()}
                key={o.id}
              />
            )}
            {orders.length === 0 ? <ListItem title={state.labels.not_found} /> : ''}

          </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default ActiveOrders
