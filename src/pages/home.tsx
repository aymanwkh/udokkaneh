import { useContext, useState, useEffect } from 'react'
import { f7, Page, Navbar, NavLeft, NavTitle, Link, Block, Button, Toolbar } from 'framework7-react'
import Footer from './footer'
import MainCategories from './main-categories'
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
    if (state.categories.length === 0) {
      f7.dialog.preloader('')
    } else {
      f7.dialog.close()
    }
  }, [state.categories])

  return (
    <Page>
      <Navbar>
        <NavLeft>
          <Link iconMaterial="menu" panelOpen={setup.locale === 'en' ? 'left' : 'right'} iconBadge={notifications.length} badgeColor="red" />
        </NavLeft>
        <NavTitle>
          <img src={setup.locale === 'en' ? '/logo_e.png' : '/logo_a.png'} alt="logo" style={{width: setup.locale === 'en' ? '150px' : '100px'}} />
        </NavTitle>
      </Navbar>
      <Block>
      {advert ? <Button href="/advert/" large outline text={advert.title} className="sections" /> : ''}
      <MainCategories/>
      </Block>
      <Toolbar bottom>
        <Footer isHome="1"/>
      </Toolbar>
    </Page>
  )
}

export default Home
