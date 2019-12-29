import React from 'react'
import {Page, Navbar, NavLeft, NavTitle, Link, Toolbar, NavTitleLarge } from 'framework7-react'
import Sections from './Sections'
import BottomToolbar from './BottomToolbar'
import labels from '../data/labels'


const Home = props => {
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
      <Sections/>
      <Toolbar bottom>
        <BottomToolbar isHome="1"/>
      </Toolbar>
    </Page>
  )
}

export default Home
