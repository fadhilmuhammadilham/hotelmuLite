import Page from "./Page"
import homeView from "../templates/kamar-reservasi.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class KamarReservasi extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default KamarReservasi