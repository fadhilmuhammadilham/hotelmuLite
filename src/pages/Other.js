import Page from "./Page"
import otherView from "../templates/other.handlebars"
import $ from "jquery"
import { unSetCookie } from "../core/Cookies"
import Redirect from "../core/Redirect"
import UserLocalStorage from "../repositories/localstorage/UserLocalStorage"

class PosPayment extends Page {
  constructor(params) {
    super(params)
  }

  async action() {

    $('#logout-user').on('click', async () => {
      $('#DialogBasic-logout').modal('show');
    })

    $('#confirm-logout').on('click', () => {
      console.log('Confirmed: True')
      $('#DialogBasic-logout').modal('hide');
      unSetCookie('token')
      UserLocalStorage.removeAll();
      Redirect('/login', true)
      return true
    })

  }

  render() {
    return otherView()
  }
}

export default PosPayment