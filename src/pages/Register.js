import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Page, Navbar, List, ListInput, Button, ListItem } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { registerUser, showMessage, showError, getMessage } from '../data/Actions'

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
          setNameErrorMessage(state.labels.invalidName)
        }
    }  
    if (name !== '') validateName(name)
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
      showError(props, error)
      setError('')
    }
  }, [error, props])

  const handleRegister = async () => {
    try{
      await registerUser(mobile, password, name, locationId, state.randomColors)
      showMessage(props, state.labels.registerSuccess)
      props.f7router.back()
      props.f7router.app.panel.close('right') 
    } catch (err){
      setError(getMessage(err, state.labels, props.f7route.route.component.name))
    }
  }

  return (
    <Page>
      <Navbar title={state.labels.registerTitle} backLink={state.labels.back} />
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
        <ListItem
          title={state.labels.location}
          smartSelect
          smartSelectParams={{
            openIn: "popup", 
            closeOnSelect: true, 
            searchbar: true, 
            searchbarPlaceholder: state.labels.search,
            popupCloseLinkText: state.labels.close
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
        <Button large href="#" onClick={() => handleRegister()}>
          {state.labels.register}
        </Button>
      }
    </Page>
  )
}
export default Register
