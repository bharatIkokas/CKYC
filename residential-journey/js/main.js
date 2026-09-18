///////////////////Active Proceed Button When Primary Radio Button is Selected///////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    const radio = document.getElementById("ckyc_primary");
    const proceedBtn = document.getElementById("ckyc_primary_proceed_btn");

    if (!radio || !proceedBtn) return;

    radio.addEventListener("change", function () {
        if (radio.checked) {
            proceedBtn.classList.remove("p-none");
            proceedBtn.classList.remove("gray-btn");
        }
    });
});

///////////////////////////Differently Abled////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const checkboxDifferentlyAbled = document.getElementById("differently_abled");
  const impairmentBlock = document.querySelector(".impairement-block");

  // Safeguard: Exit if required elements are not found
  if (!checkboxDifferentlyAbled || !impairmentBlock) {
    return;
  }

  // Set initial state (important if checkboxDifferentlyAbled is pre-checked)
  impairmentBlock.classList.toggle("hidden", !checkboxDifferentlyAbled.checked);

  // Toggle on change
  checkboxDifferentlyAbled.addEventListener("change", function () {
    impairmentBlock.classList.toggle("hidden", !this.checked);
  });
});


//////////////////////////////////Popup///////////////////////////////////////////////
// $(document).ready(function () {

//     // Open CKYC Small Popup
//     $('#ckyc_proceed').on('click', function (e) {
//         e.preventDefault();

//         $('#ckyc_small_popup').addClass('open');
//         toggleBodyScroll();
//     });



//     // Proceed from Small Popup -> Open OTP Popup
//     $('#kinPan_popup_proceed_btn').on('click', function (e) {
//         e.preventDefault();

//         // Don't proceed if button is disabled
//         if ($(this).hasClass('p-none')) {
//             return;
//         }

//         $('#ckyc_small_popup').removeClass('open');
//         $('#ckyc_otp_popup').addClass('open');

//         toggleBodyScroll();
//     });

//     // Close popup
//     $('.ckyc-kinpan-consent-checkbox-popup .close-popup').on('click', function (e) {
//         e.preventDefault();

//         $(this).closest('.modal-overlay').removeClass('open');
//         toggleBodyScroll();
//     });

//     // Close popup when clicking outside
//     $('.ckyc-kinpan-consent-checkbox-popup').on('click', function (e) {
//         if ($(e.target).is('.modal-overlay, .overlay')) {
//             $(this).removeClass('open');
//             toggleBodyScroll();
//         }
//     });

//     // Lock / unlock body scroll
//     function toggleBodyScroll() {
//         if ($('#ckyc_small_popup, #ckyc_otp_popup').hasClass('open')) {
//             $('body').addClass('ckyc-popup-open');
//         } else {
//             $('body').removeClass('ckyc-popup-open');
//         }
//     }

// });




