import React, { useContext, useMemo } from 'react'
import { Block, Page, Navbar, List, ListItem, Toolbar } from 'framework7-react'
import BottomToolbar from './BottomToolbar';
import moment from 'moment'
import 'moment/locale/ar'
import { StoreContext } from '../data/Store';

const Comments = props => {
  const { state } = useContext(StoreContext)
  const comments = useMemo(() => {
    const pack = state.packs.find(rec => rec.id === props.id)
    const comments = state.comments.filter(rec => rec.productId === pack.productId)
    return comments.sort((rec1, rec2) => rec2.time.seconds - rec1.time.seconds)
  }, [state.packs, state.comments])
  return(
    <Page>
      <Navbar title={state.labels.comments} backLink={state.labels.back} />
      <Block>
          <List mediaList>
            {comments && comments.map(comment =>
              <ListItem
                link="#"
                title=""
                after={moment(comment.time.toDate()).fromNow()}
                text={comment.text}
                key={comment.id}
              />
            )}
            {comments.length === 0 ? <ListItem title={state.labels.not_found} /> : ''}
          </List>
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Comments
