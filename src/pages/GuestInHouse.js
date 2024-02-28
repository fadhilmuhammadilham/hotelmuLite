import Page from "./Page"
import homeView from "../templates/guest-in-house.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class GuestInHouse extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default GuestInHouse