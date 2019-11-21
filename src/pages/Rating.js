import React, { useContext, useState } from 'react'
import { Page, Navbar, List, ListInput, Button, Toolbar, ListItem } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { rateProduct, showMessage } from '../data/Actions'
import BottomToolbar from './BottomToolbar'

const Rating = props => {
  const { state } = useContext(StoreContext)
  const [comment, setComment] = useState('')
  const handleRate = () => {
    rateProduct(props.productId, Number(props.value), comment).then(() => {
      showMessage(props, 'success', state.labels.ratingSuccess)
      props.f7router.back()
    })
  }

  return(
    <Page>
      <Navbar title={state.labels.ratingTitle} backLink={state.labels.back} />
      <List form>
        <ListItem
          title={state.labels.ratingValue}
          after={state.ratingValues.find(v => v.id === Number(props.value)).name}
        />
        <ListInput
          label={state.labels.comment}
          type="textarea"
          placeholder={state.labels.commentPlaceholder}
          name="comment"
          clearButton
          onChange={e => setComment(e.target.value)}
          onInputClear={() => setComment('')}
        />
      </List>
      {!comment ? '' : <Button large onClick={() => handleRate()}>{state.labels.send}</Button>}
      <h3 className="center">
        {state.labels.commentNote}
      </h3>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default Rating