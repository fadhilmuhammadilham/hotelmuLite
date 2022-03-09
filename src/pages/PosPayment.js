import Page from "./Page"
import posPaymentView from "../templates/pos-payment.handlebars"
import BasketService from "../services/BasketService"
import EDCLocalStorage from "../repositories/localstorage/EDCLocalStorage"

class PosPayment extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()
  }

  async action() {
    EDCLocalStorage.removeAll()
  }

  render() {
    return posPaymentView({totalPrice: this.basketService.totalAfterDiscount === 0 ? this.basketService.totalPrice : this.basketService.totalAfterDiscount})
  }
}

export default PosPayment