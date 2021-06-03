import { IonButtons, IonContent, IonHeader, IonLoading , IonMenuButton, IonPage, IonTitle, IonToolbar, IonBadge, IonButton } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import labels from '../data/labels';
import { StateContext } from '../data/state-provider';
import { Advert } from '../data/types';
import Footer from './footer';
import {randomColors} from '../data/config'
import {Category} from '../data/types'

const Home = () => {
  const {state} = useContext(StateContext)
  const [advert, setAdvert] = useState<Advert | undefined>(undefined)
  const [notificationsCount, setNotificationsCount] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    setCategories(() => {
      const categories = state.categories.filter(c => c.parentId === '0')
      return categories.sort((c1, c2) => c1.ordering - c2.ordering)  
    })
  }, [state.categories])
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
  let i = 0
  return (
    <IonPage>
      <IonLoading isOpen={state.categories.length === 0} />
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            {notificationsCount > 0 && 
              <IonBadge 
              style={{fontSize: '10px', position: 'relative', bottom: '10px', left: '20px', backgroundColor: 'red'}}
              >
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
          className={randomColors[i++ % 7].name}
          style={{margin: '0.9rem'}}
        >
          {labels.allProducts}
        </IonButton>
        {categories.map(c => 
          <IonButton
            routerLink={c.isLeaf ? `/packs/n/${c.id}/0` : `/categories/${c.id}`} 
            expand="block"
            shape="round"
            className={randomColors[i++ % 7].name}
            style={{margin: '0.9rem'}}
            key={c.id}
          >
            {c.name}
          </IonButton>
        )}
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Home;
