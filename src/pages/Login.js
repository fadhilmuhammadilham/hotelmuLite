import Page from "./Page";
import Redirect from "../core/Redirect";
import loginView from '../templates/login.handlebars'
import $ from 'jquery'
import UserApi from "../repositories/api/UserApi";
import { setCookie } from '../core/Cookies'

class Login extends Page {
  constructor(params) {
    super(params)
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
        setCookie('token', res.data.token, res.data.expire)
        Redirect('/', true)
      }
      else {
        alert(res.message)
      }
    })
  }

  render() {
    return loginView()
  }
}

export default Login