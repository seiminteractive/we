import { createApp } from 'vue'
import App from './App.vue'
import './styles/base.css'
import 'primeicons/primeicons.css'
import 'flag-icons/css/flag-icons.min.css'
import { initLenis } from './lib/lenis'

const app = createApp(App)
app.mount('#app')

initLenis()
