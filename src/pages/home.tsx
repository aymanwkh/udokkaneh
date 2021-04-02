import { useContext, useState, useEffect } from 'react'
import { f7, Page, Navbar, NavLeft, NavTitle, Link, Block, Button, Toolbar, NavTitleLarge } from 'framework7-react'
import Footer from './footer'
import MainCategories from './main-categories'
import { StoreContext } from '../data/store'
import { Advert, Notification } from '../data/interfaces'
import labels from '../data/labels'

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
      <Navbar large>
        <NavLeft>
          <Link iconMaterial="menu" panelOpen="right" iconBadge={notifications.length || undefined} badgeColor="red" />
        </NavLeft>
        <NavTitle sliding>
          <img src="/dokaneh_logo.png" alt="logo" className="logo" />
          <span className='banner'>{labels.banner}</span>
        </NavTitle>
        <NavTitleLarge>
          <img src="/dokaneh_logo.png" alt="logo" className="logo" />
          <span className='banner'>{labels.banner}</span>
        </NavTitleLarge>
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
