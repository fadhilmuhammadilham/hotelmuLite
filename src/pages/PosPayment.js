import Page from "./Page"
import posPaymentView from "../templates/pos-payment.handlebars"
import BasketService from "../services/BasketService"

class PosPayment extends Page {
  constructor(params) {
    super(params)
    this.basketService = new BasketService()
  }

  async action() {}

  render() {
    return posPaymentView({totalPrice: this.basketService.totalPrice})
  }
}

export default PosPayment