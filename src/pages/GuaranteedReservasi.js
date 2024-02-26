import Page from "./Page"
import homeView from "../templates/guaranteed-reservasi.handlebars"
import "../assets/css/stylekita.css"
import $ from 'jquery'

class GuaranteedReservasi extends Page {
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
          $("#nextBtn").html("Submit");
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
          if (currentTab == $(".tab").length - 1) {
            // Redirect to "/"
            window.location.href = "/";
          } else {
            currentTab++;
            showTab(currentTab);
          }
        }
      });
    });


    $(document).ready(function () {
      $('#pilihrates .modal-body table tbody tr svg').click(function () {
        var pilihrates = $(this).parent().siblings().eq(1).text();
        $('#colFormLabelSm').val(pilihrates);
        $('#pilihrates').modal('hide');
      });
    });

    $(document).ready(function () {
      $('#segmentasi .modal-body table tbody tr td svg').click(function () {
        var pilihsegmentasi = $(this).parent().siblings().eq(1).text();
        $('#colFormLabelSm1').val(pilihsegmentasi);
        $('#segmentasi').modal('hide');
      });
    });

    $(document).ready(function () {
      $('#typepayment .modal-body table tbody tr td svg').click(function () {
        var typepayment = $(this).parent().siblings().eq(1).text();
        $('#colFormLabelSm2').val(typepayment);
        $('#typepayment').modal('hide');
      });
    });

    $(document).ready(function () {
      $('#country .modal-body table tbody tr td svg').click(function () {
        var country = $(this).parent().siblings().eq(1).text();
        $('#colFormLabelSm4').val(country);
        $('#country').modal('hide');
      });
    });

    $(document).ready(function () {
      $('#province .modal-body table tbody tr td svg').click(function () {
        var province = $(this).parent().siblings().eq(1).text();
        $('#colFormLabelSm5').val(province);
        $('#province').modal('hide');
      });
    });

    $(document).ready(function () {
      $('#city .modal-body table tbody tr td svg').click(function () {
        var city = $(this).parent().siblings().eq(1).text();
        $('#colFormLabelSm6').val(city);
        $('#city').modal('hide');
      });
    });
  }

  render() {

    return homeView({})
  }
}

export default GuaranteedReservasi