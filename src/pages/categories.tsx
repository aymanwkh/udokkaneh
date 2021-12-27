import { useMemo } from 'react'
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
  const categories = useSelector<State, Category[]>(state => state.categories)
  const params = useParams<Params>()
  const categoryList = useMemo(() => categories.filter(c => c.parentId === params.id).sort((c1, c2) => c1.ordering - c2.ordering), [categories, params.id])
  const currentCategory = useMemo(() => categories.find(c => c.id === params.id), [categories, params.id])
  let i = 0
  return (
    <IonPage>
      <IonLoading isOpen={categories.length === 0} />
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
        {categoryList.map(c => 
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
