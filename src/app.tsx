import { App, Panel, View } from 'framework7-react'
import routes from './routes'
import Store from './data/store'
import { setup } from './data/config'
const app = () => {
  const f7params = {
    id: 'io.framework7.dokaneh', 
    name: 'Dokkaneh', 
    theme: 'ios',
    routes,
  }
  return (
    <Store>
      <App params={f7params}>
        <Panel left={setup.locale === 'en'} right={setup.locale === 'ar'} reveal themeDark>
          <View url="/panel/"/>
        </Panel>
        <View id="main-view" url="/" main className="safe-areas" pushState={true} />
      </App>
    </Store>
  )
}

export default app