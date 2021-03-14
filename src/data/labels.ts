import { setup } from './config'
import labels_a from './labels_a'
import labels_e from './labels_e'

const labels = setup.locale === 'en' ? labels_e : labels_a

export default labels