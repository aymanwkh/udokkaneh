import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';

const Ratings = props => {
  const { state } = useContext(StoreContext)
  const ratings = useMemo(() => {
    const ratings = state.ratings.filter(r => r.productId === props.id && r.status === 'a')
    return ratings.sort((r1, r2) => r2.time.seconds - r1.time.seconds)
  }, [state.ratings, props.id])

  return(
    <Page>
      <Navbar title={state.labels.ratings} backLink={state.labels.back} className="page-title" />
      <Block>
        <List mediaList>
          {ratings.map(r => 
            <ListItem
              title={`${r.userName}: ${state.ratingValues.find(v => v.id === r.value).name}`}
              after={moment(r.time.toDate()).fromNow()}
              text={r.comment}
              key={r.id}
            />
          )}
          {ratings.length === 0 ? <ListItem title={state.labels.not_found} /> : ''}
        </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Ratings
