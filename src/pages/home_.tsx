import Container from '@material-ui/core/Container';
import { useContext, useState, useEffect } from 'react'
import MainCategories from './main-categories_'
import { StoreContext } from '../data/store'
import { Advert, Notification } from '../data/interfaces'
import { setup } from '../data/config'

const Home = () => {
  const { state } = useContext(StoreContext)
  const [advert, setAdvert] = useState<Advert | undefined>(undefined)
  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {
    setAdvert(() => state.adverts.find(a => a.isActive))
  }, [state.adverts])
  useEffect(() => {
    setNotifications(() => state.userInfo?.notifications?.filter(n => n.status === 'n') || [])
  }, [state.userInfo])
  useEffect(() => {
    // if (state.categories.length === 0) {
    //   f7.dialog.preloader('')
    // } else {
    //   f7.dialog.close()
    // }
  }, [state.categories])

  return (
    <Container maxWidth="sm">
      <MainCategories/>
    </Container>
  )
}

export default Home



