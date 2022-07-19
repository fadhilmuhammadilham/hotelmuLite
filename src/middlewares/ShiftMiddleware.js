import Middleware from "./Middleware"
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage"
import MyToast from "../utils/MyToast";

class MustOpenShiftMidlleware extends Middleware {
  before() {
    const shift_id = ShiftLocalStorage.get('id');

    if (!shift_id) {
      MyToast.show("Silahkan Buka Shift Terlebih Dahulu")
      window.history.back();
      return false
    }

    return true
  }
}

class MustCloseShiftMiddleware extends Middleware {
  before() {
    const shift_id = ShiftLocalStorage.get('id');

    if (shift_id) {
      MyToast.show("Silahkan Tutup Shift Terlebih Dahulu")
      window.history.back();
      return false
    }

    return true
  }
}

export { MustOpenShiftMidlleware, MustCloseShiftMiddleware }