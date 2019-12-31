import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/store'
import labels from '../data/labels'
import { ratingValues } from '../data/config'

const Ratings = props => {
  const { state } = useContext(StoreContext)
  const ratings = useMemo(() => {
    const ratings = state.ratings.filter(r => r.productId === props.id && r.status === 'a')
    return ratings.sort((r1, r2) => r2.time.seconds - r1.time.seconds)
  }, [state.ratings, props.id])

  return(
    <Page>
      <Navbar title={labels.ratings} backLink={labels.back} />
      <Block>
        <List mediaList>
          {ratings.length === 0 ? 
            <ListItem title={labels.noData} /> 
          : ratings.map(r => 
              <ListItem
                title={`${r.userName}: ${ratingValues.find(v => v.id === r.value).name}`}
                subtitle={r.comment}
                after={moment(r.time.toDate()).fromNow()}
                key={r.id}
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

export default Ratings
