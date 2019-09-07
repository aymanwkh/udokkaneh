import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, ListButton, Block, Link, Toolbar} from 'framework7-react'
import { StoreContext } from '../data/Store';
import { login } from '../data/Actions'

const Login = props => {
  const { state } = useContext(StoreContext)
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')
  const patterns = {
    password: /^.{4}$/,
    mobile: /^07[7-9][0-9]{7}$/
  }
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
  const handleLogin = async () => {
    try {
      if (mobile === '') {
        setMobileErrorMessage(state.labels.enterMobile)
        throw new Error(state.labels.enterMobile)
      }
      if (password === '') {
        setPasswordErrorMessage(state.labels.enterPassword)
        throw new Error(state.labels.enterPassword)
      }
      if (passwordErrorMessage !== '') {
        throw new Error(passwordErrorMessage)
      }
      if (mobileErrorMessage !== '') {
        throw new Error(mobileErrorMessage)
      }
      await login(mobile, password)
      props.f7router.navigate(`/${props.f7route.params.callingPage}/`)
      props.f7router.app.panel.close('right')  
    } catch (err) {
      err.code ? setError(state.labels[err.code.replace(/-|\//g, '_')]) : setError(err.message)
    }
  }

  return (
    <Page loginScreen>
      <Navbar title={state.labels.loginTitle} backLink="Back" />
      {error ? <Block strong className="error">{error}</Block> : null}
      <List form>
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
          value={password}
          errorMessage={passwordErrorMessage}
          errorMessageForce
          onChange={(e) => setPassword(e.target.value)}
          onInputClear={() => setPassword('')}
        />
        <ListButton onClick={(e) => handleLogin(e)}>{state.labels.login}</ListButton>
      </List>
      <Toolbar bottom>
        <Link href={`/register/${props.f7route.params.callingPage}/`}>{state.labels.newUser}</Link>
        <Link href='/forgetPassword/'>{state.labels.forgetPassword}</Link>
      </Toolbar>
    </Page>
  )
}
export default Login
