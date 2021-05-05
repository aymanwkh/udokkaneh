import {useContext, useState, useEffect} from 'react'
import {f7, Page, Navbar, NavLeft, NavTitle, Link, Block, Button, NavTitleLarge, Toolbar} from 'framework7-react'
import MainCategories from './main-categories'
import {StateContext} from '../data/state-provider'
import {Advert} from '../data/types'
import labels from '../data/labels'
import Footer from './footer'

const Home = () => {
  const {state} = useContext(StateContext)
  const [advert, setAdvert] = useState<Advert | undefined>(undefined)
  const [notificationsCount, setNotificationsCount] = useState(0)
  useEffect(() => {
    setAdvert(() => state.adverts.find(a => a.isActive))
  }, [state.adverts])
  useEffect(() => {
    if (state.userInfo) {
      setNotificationsCount(() => state.notifications.filter(n => n.time > (state.userInfo!.lastSeen || state.userInfo!.time!)).length)
    } else {
      setNotificationsCount(0)
    }
  }, [state.userInfo, state.notifications])
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
          <Link iconMaterial="menu" panelOpen="right" iconBadge={notificationsCount || ''} badgeColor="red" />
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
        <Footer />
      </Toolbar>
    </Page>
  )
}

export default Home
