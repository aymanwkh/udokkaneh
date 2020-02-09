import React, { useContext, useState } from 'react'
import { Page, Navbar, List, ListInput, Toolbar } from 'framework7-react'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'

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
        <ListInput 
          name="otherMobile" 
          label={labels.otherMobile}
          value={customer.otherMobile}
          type="number"
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
