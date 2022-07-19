import Page from "./Page"
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage"
import $ from "jquery"
import openShiftView from "../templates/shift-open.handlebars"
import ShiftApi from "../repositories/api/ShiftApi"
import Redirect from "../core/Redirect"
import AutoNumeric from "autonumeric"

class ShiftOpen extends Page {
  constructor(params) {
    super(params)
  }

  action() {
    const submitButton = $('#open-shift-btn')
    const beginBalance = new AutoNumeric('#saldo-awal', {
      digitGroupSeparator: '.',
      decimalCharacter: ',',
      decimalPlaces: 2
    });

    const checkFrom = () => {
      if (beginBalance.get().length < 1) submitButton.attr('disabled', true)
      else submitButton.removeAttr('disabled')
    }

    $('#saldo-awal').on('keyup', checkFrom);

    $('#form-shift').on('submit', async (e) => {
      submitButton.attr('disabled', true)
      submitButton.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`)

      e.preventDefault()

      let res = await ShiftApi.open(beginBalance.get())

      if (res.status) {
        ShiftLocalStorage.set(res.data)
        Redirect('/', true)
      } else {
        alert(res.message)
      }

      submitButton.attr('disabled', false)
      submitButton.html('Submit')
    })
  }

  render() {
    return openShiftView();
  }
}

export default ShiftOpen