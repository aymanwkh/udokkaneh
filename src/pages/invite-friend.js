import React, { useContext, useState, useEffect } from 'react'
import { f7, Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { StoreContext } from '../data/store'
import { inviteFriend, showMessage, showError, getMessage } from '../data/actions'
import labels from '../data/labels'

const InviteFriend = props => {
  const { state } = useContext(StoreContext)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateName = (value) => {
      if (patterns.name.test(value)){
        setNameErrorMessage('')
      } else {
        setNameErrorMessage(labels.invalidName)
      }
    }  
    if (name) validateName(name)
  }, [name])
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
  useEffect(() => {
    if (inprocess) {
      f7.dialog.preloader(labels.inprocess)
    } else {
      f7.dialog.close()
    }
  }, [inprocess])

  const handleSend = async () => {
    try{
      if (state.customer.isBlocked) {
        throw new Error('blockedUser')
      }
      if (state.invitations.find(i => i.friendMobile === mobile)) {
        throw new Error('duplicateInvitation')
      }
      setInprocess(true)
      await inviteFriend(mobile, name)
      setInprocess(false)
      showMessage(labels.sendSuccess)
      props.f7router.navigate('/home/')
    } catch (err){
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }

  return (
    <Page>
      <Navbar title={labels.inviteFriend} backLink={labels.back} />
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
      </List>
      <List>
      {!name || !mobile || nameErrorMessage || mobileErrorMessage ? '' : 
        <Button text={labels.send} onClick={() => handleSend()} />
      }
      </List>
    </Page>
  )
}
export default InviteFriend
