import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom'

// Runs before React mounts anything - earlier than any component's
// useEffect, so it lands before Lenis (SmoothScroll.jsx) and GSAP's
// ScrollTrigger (heroAnimations.js) ever read a scroll position. Without
// this, a mid-scroll refresh restores the browser's remembered scroll
// offset, GSAP's ScrollTrigger markers get computed against that
// non-zero starting point, and the cinematic hero's pin/scrub math is off
// from the very first frame.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
   
  </React.StrictMode>,
)
