import Middleware from "./Middleware"
import Redirect from "../core/Redirect"
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage"

class MustOpenShiftMidlleware extends Middleware {
  before() {
    const shift_id = ShiftLocalStorage.get('id');

    if (!shift_id) {
      alert("Silahkan Buka Shift Terlebih Dahulu")
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
      alert("Silahkan Tutup Shift Terlebih Dahulu")
      window.history.back();
      return false
    }

    return true
  }
}

export { MustOpenShiftMidlleware, MustCloseShiftMiddleware}