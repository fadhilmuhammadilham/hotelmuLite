import Page from "./Page"
import homeView from "../templates/pilih-reservasi.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class PilihReservasi extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default PilihReservasi