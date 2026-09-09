// Marca si esta es la primera vez que se muestra la landing en esta carga de
// pagina. Sirve para que las animaciones de entrada (el overlay del intro y el
// reveal del Hero) corran solo al entrar al sitio, y no cada vez que se vuelve
// desde una noticia.
//
// Tiene que vivir en un modulo y no dentro de <script setup>: ese codigo se
// compila dentro de setup() y se reinicia en cada montaje del componente.
//
// Lo consume Landing en su onMounted, que en Vue corre DESPUES del de sus
// hijos: asi IntroOverlay y Hero alcanzan a leerlo en true la primera vez.
let primeraVisita = true

export function esPrimeraVisita() {
  return primeraVisita
}

export function marcarVisitada() {
  primeraVisita = false
}
