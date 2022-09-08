import { App as CapacitorApp } from '@capacitor/app'
import Router from './core/Router'
import Redirect from './core/Redirect'
import ConfigLocalStorage from './repositories/localstorage/ConfigLocalStorage'
import $ from 'jquery'
import './assets/css/style.css'
import './assets/css/custom.css'
import './assets/img/logo.png'
import './assets/img/placeholder.jpg'
import 'bootstrap'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

window.addEventListener("popstate", async () => {
  let modalIs = await new Promise(resolve => {
    let found = false
    $('.modal').each((i, elm) => {
      if ($(elm).hasClass('show')) {
        $(elm).modal('hide')
        found = true
      }
    })

    resolve(found)
  })

  if (modalIs) {
    history.forward()
    return
  }

  Router()
})

/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function (n, withCurrency = true, s = '.', c = ',') {
  var x = 3;
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  const currency = ConfigLocalStorage.get('currency')

  return (withCurrency ? currency.symbol : '') + (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.closest('a') != null) {
      if (e.target.closest('a').matches("[data-link]")) {
        e.preventDefault()
        Redirect(e.target.closest('a').href)
      }
    }
  })

  Router()
})

CapacitorApp.addListener('backButton', async ({ canGoBack }) => {
  if (!canGoBack) {
    CapacitorApp.exitApp()
  } else {
    let modalIs = await new Promise(resolve => {
      let found = false
      $('.modal').each((i, elm) => {
        if ($(elm).hasClass('show')) {
          $(elm).modal('hide')
          found = true
        }
      })

      resolve(found)
    })

    if (modalIs) return

    window.history.back()
  }
})

