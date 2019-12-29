import React from 'react'
import { Page, Block, Link, Navbar } from 'framework7-react'
import labels from '../data/labels'

const ContactUs = props => {
  return(
    <Page>
      <Navbar title={labels.contactUsTitle} backLink={labels.back} />
      <Block>
        <h3 className="center">
          {labels.contactUsText} <br/>
          {labels.telNo} <br/>
          <Link className="center" href="https://web.facebook.com/%D8%AF%D9%83%D8%A7%D9%86%D8%A9-%D9%86%D8%AA-112081910240629">{labels.facebookPage}</Link>
        </h3>
      </Block>
    </Page>
  )
}
export default ContactUs