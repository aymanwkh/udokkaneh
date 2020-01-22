import React, { useContext, useRef } from 'react'
import { Page, Navbar, Card, CardContent, CardFooter, Toolbar } from 'framework7-react'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'

const Advert = props => {
  const { state } = useContext(StoreContext)
  const advert = useRef(state.adverts[0])
  return (
    <Page>
      <Navbar title={labels.advert} backLink={labels.back} />
      <Card>
        <CardContent>
          <div className="card-title">{advert.current.title}</div>
          {advert.current.imageUrl ? <img src={advert.current.imageUrl} className="img-card" alt={advert.current.title} /> : ''}
        </CardContent>
        <CardFooter>
          <p>{advert.current.text}</p>
        </CardFooter>
      </Card>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Advert
