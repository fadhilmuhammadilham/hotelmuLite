import Page from "./Page"
import homeView from "../templates/detail-guest.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class GuestDetail extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default GuestDetail