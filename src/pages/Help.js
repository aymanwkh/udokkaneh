import React, { useContext } from 'react'
import { Page, Navbar, Block, Icon } from 'framework7-react'
import { StoreContext } from '../data/store'

const Help = props => {
  const { state } = useContext(StoreContext)
  return (
    <Page>
      <Navbar title={state.labels.helpPageTitle} backLink={state.labels.back} />
      <Block strong className="center">
        <Icon color="red" material="warning"></Icon>
        <p className="note">{state.labels.orderLimitHelp}</p>
      </Block>
    </Page>
  )
}

export default Help