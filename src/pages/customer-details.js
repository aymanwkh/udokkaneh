import React, { useContext, useRef } from 'react'
import { Page, Navbar, List, ListInput, Toolbar, ListItem, Toggle } from 'framework7-react'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import { deliveryIntervals } from '../data/config'

const CustomerDetails = props => {
  const { state } = useContext(StoreContext)
  const customer = useRef(state.customers.find(c => c.id === props.id))

  return (
    <Page>
      <Navbar title={labels.customerDetails} backLink={labels.back} />
      <List form>
        <ListInput 
          name="fullName" 
          label={labels.fullName}
          value={customer.current.fullName}
          type="text" 
          readonly
        />
        <ListItem>
          <span>{labels.isOldAge}</span>
          <Toggle color="blue" checked={customer.current.isOldAge} disabled />
        </ListItem>
        <ListInput 
          name="locationName" 
          label={labels.location}
          value={state.locations.find(l => l.id === customer.current.locationId)?.name}
          type="text"
          readonly
        />
        <ListInput 
          name="otherMobile" 
          label={labels.otherMobile}
          value={customer.current.otherMobile}
          type="number"
          readonly
        />
        <ListInput 
          name="deliveryInterval" 
          label={labels.deliveryInterval}
          value={customer.deliveryInterval ? deliveryIntervals.find(i => i.id === customer.current.deliveryInterval)?.name : ''}
          type="text"
          readonly
        />
        <ListInput 
          name="address" 
          label={labels.address}
          value={customer.current.address}
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
