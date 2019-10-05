import React, { useContext, useState, useEffect } from 'react'
import { Page, Navbar, List, ListInput, ListButton } from 'framework7-react'
import { StoreContext } from '../data/Store';
import { inviteFriend, showMessage } from '../data/Actions'

const InviteFriend = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')

  const patterns = {
    name: /^.{4,50}$/,
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
  useEffect(() => {
    if (error) {
      showMessage(props, 'error', error)
    }
  }, [error])

  const handleSend = () => {
    inviteFriend(mobile, name).then(() => {
      showMessage(props, 'success', state.labels.sendSuccess)
      props.f7router.navigate('/home/')
    }).catch (err => {
      setError(state.labels[err.code.replace(/-|\//g, '_')])
    })
  }

  return (
    <Page loginScreen>
      <Navbar title={state.labels.inviteFriend} backLink={state.labels.back} />
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
      </List>
      <List>
      {!name || !mobile || nameErrorMessage || mobileErrorMessage ? '' : <ListButton onClick={() => handleSend()}>{state.labels.send}</ListButton>}
      </List>
    </Page>
  )
}
export default InviteFriend
