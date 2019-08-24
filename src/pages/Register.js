import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, ListButton, Block} from 'framework7-react'
import { StoreContext } from '../data/Store';
import { registerUser } from '../data/Actions'

const Register = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
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
          setNameErrorMessage(state.labels.invalidName)
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
          setPasswordErrorMessage(state.labels.invalidPassword)
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
          setMobileErrorMessage(state.labels.invalidMobile)
        }
      }
    }
    if (mobile !== '') validateMobile(mobile)
  }, [mobile])
  const handleRegister = async e => {
    e.preventDefault();
    if (name === '') {
      setNameErrorMessage(state.labels.enterName)
      throw new Error(state.labels.enterName)
    }
    if (mobile === '') {
      setMobileErrorMessage(state.labels.enterMobile)
      throw new Error(state.labels.enterMobile)
    }
    if (password === '') {
      setPasswordErrorMessage(state.labels.enterPassword)
      throw new Error(state.labels.enterPassword)
    }
    registerUser(mobile, password, name).then(() => {
      props.f7router.navigate(`/${props.f7route.params.callingPage}/`)
    }).catch (err => {
      err.code ? setError(state.labels[err.code.replace(/-|\//g, '_')]) : setError(err.message)
    })
  }

  return (
    <Page loginScreen>
      <Navbar title={state.labels.registerTitle} backLink="Back" />
      {error ? <Block strong className="error">{error}</Block> : null}
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
          onChange={(e) => setName(e.target.value)}
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
          onChange={(e) => setMobile(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          onInputClear={() => setPassword('')}
        />
      </List>
      <List>
        <ListButton onClick={(e) => handleRegister(e)}>{state.labels.register}</ListButton>
      </List>
    </Page>
  )
}
export default Register
