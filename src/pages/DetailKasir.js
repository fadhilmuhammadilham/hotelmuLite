import Page from "./Page"
import homeView from "../templates/detail-kasir.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class DetailKasir extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default DetailKasir