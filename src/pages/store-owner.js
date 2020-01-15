import React, { useState, useEffect } from 'react'
import { f7, Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { registerStoreOwner, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

const StoreOwner = props => {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateName = value => {
      if (patterns.name.test(value)){
        setNameErrorMessage('')
      } else {
        setNameErrorMessage(labels.invalidName)
      }
    }  
    if (name) validateName(name)
  }, [name])
  useEffect(() => {
    const patterns = {
      password: /^.{4}$/,
    }
    const validatePassword = value => {
      if (patterns.password.test(value)){
        setPasswordErrorMessage('')
      } else {
        setPasswordErrorMessage(labels.invalidPassword)
      }
    }
    if (password) validatePassword(password)
  }, [password])
  useEffect(() => {
    const patterns = {
      mobile: /^07[7-9][0-9]{7}$/
    }
    const validateMobile = value => {
      if (patterns.mobile.test(value)){
        setMobileErrorMessage('')
      } else {
        setMobileErrorMessage(labels.invalidMobile)
      }
    }
    if (mobile) validateMobile(mobile)
  }, [mobile])
  useEffect(() => {
    if (error) {
      showError(error)
      setError('')
    }
  }, [error])
    useEffect(() => {
    if (inprocess) {
      f7.dialog.preloader(labels.inprocess)
    } else {
      f7.dialog.close()
    }
  }, [inprocess])

  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateStoreName = value => {
      if (patterns.name.test(value)){
        setStoreNameErrorMessage('')
      } else {
        setStoreNameErrorMessage(labels.invalidName)
      }
    }  
    if (storeName) validateStoreName(storeName)
  }, [storeName])

  const handleRegister = async () => {
    try{
      const owner = {
        mobile,
        name,
        storeName
      }
      setInprocess(true)
      await registerStoreOwner(owner, password)
      setInprocess(false)
      showMessage(labels.registerSuccess)
      props.f7router.navigate('/home/')
      props.f7router.app.panel.close('right') 
    } catch (err){
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={labels.registerStoreOwnerTitle} backLink={labels.back} />
      <List form>
        <ListInput
          label={labels.name}
          type="text"
          placeholder={labels.namePlaceholder}
          name="name"
          clearButton
          value={name}
          errorMessage={nameErrorMessage}
          errorMessageForce
          onChange={e => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        <ListInput
          label={labels.mobile}
          type="number"
          placeholder={labels.mobilePlaceholder}
          name="mobile"
          clearButton
          value={mobile}
          errorMessage={mobileErrorMessage}
          errorMessageForce
          onChange={e => setMobile(e.target.value)}
          onInputClear={() => setMobile('')}
        />
        <ListInput
          label={labels.password}
          type="number"
          placeholder={labels.passwordPlaceholder}
          name="password"
          clearButton
          value={password}
          errorMessage={passwordErrorMessage}
          errorMessageForce
          onChange={e => setPassword(e.target.value)}
          onInputClear={() => setPassword('')}
        />
        <ListInput
          label={labels.storeName}
          type="text"
          placeholder={labels.namePlaceholder}
          name="storeName"
          clearButton
          value={storeName}
          errorMessage={storeNameErrorMessage}
          errorMessageForce
          onChange={e => setStoreName(e.target.value)}
          onInputClear={() => setStoreName('')}
        />
      </List>
      <List>
      {!name || !mobile || !password || !storeName || nameErrorMessage || mobileErrorMessage || passwordErrorMessage || storeNameErrorMessage ? '' :
        <Button text={labels.register} large onClick={() => handleRegister()} />
      }
      </List>
    </Page>
  )
}
export default StoreOwner
