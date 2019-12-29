import React, { useContext } from 'react'
import { Page, Block, Link, Navbar } from 'framework7-react'
import { StoreContext } from '../data/store'

const ContactUs = props => {
  const { state } = useContext(StoreContext)
  return(
    <Page>
      <Navbar title={state.labels.contactUsTitle} backLink={state.labels.back} />
      <Block>
        <h3 className="center">
          {state.labels.contactUsText} <br/>
          {state.labels.telNo} <br/>
          <Link className="center" href="https://web.facebook.com/%D8%AF%D9%83%D8%A7%D9%86%D8%A9-%D9%86%D8%AA-112081910240629">{state.labels.facebookPage}</Link>
        </h3>
      </Block>
    </Page>
  )
}
export default ContactUs