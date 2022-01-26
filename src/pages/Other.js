import Page from "./Page"
import otherView from "../templates/other.handlebars"

class PosPayment extends Page {
  constructor(params) {
    super(params)
  }

  async action() {}

  render() {
    return otherView()
  }
}

export default PosPayment