import Page from "./Page";
import $ from "jquery"
import BasketService from "../services/BasketService";
import GuestApi from "../repositories/api/GuestApi";
import guestView from "../templates/guest.handlebars";
import guestItem from "../templates/guest-item.handlebars"

class PosGuest extends Page {
    constructor(params) {
        super(params)
    }

    async getGuest() {
        try {
            let res = await GuestApi.getAll()

            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    async action() {
        const dataGuest = await this.getGuest()
        const basketService = new BasketService()

        $('.items-guest').html(guestItem({guests: dataGuest}))

        $('.guest-id').on('click', (e) => {
            let id = $(e.currentTarget).data('id')
            let name = $(e.currentTarget).data('name')

            basketService.setGuest({id: id, guest_name: name})
            window.history.back()
        })
    }

    render() {
        return guestView()
    }
}

export default PosGuest