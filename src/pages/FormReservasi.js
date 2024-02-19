import Page from "./Page"
import homeView from "../templates/form-reservasi.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class Reservasi extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default Reservasi