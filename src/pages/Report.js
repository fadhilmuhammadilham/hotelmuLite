import Page from "./Page"
import $ from "jquery"
import reportView from "../templates/report.handlebars"
import reportItemView from "../templates/report-item.handlebars"
import ReportApi from "../repositories/api/ReportApi"
import date_format from "../templates/helpers/date_format"

class PosPayment extends Page {
  constructor(params) {
    super(params)
  }

  async getRecent() {
    try {
      let res = await ReportApi.getRecent()

      return res.data
    } catch (error) {
      console.log(error);
    }
  }

  async action() {
    const recentData = await this.getRecent()
    $('.item-transaski').html(reportItemView({transaction_data: recentData, type: "month"}))
  }

  render() {
    return reportView()
  }
}

export default PosPayment