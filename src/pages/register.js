import React, { useState, useEffect } from 'react'
import { f7, Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { registerUser, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

const Register = props => {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
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
  useEffect(() => {
    if (inprocess) {
      f7.dialog.preloader(labels.inprocess)
    } else {
      f7.dialog.close()
    }
  }, [inprocess])

  const handleRegister = async () => {
    try{
      setInprocess(true)
      await registerUser(mobile, password, name)
      setInprocess(false)
      showMessage(labels.registerSuccess)
      props.f7router.back()
      props.f7router.app.panel.close('right') 
    } catch (err){
      setInprocess(false)
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
      </List>
      {!name || !mobile || !password || nameErrorMessage || mobileErrorMessage || passwordErrorMessage ? '' :
        <Button text={labels.register} href="#" large onClick={() => handleRegister()} />
      }
    </Page>
  )
}
export default Register
