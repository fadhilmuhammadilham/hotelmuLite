import Redirect from "../core/Redirect";
import BasketLocalStorage from "../repositories/localstorage/BasketLocalStorage";
import Middleware from "./Middleware";
import BasketService from "../services/BasketService";
import MyToast from "../utils/MyToast";

class MustHaveTransactionReadyMiddleware extends Middleware {
  before() {
    if (BasketLocalStorage.get('id') === false) {
      window.history.back()
      return false
    }
    return true
  }
}

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
  async before() {
    const table = BasketLocalStorage.get('table')

    if (!table.id) {
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

export { MustHaveTransactionReadyMiddleware, MustSelectTypeMiddleware, MustHaveSelectedItemsMiddleware, MustSelectedPaymentTypeMiddleware, MustSelectedRoomOrTableMiddleware, MustNotSelectItemMiddleware, TransactionValidateMiddleware }