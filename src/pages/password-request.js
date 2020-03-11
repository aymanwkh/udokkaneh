import React, { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../data/store'
import { f7, Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { addPasswordRequest, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

const PasswordRequest = props => {
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
  const handlePasswordRequest = () => {
    try{
      if (state.passwordRequests.find(r => r.mobile === mobile)) {
        throw new Error('duplicatePasswordRequest')
      }
      addPasswordRequest(mobile)
      showMessage(labels.sendSuccess)
      props.f7router.back()
      f7.views.main.router.navigate('/home/')
      f7.panel.close('right')
    } catch (err){
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={labels.passwordRequest} backLink={labels.back} />
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
        <Button text={labels.send} large onClick={() => handlePasswordRequest()} />
      }
      </List>
    </Page>
  )
}
export default PasswordRequest
