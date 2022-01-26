import Middleware from "./Middleware"
import Redirect from "../core/Redirect"
import ConfigLocalStorage from "../repositories/localstorage/ConfigLocalStorage"

class MustChooseHotelMidlleware extends Middleware {
  before() {
    const hotelId = ConfigLocalStorage.get('hotelId')

    if (!hotelId) {
      Redirect('/setup', true)
      return false
    }

    return true
  }
}

class MustNotChooseHotelMidlleware extends Middleware {
  before() {
    const hotelId = ConfigLocalStorage.get('hotelId')

    if (hotelId) {
      Redirect('/login', true)
      return false
    }

    return true
  }
}

export { MustChooseHotelMidlleware, MustNotChooseHotelMidlleware }