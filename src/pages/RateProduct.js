import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, Button, Toolbar, ListItem } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { rateProduct, showMessage, showError, getMessage } from '../data/Actions'
import BottomToolbar from './BottomToolbar'

const RateProduct = props => {
  const { state } = useContext(StoreContext)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (error) {
      showError(props, error)
      setError('')
    }
  }, [error, props])

  const handleRate = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      await rateProduct(props.productId, Number(props.value), comment)
      showMessage(props, state.labels.ratingSuccess)
      props.f7router.back()
    } catch(err) {
      setError(getMessage(props, err))
    }
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
      {!comment ? '' : 
        <Button 
          large 
          onClick={() => handleRate()}
        >
          {state.labels.send}
        </Button>
      }
      <h3 className="center">
        {state.labels.commentNote}
      </h3>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default RateProduct