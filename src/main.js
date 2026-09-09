import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/base.css'
import 'primeicons/primeicons.css'
import 'flag-icons/css/flag-icons.min.css'

// Lenis (scroll suave) ya no se inicializa aca: vive en Landing.vue para que
// no se aplique al panel /admin.
createApp(App).use(router).mount('#app')
