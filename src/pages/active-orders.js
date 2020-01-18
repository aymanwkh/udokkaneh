import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/store'
import labels from '../data/labels'


const ActiveOrders = props => {
  const { state } = useContext(StoreContext)
  const orders = useMemo(() => {
    let orders = state.orders.filter(o => o.status === 'a')
    return orders.sort((o1, o2) => o2.time.seconds - o1.time.seconds)
  }, [state.orders]) 
  
  return(
    <Page>
      <Navbar title="Orders" backLink={labels.back} />
      <Block>
          <List mediaList>
            {orders.length === 0 ? 
              <ListItem title={labels.noData} /> 
            : orders.map(o =>
                <ListItem
                  link={`/order-details/${o.id}/type/n`}
                  title={o.userId}
                  subtitle={moment(o.time.toDate()).fromNow()}
                  after={o.total}
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

export default ActiveOrders
