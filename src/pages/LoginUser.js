import Page from "./Page"
import homeView from "../templates/login-user.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class LoginUser extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default LoginUser