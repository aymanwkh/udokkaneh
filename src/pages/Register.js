import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, ListButton, ListItem, Block} from 'framework7-react'
import { StoreContext } from '../data/Store';
import { registerUser } from '../data/Actions'

const Register = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('07')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')

  const patterns = {
    name: /^.{4,50}$/,
    password: /^.{4}$/,
    mobile: /^07[7-9][0-9]{7}$/
  }
  useEffect(() => {
    const validateName = (value) => {
      if (patterns.name) {
        if (patterns.name.test(value)){
          setNameErrorMessage('')
        } else {
          setNameErrorMessage('not a valid name')
        }
      }
    }  
    if (name !== '') validateName(name)
  }, [name])
  useEffect(() => {
    const validatePassword = (value) => {
      if (patterns.password) {
        if (patterns.password.test(value)){
          setPasswordErrorMessage('')
        } else {
          setPasswordErrorMessage('not a valid password')
        }
      }
    }
    if (password !== '') validatePassword(password)
  }, [password])
  useEffect(() => {
    const validateMobile = (value) => {
      if (patterns.mobile) {
        if (patterns.mobile.test(value)){
          setMobileErrorMessage('')
        } else {
          setMobileErrorMessage('not a valid mobile number')
        }
      }
    }
    if (mobile !== '') validateMobile(mobile)
  }, [mobile])
  const handleRegister = async e => {
    e.preventDefault();
    if (name === '') {
      setNameErrorMessage('enter your name')
      throw 'enter your name'
    }
    if (mobile === '') {
      setMobileErrorMessage('enter your mobile number')
      throw 'enter your mobile number'
    }
    if (password === '') {
      setPasswordErrorMessage('enter your password')
      throw 'enter your password'
    }
    registerUser(mobile, password, name).then(() => {
      props.f7router.navigate(`/${props.f7route.params.callingPage}/`)
    }).catch (err => {
      err.code ? setError(state.labels[err.code.replace(/-|\//g, '_')]) : setError(err)
    })
  }

  const locations = state.locations.map(location => <option key={location.id} value={location.id}>{location.name}</option>)
  return (
    <Page loginScreen>
      <Navbar title={state.labels.registerTitle} backLink="Back" />
      <List form>
        <ListInput
          label={state.labels.name}
          type="text"
          placeholder={state.labels.name_placeholder}
          name="name"
          clearButton
          value={name}
          errorMessage={nameErrorMessage}
          errorMessageForce
          onChange={(e) => setName(e.target.value)}
          onInputClear={() => setName('')}
        />
        <ListInput
          label={state.labels.mobile}
          type="number"
          placeholder={state.labels.mobile_placeholder}
          name="mobile"
          clearButton
          value={mobile}
          errorMessage={mobileErrorMessage}
          errorMessageForce
          onChange={(e) => setMobile(e.target.value)}
          onInputClear={() => setMobile('')}
        />
        <ListInput
          label={state.labels.password}
          type="number"
          placeholder={state.labels.password_placeholder}
          name="password"
          clearButton
          value={password}
          errorMessage={passwordErrorMessage}
          errorMessageForce
          onChange={(e) => setPassword(e.target.value)}
          onInputClear={() => setPassword('')}
        />
        <ListItem
          title={state.labels.location}
          smartSelect
          smartSelectParams={{openIn: 'popover', closeOnSelect: true}}
        >
          <select name="location" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="" disabled></option>
            {locations}
          </select>
        </ListItem>
      </List>
      <List>
        <ListButton onClick={(e) => handleRegister(e)}>{state.labels.register}</ListButton>
      </List>
      <Block strong className="error">
        <p>{error}</p>
      </Block>
    </Page>
  )
}
export default Register
