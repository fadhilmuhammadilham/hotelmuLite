import Page from "./Page"
import homeView from "../templates/inventory.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class inventory extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default inventory