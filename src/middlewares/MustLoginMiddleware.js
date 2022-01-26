import Middleware from "./Middleware"
import Redirect from "../core/Redirect"
import { getCookie } from "../core/Cookies"

class MustLoginMidlleware extends Middleware {
  before() {
    const token = getCookie('token')

    if (!token) {
      Redirect('/login', true)
      return false
    }

    return true
  }
}

export default MustLoginMidlleware