(function ($) {
    'use strict';

    var activePopup = null;
    var lastFocusedElement = null;
    var isPopupTransition = false;

    var focusableSelector = [
        'a[href]',
        'area[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[contenteditable="true"]',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');


    /*
     * Get visible and enabled focusable elements
     */
    function getFocusableElements($popup) {

        if (!$popup || !$popup.length) {
            return $();
        }

        return $popup
            .find(focusableSelector)
            .filter(':visible')
            .filter(function () {

                var $element = $(this);

                return !$element.is(':disabled') &&
                    $element.attr('aria-hidden') !== 'true';
            });
    }


    /*
     * Get popup title
     */
    function getPopupTitle($popup) {

        var labelledBy = $popup.attr('aria-labelledby');

        if (!labelledBy) {
            return '';
        }

        var title = '';

        $.each(labelledBy.split(/\s+/), function (index, id) {

            var $label = $('#' + id);

            if ($label.length) {
                title += ' ' + $.trim($label.text());
            }
        });

        return $.trim(title);
    }


    /*
     * Announce popup to screen reader
     */
    function announcePopup($popup) {

        var title = getPopupTitle($popup);

        if (!title) {
            return;
        }

        var $liveRegion = $('#popup-live-region');

        if (!$liveRegion.length) {

            $liveRegion = $('<div>', {
                id: 'popup-live-region',
                role: 'status',
                'aria-live': 'assertive',
                'aria-atomic': 'true'
            }).css({
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: '0'
            });

            $('body').append($liveRegion);
        }

        $liveRegion.text('');

        setTimeout(function () {
            $liveRegion.text(title);
        }, 100);
    }


    /*
     * Move focus inside popup
     */
    function focusFirstElement($popup) {

        if (!$popup || !$popup.length) {
            return;
        }

        var $focusable = getFocusableElements($popup);

        if ($focusable.length) {

            $focusable.first().trigger('focus');

            return;
        }

        var $popupInner = $popup.find('.popup-inner').first();

        if ($popupInner.length) {
            $popupInner.trigger('focus');
        }
    }


    /*
     * Open popup
     */
    function openPopup(target, triggerElement) {

        var $popup = $(target);

        if (!$popup.length) {
            return;
        }


        /*
         * Store original trigger only when
         * opening the first popup.
         */
        if (!activePopup && triggerElement) {
            lastFocusedElement = triggerElement;
        }


        /*
         * Check whether this is a popup-to-popup transition.
         */
        isPopupTransition = !!activePopup;


        /*
         * Close all other open popups.
         */
        $('.modal-overlay[role="dialog"].open')
            .not($popup)
            .removeClass('open')
            .attr('aria-hidden', 'true');


        /*
         * Set new active popup.
         */
        activePopup = $popup;


        /*
         * Open new popup.
         */
        $popup
            .addClass('open')
            .attr('aria-hidden', 'false');


        /*
         * Keep body scroll locked.
         */
        $('body').addClass('ckyc-popup-open');


        /*
         * Announce popup.
         */
        announcePopup($popup);


        /*
         * Move focus into the new popup.
         */
        setTimeout(function () {

            if (
                activePopup &&
                activePopup.is($popup) &&
                $popup.hasClass('open')
            ) {
                focusFirstElement($popup);
            }

        }, 100);


        isPopupTransition = false;
    }


    /*
     * Close popup
     */
    function closePopup($popup) {

        if (!$popup || !$popup.length) {
            return;
        }


        $popup
            .removeClass('open')
            .attr('aria-hidden', 'true');


        /*
         * Clear active popup only if
         * this is the active popup.
         */
        if (activePopup && activePopup.is($popup)) {
            activePopup = null;
        }


        /*
         * Unlock body only when
         * no popup remains open.
         */
        if (!$('.modal-overlay[role="dialog"].open').length) {

            $('body').removeClass('ckyc-popup-open');


            /*
             * Restore focus to the element
             * that originally opened the popup.
             */
            if (
                lastFocusedElement &&
                document.contains(lastFocusedElement)
            ) {

                setTimeout(function () {
                    $(lastFocusedElement).trigger('focus');
                }, 0);
            }

            lastFocusedElement = null;
        }
    }


    /*
     * OPEN POPUP
     *
     * Example:
     *
     * data-popup-target="#ckyc_small_popup"
     */
    $(document).on('click', '[data-popup-target]', function (e) {

        e.preventDefault();

        var target = $(this).attr('data-popup-target');

        if (!target) {
            return;
        }

        /*
         * Do not close the current popup manually.
         *
         * openPopup() handles popup-to-popup
         * transition.
         */
        openPopup(target, this);
    });


    /*
     * CLOSE POPUP
     */
    $(document).on(
        'click',
        '.modal-overlay[role="dialog"] .close-popup',
        function (e) {

            e.preventDefault();

            var $popup = $(this)
                .closest('.modal-overlay[role="dialog"]');

            closePopup($popup);
        }
    );


    /*
     * CLOSE ON OVERLAY CLICK
     */
    $(document).on(
        'click',
        '.modal-overlay[role="dialog"]',
        function (e) {

            if (
                $(e.target).is('.modal-overlay') ||
                $(e.target).is('.overlay')
            ) {

                closePopup($(this));
            }
        }
    );


    /*
     * KEYBOARD HANDLING
     */
    $(document).on('keydown', function (e) {

        if (
            !activePopup ||
            !activePopup.hasClass('open')
        ) {
            return;
        }


        /*
         * ESC
         */
        if (
            e.key === 'Escape' ||
            e.key === 'Esc'
        ) {

            e.preventDefault();

            closePopup(activePopup);

            return;
        }


        /*
         * Focus trap
         */
        if (e.key !== 'Tab') {
            return;
        }


        var $focusable = getFocusableElements(activePopup);


        /*
         * If popup has no focusable element,
         * keep focus on popup-inner.
         */
        if (!$focusable.length) {

            e.preventDefault();

            focusFirstElement(activePopup);

            return;
        }


        var firstElement = $focusable[0];
        var lastElement = $focusable[$focusable.length - 1];


        /*
         * SHIFT + TAB
         */
        if (e.shiftKey) {

            if (
                document.activeElement === firstElement ||
                !activePopup.has(document.activeElement).length
            ) {

                e.preventDefault();

                $(lastElement).trigger('focus');
            }

            return;
        }


        /*
         * TAB
         */
        if (
            document.activeElement === lastElement ||
            !activePopup.has(document.activeElement).length
        ) {

            e.preventDefault();

            $(firstElement).trigger('focus');
        }
    });


    /*
     * Prevent focus from leaving popup.
     */
    $(document).on('focusin', function (e) {

        if (
            !activePopup ||
            !activePopup.hasClass('open')
        ) {
            return;
        }


        if (
            activePopup.is(e.target) ||
            activePopup.has(e.target).length
        ) {
            return;
        }


        /*
         * If focus somehow moves outside,
         * immediately move it back inside.
         */
        focusFirstElement(activePopup);
    });


})(jQuery);

$('#ckyc_otp_input').on('input', function () {
    var otp = $(this).val().replace(/\D/g, '');

    // Keep only digits
    $(this).val(otp);

    if (otp.length === 6) {
        $('#ckycProceedFormSubmission_KYCRenewal')
            .removeClass('gray-btn disable-input-fileds');
    } else {
        $('#ckycProceedFormSubmission_KYCRenewal')
            .addClass('gray-btn disable-input-fileds');
    }
});

//     // Enable/Disable Proceed button based on checkbox
    $('#kin_check_box_1').on('change', function () {
        if ($(this).is(':checked')) {
            $('#kinPan_popup_proceed_btn').removeClass('gray-btn p-none');
        } else {
            $('#kinPan_popup_proceed_btn').addClass('gray-btn p-none');
        }
    });



