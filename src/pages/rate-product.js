import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, Button, Toolbar, ListItem } from 'framework7-react'
import { StoreContext } from '../data/store'
import { rateProduct, showMessage, showError, getMessage } from '../data/actions'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import { ratingValues } from '../data/config'

const RateProduct = props => {
  const { state } = useContext(StoreContext)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const handleRate = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      await rateProduct(props.productId, Number(props.value), comment)
      showMessage(labels.ratingSuccess)
      props.f7router.back()
    } catch(err) {
      setError(getMessage(props, err))
    }
  }

  return(
    <Page>
      <Navbar title={labels.ratingTitle} backLink={labels.back} />
      <List form>
        <ListItem
          title={labels.ratingValue}
          after={ratingValues.find(v => v.id === Number(props.value)).name}
        />
        <ListInput
          label={labels.comment}
          type="textarea"
          placeholder={labels.commentPlaceholder}
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
          {labels.send}
        </Button>
      }
      <h3 className="center">
        {labels.commentNote}
      </h3>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}
export default RateProduct