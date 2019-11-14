import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, Button, Link, Toolbar } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { login, showMessage } from '../data/Actions'

const Login = props => {
  const { state } = useContext(StoreContext)
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')
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

  const handleLogin = () => {
    login(mobile, password).then(() => {
      showMessage(props, 'success', state.labels.loginSuccess)
      props.f7router.navigate(`/${props.callingPage}/`)
      props.f7router.app.panel.close('right')  
    }).catch (err => {
      setError(state.labels[err.code.replace(/-|\//g, '_')])
    })
  }

  return (
    <Page>
      <Navbar title={state.labels.loginTitle} backLink={state.labels.back} />
      <List form>
        <ListInput
          label={state.labels.mobile}
          type="number"
          placeholder={state.labels.mobilePlaceholder}
          name="mobile"
          clearButton
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
          errorMessage={passwordErrorMessage}
          errorMessageForce
          onChange={(e) => setPassword(e.target.value)}
          onInputClear={() => setPassword('')}
        />
      </List>
      {!mobile || !password || mobileErrorMessage || passwordErrorMessage ? '' : <Button large onClick={() => handleLogin()}>{state.labels.login}</Button>}
      <Toolbar bottom>
        <Link href={`/register/${props.callingPage}/`}>{state.labels.newUser}</Link>
        <Link href='/forgetPassword/'>{state.labels.forgetPassword}</Link>
      </Toolbar>
    </Page>
  )
}
export default Login
