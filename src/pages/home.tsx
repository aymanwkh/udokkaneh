import { IonButtons, IonContent, IonHeader, IonLoading , IonMenuButton, IonPage, IonTitle, IonToolbar, IonBadge, IonButton } from '@ionic/react';
import { useEffect, useState } from 'react'
import labels from '../data/labels'
import { Advert, State, Category, Notification, UserInfo } from '../data/types'
import Footer from './footer'
import { colors } from '../data/config'
import { useSelector } from 'react-redux';

const Home = () => {
  const categories = useSelector<State, Category[]>(state => state.categories)
  const adverts = useSelector<State, Advert[]>(state => state.adverts)
  const notifications = useSelector<State, Notification[]>(state => state.notifications)
  const userInfo = useSelector<State, UserInfo | undefined>(state => state.userInfo)
  const [advert, setAdvert] = useState<Advert | undefined>(undefined)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [categoryList, setCategoryList] = useState<Category[]>([])
  useEffect(() => {
    setCategoryList(() => categories.filter(c => c.parentId === '0').sort((c1, c2) => c1.ordering - c2.ordering))
  }, [categories])
  useEffect(() => {
    const now = new Date()
    const today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
    setAdvert(() => adverts.find(a => a.startDate <= today && a.endDate >= today))
  }, [adverts])
  useEffect(() => {
    if (userInfo) {
      setNotificationsCount(() => notifications.filter(n => n.time > (userInfo!.lastSeen || userInfo!.time!)).length)
    } else {
      setNotificationsCount(0)
    }
  }, [userInfo, notifications])
  let i = 0
  return (
    <IonPage>
      <IonLoading isOpen={categories.length === 0} />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            {notificationsCount > 0 && 
              <IonBadge className="badge" style={{left: '20px'}}>
                {notificationsCount}
              </IonBadge>
            }
          </IonButtons>
          <IonTitle><img src="/dokaneh_logo.png" alt="logo" style={{width: '120px', marginBottom: '-5px'}} /></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"><img src="/dokaneh_logo.png" alt="logo" style={{width: '120px', marginBottom: '-15px'}} /></IonTitle>
          </IonToolbar>
        </IonHeader>
        {advert && 
          <IonButton 
            routerLink="/advert" 
            expand="block" 
            shape="round" 
            fill="outline"
            className="advert"
          >
            {advert.title}
          </IonButton>
        }
        <IonButton 
          routerLink="/packs/a/0/0"
          expand="block"
          shape="round"
          className={colors[i++ % 10].name}
          style={{margin: '0.9rem'}}
        >
          {labels.allProducts}
        </IonButton>
        {categoryList.map(c => 
          <IonButton
            routerLink={c.isLeaf ? `/packs/n/${c.id}/0` : `/categories/${c.id}`} 
            expand="block"
            shape="round"
            className={colors[i++ % 10].name}
            style={{margin: '0.9rem'}}
            key={c.id}
          >
            {c.name}
          </IonButton>
        )}
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export default Home
