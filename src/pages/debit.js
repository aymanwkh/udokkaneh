import React, { useContext, useState, useEffect } from 'react'
import { f7, Page, Navbar, Block, Icon, Button, Toolbar } from 'framework7-react'
import labels from '../data/labels'
import { addDebitRequest, showMessage, showError, getMessage } from '../data/actions'
import { StoreContext } from '../data/store'
import BottomToolbar from './bottom-toolbar'

const Debit = props => {
  const { state } = useContext(StoreContext)
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
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
      if (state.customerInfo.isBlocked) {
        throw new Error('blockedUser')
      }
      setInprocess(true)
      await addDebitRequest()
      setInprocess(false)
      showMessage(labels.sendSuccess)
      props.f7router.back()
    } catch (err) {
      setInprocess(false)
      setError(getMessage(props, err))
    }
  }
  const note = 'هذه الخدمة غير متاحة حتى الان، سوف يتم تفعيلها بمجرد انشاء صندوق خاص بها'
  return (
    <Page>
      <Navbar title={labels.debitRequest} backLink={labels.back} />
      <Block strong inset className="center">
        <Icon color="red" material="warning"></Icon>
        <p className="note">{note}</p>
        {state.userInfo.debitRequestStatus ? '' : 
          <Button text={labels.notifyDebit} large onClick={() => handleSubmit()} />
        }
      </Block>
      <Toolbar bottom>
        <BottomToolbar/>
      </Toolbar>
    </Page>
  )
}

export default Debit