import Page from "./Page"
import homeView from "../templates/detail-rates.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class DetailRates extends Page {
    constructor(params) {
        super(params)
    }

    action() {
        $(function () {
            const daysTag = $(".days"),
                currentDate = $(".current-date"),
                prevNextIcon = $(".icons span");

            let date = new Date(),
                currYear = date.getFullYear(),
                currMonth = date.getMonth();

            const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

            const renderCalendar = () => {
                let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
                    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
                    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
                    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
                let liTag = "";

                for (let i = firstDayofMonth; i > 0; i--) {
                    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
                }

                for (let i = 1; i <= lastDateofMonth; i++) {
                    let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                        && currYear === new Date().getFullYear() ? "active" : "";
                    liTag += `<li class="${isToday}" data-agenda="${i}">${i}</li>`;
                }

                for (let i = lastDayofMonth; i < 6; i++) {
                    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
                }
                currentDate.text(`${months[currMonth]} ${currYear}`);
                daysTag.html(liTag);
            }
            renderCalendar();

            prevNextIcon.on("click", function () {
                currMonth = this.id === "prev" ? currMonth - 1 : currMonth + 1;

                if (currMonth < 0 || currMonth > 11) {
                    date = new Date(currYear, currMonth, new Date().getDate());
                    currYear = date.getFullYear();
                    currMonth = date.getMonth();
                } else {
                    date = new Date();
                }
                renderCalendar();
            });

            daysTag.on('click', 'li', function () {
                let agenda = $(this).data('agenda');
                daysTag.find('li').removeClass('active');
                $(this).addClass('active');

                $('#standardContent').text(`Data Standar untuk tanggal ${agenda}`);
                $('#deluxeContent').text(`Data Deluxe untuk tanggal ${agenda}`);
            });

            $('#headingStandard').click(function () {
                $('#collapseStandard').collapse('toggle');
            });

            $('#headingDeluxe').click(function () {
                $('#collapseDeluxe').collapse('toggle');
            });
        });
    }

    render() {

        return homeView({})
    }
}

export default DetailRates