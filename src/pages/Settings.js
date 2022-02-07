import Page from "./Page";
import ConfigLocalStorage from "../repositories/localstorage/ConfigLocalStorage";
import UserLocalStorage from "../repositories/localstorage/UserLocalStorage";
import $ from "jquery";
import settingView from "../templates/settings.handlebars"
import { unSetCookie } from "../core/Cookies";
import ShiftLocalStorage from "../repositories/localstorage/ShiftLocalStorage";

class Settings extends Page {
    constructor(params){
        super(params)
    }

    action() {
        $('#reset-btn').on('click', async () => {
            $('#DialogBasic-reset').modal('show');
        })

        $('#confirm-reset').on('click', () => {
            console.log('Confirmed: True')
            $('#DialogBasic-reset').modal('hide');
            unSetCookie('token')
            ConfigLocalStorage.removeAll();
            UserLocalStorage.removeAll();
            ShiftLocalStorage.removeAll();
            Redirect('/setup', true)
            return true
        })
    }

    render() {
        return settingView({hotel_id: ConfigLocalStorage.get('hotelId')})
    }
}

export default Settings