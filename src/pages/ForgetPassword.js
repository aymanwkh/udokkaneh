import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, ListButton, Block, Link} from 'framework7-react'
import { StoreContext } from '../data/Store';
import { forgetPassword } from '../data/Actions'

const ForgetPassword = props => {
  const { state } = useContext(StoreContext)
  const [mobile, setMobile] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const patterns = {
    mobile: /^07[7-9][0-9]{7}$/
  }
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
  const handleForgetPassword = async () => {
    try {
      if (mobile === '') {
        setMobileErrorMessage(state.labels.enterMobile)
        throw new Error(state.labels.enterMobile)
      }
      if (mobileErrorMessage !== '') {
        throw new Error(mobileErrorMessage)
      }
      await forgetPassword(mobile)
      setMessage(state.labels.sendMessage)
      setTimeout(() => {
        props.f7router.app.views.main.router.navigate('/home/')
        props.f7router.app.panel.close('right')    
      }, 2000)
    } catch (err) {
      err.code ? setError(state.labels[err.code.replace(/-|\//g, '_')]) : setError(err.message)
    }
  }

  return (
    <Page loginScreen>
      <Navbar title={state.labels.forgetPasswordTitle} backLink="Back" />
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
      </List>
      <List>
        {message ? <Block strong className="message">{message}</Block> : <ListButton onClick={(e) => handleForgetPassword(e)}>{state.labels.send}</ListButton>}

      </List>
    </Page>
  )
}
export default ForgetPassword
