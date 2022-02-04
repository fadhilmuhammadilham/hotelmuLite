import Redirect from "../core/Redirect";
import Page from "./Page";
import setupView from "../templates/setup.handlebars"
import HotelApi from "../repositories/api/HotelApi";
import ConfigLocalStorage from "../repositories/localstorage/ConfigLocalStorage";
import $ from 'jquery'

class Setup extends Page {
  constructor(params) {
    super(params)
  }

  action() {
    const idInput = $('#id-hotel-input')
    const passwordInput = $('#security-code-input')
    const submitButton = $('#submit-button')
    
    const checkForm = () => {
      if (idInput.val().length < 5 || passwordInput.val().length < 1) submitButton.attr('disabled', true)
      else submitButton.removeAttr('disabled')
    }

    $('#id-hotel-input, #security-code-input').on('keyup', checkForm)

    $('#form-setup').on('submit', async (e) => {
      submitButton.attr('disabled', true)
      submitButton.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`)

      e.preventDefault()

      let res = await HotelApi.signin(idInput.val(), passwordInput.val())

      submitButton.attr('disabled', false)
      submitButton.html('Submit')
      // if (res.status) {
      //   ConfigLocalStorage.set('hotelId', idInput.val())
      //   Redirect('/login', true)
      // }
      // else {
      //   alert(res.message)
      // }

      console.log(res);
      
    }) 
  }

  render() {
    return setupView()
  }
}

export default Setup