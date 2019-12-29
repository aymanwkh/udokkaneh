import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Page, Navbar, List, ListInput, Button, ListItem } from 'framework7-react'
import { StoreContext } from '../data/store'
import { registerUser, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

const Register = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [locationId, setLocationId] = useState('')
  const [error, setError] = useState('')
  const locations = useMemo(() => [...state.locations].sort((l1, l2) => l1.sorting - l2.sorting)
  , [state.locations])
  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
      password: /^.{4}$/,
      mobile: /^07[7-9][0-9]{7}$/
    }
    const validateName = value => {
        if (patterns.name.test(value)){
          setNameErrorMessage('')
        } else {
          setNameErrorMessage(labels.invalidName)
        }
    }  
    if (name !== '') validateName(name)
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

  const handleRegister = async () => {
    try{
      await registerUser(mobile, password, name, locationId, state.randomColors)
      showMessage(labels.registerSuccess)
      props.f7router.back()
      props.f7router.app.panel.close('right') 
    } catch (err){
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={labels.registerTitle} backLink={labels.back} />
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
      {!name || !mobile || !password || !locationId || nameErrorMessage || mobileErrorMessage || passwordErrorMessage ? '' :
        <Button 
          href="#" 
          large 
          onClick={() => handleRegister()}
        >
          {labels.register}
        </Button>
      }
    </Page>
  )
}
export default Register
