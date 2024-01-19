import Page from "./Page"
import homeView from "../templates/home.handlebars"
import $ from 'jquery'
import currency from '../templates/helpers/currency'
import Redirect from "../core/Redirect"

class Home extends Page {
  constructor(params) {
    super(params)
  }

  action() {
    $('#totalSaleToday').html('Rp1.500.000')
    $('#totalTransactionToday').html('500')
  }

  render() {
    
    return homeView({ name: "Asyana Hotel" })
  }
}

export default Home