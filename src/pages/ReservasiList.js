import Page from "./Page"
import homeView from "../templates/reservasi-list.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class ReservasiList extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default ReservasiList