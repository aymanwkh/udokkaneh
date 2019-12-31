import React from 'react'
import { Page, Navbar, Block, Icon } from 'framework7-react'
import labels from '../data/labels'

const Help = props => {
  return (
    <Page>
      <Navbar title={labels.helpPageTitle} backLink={labels.back} />
      <Block strong className="center">
        <Icon color="red" material="warning"></Icon>
        <p className="note">{labels.orderLimitHelp}</p>
      </Block>
    </Page>
  )
}

export default Help