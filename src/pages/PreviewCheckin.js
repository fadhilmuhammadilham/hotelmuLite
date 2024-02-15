import Page from "./Page"
import homeView from "../templates/preview-checkin.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class PreviewCheckin extends Page {
  constructor(params) {
    super(params)
  }

  action() {
  }

  render() {
    
    return homeView({})
  }
}

export default PreviewCheckin