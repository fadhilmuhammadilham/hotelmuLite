import Page from "./Page"
import homeView from "../templates/check-in.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class Checkin extends Page {
  constructor(params) {
    super(params)
  }

  action() {
    $(document).ready(function () {
      var currentTab = 0;
      showTab(currentTab);
    
      function showTab(n) {
        $(".tab").hide();
        $(".tab:eq(" + n + ")").show();
        if (n == 0) {
          $("#prevBtn").hide();
        } else {
          $("#prevBtn").show();
        }
        if (n == $(".tab").length - 1) {
          $("#nextBtn").html("Finish");
        } else {
          $("#nextBtn").html("Next");
        }
        $(".step").removeClass("active");
        $(".step:eq(" + n + ")").addClass("active");
      }
    
      $("#prevBtn").click(function () {
        if (currentTab > 0) {
          currentTab--;
          showTab(currentTab);
        }
      });
    
      $("#nextBtn").click(function () {
        if ($(this).html() === "Finish") {
          window.location.href = "/";
        } else {
          var x = $(".tab:eq(" + currentTab + ")").find("input");
          var isValid = true;
          x.each(function () {
            if ($(this).val() === "") {
              $(this).addClass("invalid");
              isValid = false;
            } else {
              $(this).removeClass("invalid");
            }
          });
          if (isValid) {
            currentTab++;
            showTab(currentTab);
          }
        }
      });
    });
    $(document).ready(function () {
      $('#arrivalDate').change(function () {
        var arrivalDate = new Date($(this).val());
        $('#departureDate').attr('min', $(this).val());

        var departureDate = new Date(arrivalDate);
        departureDate.setDate(arrivalDate.getDate() + 1);
        if (departureDate < arrivalDate) {
          departureDate.setDate(arrivalDate.getDate() + 1);
        }
        var formattedDepartureDate = departureDate.toISOString().split('T')[0];
        $('#departureDate').val(formattedDepartureDate);
      });
    });
  }

  render() {
    
    return homeView({})
  }
}

export default Checkin