import Page from "./Page"
import homeView from "../templates/kasir.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class Kasir extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default Kasir