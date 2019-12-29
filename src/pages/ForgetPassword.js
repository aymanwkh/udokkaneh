import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { StoreContext } from '../data/store'
import { forgetPassword, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

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

  const handleForgetPassword = async () => {
    try{
      if (state.forgetPasswords.find(p => p.mobile === mobile && p.status === 'n')) {
        throw new Error('duplicateForgetPassword')
      }
      await forgetPassword(mobile)
      showMessage(labels.sendSuccess)
      props.f7router.app.views.main.router.navigate('/home/')
      props.f7router.app.panel.close('right')
    } catch (err){
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={labels.forgetPasswordTitle} backLink={labels.back} />
      <List form>
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
      </List>
      <List>
      {!mobile || mobileErrorMessage ? '' : 
        <Button large onClick={() => handleForgetPassword()}>{labels.send}</Button>
      }
      </List>
    </Page>
  )
}
export default ForgetPassword
