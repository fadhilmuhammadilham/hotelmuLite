import Page from "./Page"
import homeView from "../templates/guaranteed-reservasi.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class GuaranteedReservasi extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default GuaranteedReservasi