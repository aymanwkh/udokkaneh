import React, { useContext, useMemo } from 'react'
import {Page, Navbar, NavLeft, NavTitle, Link, Toolbar, NavTitleLarge, Block, Button } from 'framework7-react'
import BottomToolbar from './bottom-toolbar'
import labels from '../data/labels'
import MainCategories from './main-categories'
import { StoreContext } from '../data/store'


const Home = props => {
  const { state } = useContext(StoreContext)
  const advert = useMemo(() => state.adverts.find(a => a.isActive)
  , [state.adverts])
  return (
    <Page>
      <Navbar large>
        <NavLeft>
          <Link iconMaterial="menu" panelOpen="right"></Link>
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
        <BottomToolbar isHome="1"/>
      </Toolbar>
    </Page>
  )
}

export default Home
