import Page from "./Page"
import reportView from "../templates/report.handlebars"

class PosPayment extends Page {
  constructor(params) {
    super(params)
  }

  async action() {}

  render() {
    return reportView()
  }
}

export default PosPayment