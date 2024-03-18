import Page from "./Page"
import homeView from "../templates/rates-type.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class RatesType extends Page {
  constructor(params) {
    super(params)
  }

  action() { 
  }

  render() {
    
    return homeView({})
  }
}

export default RatesType