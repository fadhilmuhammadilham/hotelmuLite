import Page from "./Page";
import $ from "jquery"
import edcView from "../templates/pos-payment-edc.handlebars"
import edcItem from "../templates/pos-payment-edc-item.handlebars"
import EDCApi from "../repositories/api/EDCApi";
import EDCLocalStorage from "../repositories/localstorage/EDCLocalStorage"

class PosEDC extends Page {
    constructor(params) {
        super(params)
    }

    async action() {
        let res = await EDCApi.getAll()

        $('.edc-item').html(edcItem({edc_items: res.data}))

        $('.edc-item-pick').on('click', (e) => {
            let edc_id = $(e.currentTarget).data('id')
            let edc_name = $(e.currentTarget).data('name')

            EDCLocalStorage.set({
                id: edc_id,
                name: edc_name
            })
            window.history.back()
        })
    }

    render() {
        return edcView();
    }
}

export default PosEDC