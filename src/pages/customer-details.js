import React, { useContext, useState } from 'react'
import { Page, Navbar, List, ListInput, Toolbar, ListItem, Toggle } from 'framework7-react'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import { deliveryIntervals } from '../data/config'

const CustomerDetails = props => {
  const { state } = useContext(StoreContext)
  const [customer] = useState(() => state.customers.find(c => c.id === props.id))

  return (
    <Page>
      <Navbar title={labels.customerDetails} backLink={labels.back} />
      <List form>
        <ListInput 
          name="name" 
          label={labels.name}
          value={customer.name}
          type="text" 
          readonly
        />
        <ListItem>
          <span>{labels.isOldAge}</span>
          <Toggle color="blue" checked={customer.isOldAge} disabled />
        </ListItem>
        <ListInput 
          name="otherMobile" 
          label={labels.otherMobile}
          value={customer.otherMobile}
          type="number"
          readonly
        />
        <ListInput 
          name="deliveryInterval" 
          label={labels.deliveryInterval}
          value={deliveryIntervals.find(i => i.id === customer.deliveryInterval)?.name || ''}
          type="text"
          readonly
        />
        <ListInput 
          name="address" 
          label={labels.address}
          value={customer.address}
          type="text" 
          readonly
        />
      </List>
      <Toolbar bottom>
        <BottomToolbar />
      </Toolbar>
    </Page>
  )
}
export default CustomerDetails
