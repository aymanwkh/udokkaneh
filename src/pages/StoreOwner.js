import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { registerStoreOwner, showMessage } from '../data/Actions'

const StoreOwner = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [address, setAddress] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateName = value => {
      if (patterns.name.test(value)){
        setNameErrorMessage('')
      } else {
        setNameErrorMessage(state.labels.invalidName)
      }
    }  
    if (name) validateName(name)
  }, [name, state.labels])
  useEffect(() => {
    const patterns = {
      password: /^.{4}$/,
    }
    const validatePassword = value => {
      if (patterns.password.test(value)){
        setPasswordErrorMessage('')
      } else {
        setPasswordErrorMessage(state.labels.invalidPassword)
      }
    }
    if (password) validatePassword(password)
  }, [password, state.labels])
  useEffect(() => {
    const patterns = {
      mobile: /^07[7-9][0-9]{7}$/
    }
    const validateMobile = value => {
      if (patterns.mobile.test(value)){
        setMobileErrorMessage('')
      } else {
        setMobileErrorMessage(state.labels.invalidMobile)
      }
    }
    if (mobile) validateMobile(mobile)
  }, [mobile, state.labels])
  useEffect(() => {
    if (error) {
      showMessage(props, 'error', error)
      setError('')
    }
  }, [error, props])
  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateStoreName = value => {
      if (patterns.name.test(value)){
        setStoreNameErrorMessage('')
      } else {
        setStoreNameErrorMessage(state.labels.invalidName)
      }
    }  
    if (storeName) validateStoreName(storeName)
  }, [storeName, state.labels])

  const handleRegister = () => {
    const owner = {
      mobile,
      name,
      storeName,
      address
    }
    registerStoreOwner(owner, password, state.randomColors).then(() => {
      showMessage(props, 'success', state.labels.registerSuccess)
      props.f7router.navigate('/home/')
      props.f7router.app.panel.close('right') 
    }).catch (err => {
      setError(state.labels[err.code.replace(/-|\//g, '_')])
    })
  }

  return (
    <Page>
      <Navbar title={state.labels.registerStoreOwnerTitle} backLink={state.labels.back} />
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
        <ListInput
          label={state.labels.mobile}
          type="number"
          placeholder={state.labels.mobilePlaceholder}
          name="mobile"
          clearButton
          value={mobile}
          errorMessage={mobileErrorMessage}
          errorMessageForce
          onChange={e => setMobile(e.target.value)}
          onInputClear={() => setMobile('')}
        />
        <ListInput
          label={state.labels.password}
          type="number"
          placeholder={state.labels.passwordPlaceholder}
          name="password"
          clearButton
          value={password}
          errorMessage={passwordErrorMessage}
          errorMessageForce
          onChange={e => setPassword(e.target.value)}
          onInputClear={() => setPassword('')}
        />
        <ListInput
          label={state.labels.storeName}
          type="text"
          placeholder={state.labels.namePlaceholder}
          name="storeName"
          clearButton
          value={storeName}
          errorMessage={storeNameErrorMessage}
          errorMessageForce
          onChange={e => setStoreName(e.target.value)}
          onInputClear={() => setStoreName('')}
        />
        <ListInput
          label={state.labels.address}
          type="text"
          name="address"
          clearButton
          value={address}
          onChange={e => setAddress(e.target.value)}
          onInputClear={() => setAddress('')}
        />

      </List>
      <List>
      {!name || !mobile || !password || !storeName || nameErrorMessage || mobileErrorMessage || passwordErrorMessage || storeNameErrorMessage 
      ? '' 
      : <Button 
          large 
          onClick={() => handleRegister()}
        >
          {state.labels.register}
        </Button>
      }
      </List>
    </Page>
  )
}
export default StoreOwner
