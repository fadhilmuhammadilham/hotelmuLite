import Page from "./Page";
import Redirect from "../core/Redirect";
import loginView from '../templates/login.handlebars'
import $ from 'jquery'
import UserApi from "../repositories/api/UserApi";
import { setCookie } from '../core/Cookies'
import UserLocalStorage from "../repositories/localstorage/UserLocalStorage";
import HotelApi from "../repositories/api/HotelApi";
import ConfigLocalStorage from "../repositories/localstorage/ConfigLocalStorage";
import MyToast from "../utils/MyToast";

class Login extends Page {
  constructor(params) {
    super(params)
  }

  async setSetting() {
    let setting = await HotelApi.setting()

    if (setting.status) ConfigLocalStorage.set({
      isRound: setting.data.is_round,
      currency: setting.data.currency,
      hotelName: setting.data.hotel_name
    })
  }

  action() {
    $('#form-login').on('submit', async (e) => {
      e.preventDefault()

      $('#login-btn').attr('disabled', true)
      $('#login-btn').html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`)
      let res = await UserApi.login($('#username').val(), $('#password').val())

      $('#login-btn').attr('disabled', false)
      $('#login-btn').html('Submit')

      if (res.status) {
        setCookie('token', res.data.token, res.data.expires + "000")
        UserLocalStorage.set(res.data.user)

        await this.setSetting()
        Redirect('/', true)
      }
      else {
        $('#alert-wrapper').html(`<div class="alert alert-danger mb-2">${res.message}</div>`)
      }
    })
  }

  render() {
    return loginView()
  }
}

export default Login