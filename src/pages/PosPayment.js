import Page from "./Page"
import posPaymentView from "../templates/pos-payment.handlebars"
import BasketService from "../services/BasketService"
import EDCLocalStorage from "../repositories/localstorage/EDCLocalStorage"
import TransactionService from "../services/TransactionService"
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage"
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage"

class PosPayment extends Page {
  constructor(params) {
    super(params)
    // this.basketService = new BasketService()
    // this.transactionService = new TransactionService()
  }

  async action() {
    EDCLocalStorage.removeAll()
  }

  render() {
    return posPaymentView({ total: BasketLocalStorage.get('total') })
    // if (BasketLocalStorage.get('items')) {
    // } else {
    //   return posPaymentView({ total: TransactionLocalStorage.get('totalDiscount') === 0 ? TransactionLocalStorage.get('total_prices') : TransactionLocalStorage.get('totalAfterDiscount') })
    // }
  }
}

export default PosPayment