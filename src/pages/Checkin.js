import Page from "./Page"
import homeView from "../templates/check-in-page.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class Checkin extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default Checkin