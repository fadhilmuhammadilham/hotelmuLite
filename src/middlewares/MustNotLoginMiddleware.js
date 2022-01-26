import Middleware from "./Middleware"
import Redirect from "../core/Redirect"
import { getCookie } from "../core/Cookies"

class MustNotLoginMidlleware extends Middleware {
  before() {
    const token = getCookie('token')

    if (token) {
      Redirect('/', true)
      return false
    }

    return true
  }
}

export default MustNotLoginMidlleware