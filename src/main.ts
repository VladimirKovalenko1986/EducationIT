import './styles/variables.css'
import './styles/base.css'
import { App } from './app/App'
import { courses } from './data/courses'

document.querySelector('#app')!.replaceWith(App({ courses }))
