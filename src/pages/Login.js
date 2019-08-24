import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, ListButton, Block, Link} from 'framework7-react'
import { StoreContext } from '../data/Store';
import firebase from '../data/firebase'

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
  const handleLogin = async e => {
    e.preventDefault();
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
      await firebase.auth().signInWithEmailAndPassword(mobile + '@gmail.com', mobile.substring(8, 2) + password);
      props.f7router.navigate(`/${props.f7route.params.callingPage}/`)
    } catch (err) {
      err.code ? setError(state.labels[err.code.replace(/-|\//g, '_')]) : setError(err.message)
    }
  }

  const handleForgetPassword = () => {
    console.log('handle forget password')
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
      </List>
      <List>
        <ListButton onClick={(e) => handleLogin(e)}>{state.labels.login}</ListButton>
        <Link href={`/register/${props.f7route.params.callingPage}/`}>{state.labels.newUser}</Link>
        <ListButton onClick={() => handleForgetPassword()}>{state.labels.forgetPassword}</ListButton>
      </List>
    </Page>
  )
}
export default Login
