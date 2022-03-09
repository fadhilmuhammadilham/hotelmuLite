import Redirect from "../core/Redirect";
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage";
import TableLocalStorage from "../repositories/localstorage/TableLocalStorage";
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage";
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
    const items_draft = TransactionLocalStorage.get('items')

    if (!items && !items_draft) {
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
    const table = BasketLocalStorage.get('table')

    if (!table.id) {
      // Redirect('/pos/basket', true);
      alert('Silahkan Pilih Meja Terlebih Dahulu');
      window.history.back()
      return false
    }

    return true
  }
}

class MustNotSelectItemMiddleware extends Middleware {
  before() {
    const item = BasketLocalStorage.get('items')

    if(item.length > 0){
      alert('Silahkan Kosongkan Keranjang Terlebih Dahulu');
      Redirect('/pos')
      return false;
    }

    return true;
  }
}

export { MustSelectTypeMiddleware, MustHaveSelectedItemsMiddleware, MustSelectedPaymentTypeMiddleware, MustSelectedRoomOrTableMiddleware, MustNotSelectItemMiddleware }