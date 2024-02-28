import Page from "./Page"
import homeView from "../templates/detail-list.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class DetailList extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default DetailList