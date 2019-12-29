import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Page, Navbar, List, ListInput, Button, ListItem } from 'framework7-react'
import { StoreContext } from '../data/store'
import { registerStoreOwner, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

const StoreOwner = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [locationId, setLocationId] = useState('')
  const [error, setError] = useState('')
  const locations = useMemo(() => [...state.locations].sort((l1, l2) => l1.sorting - l2.sorting)
  , [state.locations])

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
        storeName,
        locationId
      }
      await registerStoreOwner(owner, password, state.randomColors)
      showMessage(labels.registerSuccess)
      props.f7router.navigate('/home/')
      props.f7router.app.panel.close('right') 
    } catch (err){
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
        <ListItem
          title={labels.location}
          smartSelect
          smartSelectParams={{
            openIn: "popup", 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: labels.search,
            popupCloseLinkText: labels.close
          }}
        >
          <select name="locationId" value={locationId} onChange={e => setLocationId(e.target.value)}>
            <option value=""></option>
            {locations.map(l => 
              <option key={l.id} value={l.id}>{l.name}</option>
            )}
          </select>
        </ListItem>

      </List>
      <List>
      {!name || !mobile || !password || !storeName || !locationId || nameErrorMessage || mobileErrorMessage || passwordErrorMessage || storeNameErrorMessage ? '' :
        <Button large onClick={() => handleRegister()}>
          {labels.register}
        </Button>
      }
      </List>
    </Page>
  )
}
export default StoreOwner
