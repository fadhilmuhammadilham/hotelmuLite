import { Toast } from '@capacitor/toast';
import { Device } from '@capacitor/device';
import $ from 'jquery'

export default class MyToast {
  static async show(message) {

    let devices = await Device.getInfo()

    if (devices.platform == 'web') {
      if ($('#my-toast-elmn').length == 0) $('body', document).append(`
        <style>
          .toast-wrapper {
            display: none;
            padding: 0 1em;
            position: absolute;
            width: 100%;
            top: 50%;
            z-index: 9999;
          }
          .toast-wrapper.show{
            display:block;
          }
          .toast-box {
            display:block;
            position: relative;
            padding: 10px 15px;
            min-height: unset;
            border-radius: 1.2em
          }
          .toast-box .in {
            width:100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 0;
            text-align:center
          }
        </style>
        <div class="toast-wrapper">
          <div id="my-toast-elmn" class="toast-box text-center">
              <div class="in">
                  <div class="text text-center">
                      ${message}
                  </div>
              </div>
          </div>
        </div>
      `)
      else $('#my-toast-elmn .text').text(message)

      $(".toast-wrapper").removeClass("show")
      $('.toast-wrapper').addClass("show")

      await new Promise(resolve => setTimeout(() => resolve(true), 2000))

      $(".toast-wrapper").removeClass("show");
    }
    else await Toast.show({ text: message })

  }
}