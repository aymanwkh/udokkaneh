import React, { useContext } from 'react'
import {Page, Navbar, NavLeft, NavTitle, Link, Toolbar } from 'framework7-react'
import Sections from './Sections'
import BottomToolbar from './BottomToolbar';
import logo from '../coollogo_com-18673500.png'
import { StoreContext } from '../data/Store';


const HomePage = props => {
  const { state } = useContext(StoreContext)

  return (
    <Page>
      <Navbar>
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="right"></Link>
        </NavLeft>
        <NavTitle>
          <img src={logo} className="logo" alt=""/>
          <span className='banner'>{state.labels.banner}</span>
        </NavTitle>
      </Navbar>
      <Sections/>
      <Toolbar bottom>
        <BottomToolbar isHome="1"/>
      </Toolbar>
    </Page>
  )
}

export default HomePage
