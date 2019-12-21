import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { forgetPassword, showMessage, showError, getMessage } from '../data/Actions'

const ForgetPassword = props => {
  const { state } = useContext(StoreContext)
  const [mobile, setMobile] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    const patterns = {
      mobile: /^07[7-9][0-9]{7}$/
    }
    const validateMobile = (value) => {
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

  const handleForgetPassword = async () => {
    try{
      if (state.forgetPasswords.find(p => p.mobile === mobile && p.status === 'n')) {
        throw new Error('duplicateForgetPassword')
      }
      await forgetPassword(mobile)
      showMessage(props, state.labels.sendSuccess)
      props.f7router.app.views.main.router.navigate('/home/')
      props.f7router.app.panel.close('right')
    } catch (err){
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={state.labels.forgetPasswordTitle} backLink={state.labels.back} className="page-title" />
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
          onChange={e => setMobile(e.target.value)}
          onInputClear={() => setMobile('')}
        />
      </List>
      <List>
      {!mobile || mobileErrorMessage ? '' : 
        <Button large onClick={() => handleForgetPassword()}>{state.labels.send}</Button>
      }
      </List>
    </Page>
  )
}
export default ForgetPassword
