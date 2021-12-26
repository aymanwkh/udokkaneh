import { useState, useEffect } from 'react'
import { IonButton, IonContent, IonLoading, IonPage } from '@ionic/react'
import { colors } from '../data/config'
import labels from '../data/labels'
import { Category, State } from '../data/types'
import Header from './header'
import { useParams } from 'react-router'
import Footer from './footer'
import { useSelector } from 'react-redux'

type Params = {
  id: string
} 
const Categories = () => {
  const state = useSelector<State, State>(state => state)
  const params = useParams<Params>()
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategory] = useState(() => state.categories.find(c => c.id === params.id))
  useEffect(() => {
    setCategories(() => {
      const categories = state.categories.filter(c => c.parentId === params.id)
      return categories.sort((c1, c2) => c1.ordering - c2.ordering)
    })
  }, [state.categories, params.id])
  let i = 0
  return (
    <IonPage>
      <IonLoading isOpen={state.categories.length === 0} />
      <Header title={currentCategory?.name} />
      <IonContent fullscreen>
        <IonButton 
          routerLink={`/packs/a/${params.id}/0`} 
          expand="block"
          shape="round"
          className={colors[i++ % 10].name}
          style={{margin: '0.9rem'}}
        >
          {labels.allProducts}
        </IonButton>
        {categories.map(c => 
          <IonButton
            routerLink={c.isLeaf ? `/packs/c/${c.id}/0` : `/categories/${c.id}`} 
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
export default Categories
