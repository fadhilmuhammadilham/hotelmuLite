import Page from "./Page"
import homeView from "../templates/kamar-checkin.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class Kamar extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default Kamar