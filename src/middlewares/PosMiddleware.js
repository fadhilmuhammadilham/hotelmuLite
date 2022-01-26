import Redirect from "../core/Redirect";
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage";
import Middleware from "./Middleware";

class MustSelectTypeMiddleware extends Middleware {
  before() {
    const type = BasketLocalStorage.get('type')

    if (!type) {
      window.history.back()
      // Redirect('/transaction', true)
      return false
    }

    return true
  }
}

class MustHaveSelectedItemsMiddleware extends Middleware {
  before() {
    const items = BasketLocalStorage.get('items')

    if (!items) {
      window.history.back()
      // Redirect('/pos', true);
      return false
    }

    return true
  }
}

class MustSelectedPaymentTypeMiddleware extends Middleware {
  before() {
    const payment = BasketLocalStorage.get('payment')

    if (!payment) {
      // Redirect('/pos/payment', true);
      window.history.back()
      return false
    }

    return true
  }
}

class MustSelectedRoomOrTableMiddleware extends Middleware {
  before() {
    const payment = BasketLocalStorage.get('payment')

    if (!payment) {
      // Redirect('/pos/basket', true);
      window.history.back()
      return false
    }

    return true
  }
}

export { MustSelectTypeMiddleware, MustHaveSelectedItemsMiddleware, MustSelectedPaymentTypeMiddleware, MustSelectedRoomOrTableMiddleware }