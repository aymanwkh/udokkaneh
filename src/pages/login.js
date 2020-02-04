import React, { useState, useEffect } from 'react'
import { f7, Page, Navbar, List, ListInput, Button, Link, Toolbar } from 'framework7-react'
import { login, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

const Login = props => {
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
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

  const handleLogin = async () => {
    try{
      setInprocess(true)
      await login(mobile, password)
      localStorage.removeItem('password-request')
      setInprocess(false)
      showMessage(labels.loginSuccess)
      props.f7router.back()
      props.f7router.app.panel.close('right') 
    } catch (err){
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }
  const handlePasswordRequest = () => {
    try{
      const localData = localStorage.getItem('password-request')
      if (localData) {
        throw new Error('duplicatePasswordRequest')
      }
      props.f7router.navigate('/password-request/')
    } catch (err){
      setError(getMessage(props, err))
    }
  }
  return (
    <Page>
      <Navbar title={labels.login} backLink={labels.back} />
      <List form>
        <ListInput
          label={labels.mobile}
          type="number"
          placeholder={labels.mobilePlaceholder}
          name="mobile"
          clearButton
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
          errorMessage={passwordErrorMessage}
          errorMessageForce
          onChange={e => setPassword(e.target.value)}
          onInputClear={() => setPassword('')}
        />
      </List>
      {!mobile || !password || mobileErrorMessage || passwordErrorMessage ? '' : 
        <Button text={labels.login} large onClick={() => handleLogin()} />
      }
      <Toolbar bottom>
        <Link href="/register/">{labels.newUser}</Link>
        <Link onClick={() => handlePasswordRequest()}>{labels.forgetPassword}</Link>
      </Toolbar>
    </Page>
  )
}
export default Login
