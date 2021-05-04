import {useState, useEffect} from 'react'
import {f7, Page, Navbar, List, ListInput, Button, ListButton} from 'framework7-react'
import {registerUser, showMessage, showError, getMessage} from '../data/actions'
import labels from '../data/labels'
import {UserInfo} from '../data/types'

type Props = {
  type: string
}
const StoreOwner = (props: Props) => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [inprocess, setInprocess] = useState(false)
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [mobileErrorMessage, setMobileErrorMessage] = useState('')
  const [storeNameErrorMessage, setStoreNameErrorMessage] = useState('')
  const [position, setPosition] = useState({lat: 0, lng: 0})
  const [positionError, setPositionError] = useState(false)
  const [address, setAddress] = useState('')
  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateName = (value: string) => {
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
      password: /^.{4}$/,
    }
    const validatePassword = (value: string) => {
      if (patterns.password.test(value)){
        setPasswordErrorMessage('')
      } else {
        setPasswordErrorMessage(labels.invalidPassword)
      }
    }
    if (password) validatePassword(password)
  }, [password])
  useEffect(() => {
    const patterns = {
      mobile: /^07[7-9][0-9]{7}$/
    }
    const validateMobile = (value: string) => {
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

  useEffect(() => {
    const patterns = {
      name: /^.{4,50}$/,
    }
    const validateStoreName = (value: string) => {
      if (patterns.name.test(value)){
        setStoreNameErrorMessage('')
      } else {
        setStoreNameErrorMessage(labels.invalidName)
      }
    }  
    if (storeName) validateStoreName(storeName)
  }, [storeName])
  const handleSetPosition = () => {
    setInprocess(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setInprocess(false)
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setInprocess(false)
        setPositionError(true)
        setError(labels.positionError)
      }
    );
  }
  const handleRegister = async () => {
    try{
      setInprocess(true)
      let user: UserInfo = {
        mobile,
        name,
        password,
        position
      }
      if (props.type === 'o') user.storeName = storeName
      if (positionError) user.address = address
      await registerUser(user)
      setInprocess(false)
      showMessage(props.type === 'o' ? labels.registerStoreOwnerSuccess : labels.registerSuccess)
      f7.views.current.router.navigate('/home/')
      f7.panel.close('right') 
    } catch (err){
      setInprocess(false)
      setError(getMessage(f7.views.current.router.currentRoute.path, err))
    }
  }
  return (
    <Page>
      <Navbar title={labels.newUser} backLink={labels.back} />
      <List form>
        <ListInput
          label={labels.name}
          type="text"
          placeholder={labels.namePlaceholder}
          name="name"
          clearButton
          autofocus
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
        <ListInput
          label={labels.password}
          type="number"
          placeholder={labels.passwordPlaceholder}
          name="password"
          clearButton
          value={password}
          errorMessage={passwordErrorMessage}
          errorMessageForce
          onChange={e => setPassword(e.target.value)}
          onInputClear={() => setPassword('')}
        />
        {props.type === 'o' &&
          <ListInput
            label={labels.storeName}
            type="text"
            placeholder={labels.namePlaceholder}
            name="storeName"
            clearButton
            value={storeName}
            errorMessage={storeNameErrorMessage}
            errorMessageForce
            onChange={e => setStoreName(e.target.value)}
            onInputClear={() => setStoreName('')}
          />
        }
        {!positionError &&
          <ListButton 
            title={labels.setPosition} 
            onClick={handleSetPosition}
          />
        }
        {positionError && 
          <ListInput
            label={labels.address}
            type="text"
            placeholder={labels.namePlaceholder}
            name="name"
            clearButton
            autofocus
            value={address}
            errorMessage={nameErrorMessage}
            errorMessageForce
            onChange={e => setAddress(e.target.value)}
            onInputClear={() => setAddress('')}
          />
        }
      </List>
      {name && mobile && password && (position.lat || address) && (storeName || props.type !== 'o') && !nameErrorMessage && !mobileErrorMessage && !passwordErrorMessage && !storeNameErrorMessage &&
        <Button text={labels.register} large onClick={() => handleRegister()} />
      }
    </Page>
  )
}
export default StoreOwner
