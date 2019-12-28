import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { newProduct, showMessage, showError, getMessage } from '../data/Actions'

const NewProduct = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateName = (value) => {
      if (patterns.name.test(value)){
        setNameErrorMessage('')
      } else {
        setNameErrorMessage(state.labels.invalidName)
      }
    }  
    if (name) validateName(name)
  }, [name, state.labels])
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
      showMessage(state.labels.sendSuccess)
      props.f7router.navigate('/home/')
    } catch (err){
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={state.labels.newProduct} backLink={state.labels.back} />
      <List form>
        <ListInput
          label={state.labels.name}
          type="text"
          placeholder={state.labels.namePlaceholder}
          name="name"
          clearButton
          value={name}
          errorMessage={nameErrorMessage}
          errorMessageForce
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        {!name || nameErrorMessage ? '' : 
          <Button onClick={() => handleSend()}>{state.labels.send}</Button>
        }
      </List>
    </Page>
  )
}
export default NewProduct
