import Page from "./Page"
import posPaymentView from "../templates/pos-payment.handlebars"
import BasketService from "../services/BasketService"
import EDCLocalStorage from "../repositories/localstorage/EDCLocalStorage"
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"

class PosPayment extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()
  }

  async action() {
    EDCLocalStorage.removeAll()
  }

  render() {
    return posPaymentView({ total: this.basketService.total })
  }
}

export default PosPayment