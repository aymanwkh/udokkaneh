import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { StoreContext } from '../data/store'
import { newProduct, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

const NewProduct = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])

  const handleSend = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      await newProduct(name)
      showMessage(labels.sendSuccess)
      props.f7router.navigate('/home/')
    } catch (err){
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={labels.newProduct} backLink={labels.back} />
      <List form>
        <ListInput
          label={labels.name}
          type="text"
          placeholder={labels.namePlaceholder}
          name="name"
          clearButton
          value={name}
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
      </List>
      {!name ? '' : 
        <Button large onClick={() => handleSend()}>{labels.send}</Button>
      }
    </Page>
  )
}
export default NewProduct
