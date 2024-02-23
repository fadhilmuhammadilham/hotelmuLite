import Page from "./Page"
import homeView from "../templates/form-reservasi.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class formReservasi extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default formReservasi