import Page from "./Page"
import homeView from "../templates/detail-void.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class DetailVoid extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default DetailVoid