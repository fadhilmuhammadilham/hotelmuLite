import Page from "./Page"
import homeView from "../templates/detail-profile.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class DetailProfile extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default DetailProfile