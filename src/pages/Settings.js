import Page from "./Page"
import homeView from "../templates/setting.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class Setting extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default Setting