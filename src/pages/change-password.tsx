import React, { useState, useEffect } from 'react'
import { f7, Page, Navbar, List, ListInput, Button } from 'framework7-react'
import { changePassword, showMessage, showError, getMessage } from '../data/actionst'
import labels from '../data/labels'

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('')
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  useEffect(() => {
    const patterns = {
      password: /^.{4}$/,
    }
    const validatePassword = (value: string) => {
      if (patterns.password.test(value)){
        setOldPasswordErrorMessage('')
      } else {
        setOldPasswordErrorMessage(labels.invalidPassword)
      }
    }
    if (oldPassword) validatePassword(oldPassword)
  }, [oldPassword])
  useEffect(() => {
    const patterns = {
      password: /^.{4}$/,
    }
    const validatePassword = (value: string) => {
      if (patterns.password.test(value)){
        setNewPasswordErrorMessage('')
      } else {
        setNewPasswordErrorMessage(labels.invalidPassword)
      }
    }
    if (newPassword) validatePassword(newPassword)
  }, [newPassword])
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

  const handleSubmit = async () => {
    try{
      setInprocess(true)
      await changePassword(oldPassword, newPassword)
      setInprocess(false)
      showMessage(labels.changePasswordSuccess)
      f7.views.current.router.back()
      f7.panel.close('right')  
    } catch (err){
      setInprocess(false)
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }

  return (
    <Page>
      <Navbar title={labels.changePassword} backLink={labels.back} />
      <List form>
        <ListInput
          label={labels.oldPassword}
          type="number"
          placeholder={labels.passwordPlaceholder}
          name="oldPassword"
          clearButton
          errorMessage={oldPasswordErrorMessage}
          errorMessageForce
          onChange={e => setOldPassword(e.target.value)}
          onInputClear={() => setOldPassword('')}
        />
        <ListInput
          label={labels.newPassword}
          type="number"
          placeholder={labels.passwordPlaceholder}
          name="newPassword"
          clearButton
          errorMessage={newPasswordErrorMessage}
          errorMessageForce
          onChange={e => setNewPassword(e.target.value)}
          onInputClear={() => setNewPassword('')}
        />
      </List>
      {!oldPassword || !newPassword || oldPassword === newPassword || oldPasswordErrorMessage || newPasswordErrorMessage ? '' :
        <Button text={labels.submit} large onClick={() => handleSubmit()} />
      }
    </Page>
  )
}
export default ChangePassword
