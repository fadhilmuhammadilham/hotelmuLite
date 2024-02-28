import Page from "./Page"
import homeView from "../templates/void-reservasi.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class VoidReservasi extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default VoidReservasi