import Redirect from "../core/Redirect";
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage";
import TableLocalStorage from "../repositories/localstorage/TableLocalStorage";
import TransactionLocalStorage from "../repositories/localstorage/TransactionLocalStorage";
import Middleware from "./Middleware";
import BasketService from "../services/BasketService";
import MyToast from "../utils/MyToast";

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
    const payment_draft = TransactionLocalStorage.get('payment')

    if (!payment && !payment_draft) {
      // Redirect('/pos/payment', true);
      window.history.back()
      return false
    }

    return true
  }
}

class MustSelectedRoomOrTableMiddleware extends Middleware {
  async before() {
    const table = BasketLocalStorage.get('table')
    const table_id = TransactionLocalStorage.get('table_id')

    if (!table.id && !table_id) {
      // Redirect('/pos/basket', true);
      await MyToast.show('Silahkan Pilih Meja Terlebih Dahulu');
      window.history.back()
      return false
    }

    return true
  }
}

class MustNotSelectItemMiddleware extends Middleware {
  before() {
    const item = BasketLocalStorage.get('items')

    if (item.length > 0) {
      MyToast.show('Silahkan Kosongkan Keranjang Terlebih Dahulu');
      Redirect('/pos')
      return false;
    }

    return true;
  }
}

class TransactionValidateMiddleware extends Middleware {
  before() {
    const basketService = new BasketService()

    if (!basketService.table.id && basketService.type.isroom.toString() == "0") {
      MyToast.show('Silahkan pilih meja terlebih dahulu');
      window.history.back()
      return false;
    }

    if (basketService.numberOfGuest < 1 && basketService.type.isroom.toString() == "0") {
      MyToast.show('Isi jumlah tamu terlebih dahulu');
      window.history.back()
      return false;
    }

    return true;
  }
}

export { MustSelectTypeMiddleware, MustHaveSelectedItemsMiddleware, MustSelectedPaymentTypeMiddleware, MustSelectedRoomOrTableMiddleware, MustNotSelectItemMiddleware, TransactionValidateMiddleware }