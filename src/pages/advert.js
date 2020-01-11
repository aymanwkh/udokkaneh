import React, { useContext, useMemo } from 'react'
import { Page, Navbar, Card, CardContent, CardFooter, Toolbar } from 'framework7-react'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import BottomToolbar from './bottom-toolbar'

const Advert = props => {
  const { state } = useContext(StoreContext)
  const advert = useMemo(() => state.adverts.find(a => a.isActive)
  , [state.adverts])
  return (
    <Page>
      <Navbar title={labels.advert} backLink={labels.back} />
      <Card>
        <CardContent>
          <div className="card-title">{advert.title}</div>
          <img src={advert.imageUrl} className="img-card" alt={advert.title} />
        </CardContent>
        <CardFooter>
          <p>{advert.text}</p>
        </CardFooter>
      </Card>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Advert
