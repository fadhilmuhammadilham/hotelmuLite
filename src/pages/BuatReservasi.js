import Page from "./Page"
import homeView from "../templates/buat-reservasi.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class buatReservasi extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default buatReservasi