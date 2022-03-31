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
    if(BasketLocalStorage.get('items')){
      return posPaymentView({totalPrice: BasketLocalStorage.get('totalDiscount') === 0 ? BasketLocalStorage.get('totalPrice') : BasketLocalStorage.get('totalAfterDiscount')})
    }else{
      return posPaymentView({totalPrice: TransactionLocalStorage.get('totalDiscount') === 0 ? TransactionLocalStorage.get('total_prices') : TransactionLocalStorage.get('totalAfterDiscount')})
    }
  }
}

export default PosPayment