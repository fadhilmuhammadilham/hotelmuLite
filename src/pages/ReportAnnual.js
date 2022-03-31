import Page from "./Page"
import $ from "jquery"
import ReportApi from "../repositories/api/ReportApi"
import annualReport from "../templates/report-annual.handlebars"
import reportItem from "../templates/report-item.handlebars"

class ReportAnnual extends Page {
    constructor(params){
        super(params)
    }

    async getRecentYear(year) {
        try {
            let res = await ReportApi.getRecentYear(year)

            return res.data
        } catch (error) {
            console.log(error);            
        }
    }

    async action() {
        
        // Initiate Date
        let d = new Date()
        let bulan = [
            "Januari", "Februari", "Maret", "April", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ]
        let year = d.getFullYear()
        const recentData = await this.getRecentYear(year)

        $('#tahun').text("Tahun " + ' ' + year)
        
        for(let i = year; i > year - 10; i--) {
            $('select#tahun-selected').append('<option value="'+ i +'">'+i+'</option>')
        }
        
        $('.item-transaksi').html(reportItem({transaction_data: recentData, type: "annual"}))

        $('#select-btn').on('click', async (e) => {
            let year_selected = $('#tahun-selected option:selected').val()

            let res = await this.getRecentYear(year_selected)
            $('.item-transaksi').html(reportItem({transaction_data: res, type: "annual"}))
            $('#tahun').text('Tahun ' + ' ' + year_selected)
        })

        $('#eraser-btn').on('click', (e) => {
            window.location.reload();
        })
    }

    render() {
        return annualReport();
    }
}

export default ReportAnnual