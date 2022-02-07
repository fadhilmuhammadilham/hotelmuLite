import Page from "./Page";
import UserLocalStorage from "../repositories/localstorage/UserLocalStorage";
import profileView from "../templates/profile.handlebars";

class Profile extends Page {
    constructor(params) {
        super(params)
    }

    action() {

    }

    render() {
        return profileView({name: UserLocalStorage.get('name'), email: UserLocalStorage.get('email'), phone: UserLocalStorage.get('phone'), departement: UserLocalStorage.get('departement')})
    }
}

export default Profile