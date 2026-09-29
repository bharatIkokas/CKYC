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
  const differentlyAbledBlocks =
    document.querySelectorAll(".differently-abled");

  if (!differentlyAbledBlocks.length) {
    return;
  }

  differentlyAbledBlocks.forEach(function (block) {
    const checkbox = block.querySelector(".differently-abled-checkbox");

    // Find the impairment block associated with this checkbox
    const impairmentBlock = block.nextElementSibling;

    if (
      !checkbox ||
      !impairmentBlock ||
      !impairmentBlock.classList.contains("impairement-block")
    ) {
      return;
    }

    // Set initial state
    impairmentBlock.classList.toggle("hidden", !checkbox.checked);

    // Toggle on change
    checkbox.addEventListener("change", function () {
      impairmentBlock.classList.toggle("hidden", !this.checked);
    });
  });
});

//////////////////////////////////Popup///////////////////////////////////////////////
(function ($) {
    "use strict";

    var activePopup = null;
    var lastFocusedElement = null;

    var focusableSelector = [
        "a[href]",
        "area[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "iframe",
        "object",
        "embed",
        '[contenteditable="true"]',
        '[tabindex]:not([tabindex="-1"])'
    ].join(", ");


    /*
     * Get visible and enabled focusable elements
     */
    function getFocusableElements($popup) {

        if (!$popup || !$popup.length) {
            return $();
        }

        return $popup
            .find(focusableSelector)
            .filter(":visible")
            .filter(function () {

                var $element = $(this);

                return (
                    !$element.is(":disabled") &&
                    $element.attr("aria-hidden") !== "true"
                );

            });
    }


    /*
     * Get popup title
     */
    function getPopupTitle($popup) {

        var labelledBy = $popup.attr("aria-labelledby");

        if (!labelledBy) {
            return "";
        }

        var title = "";

        $.each(labelledBy.split(/\s+/), function (index, id) {

            var $label = $("#" + id);

            if ($label.length) {
                title += " " + $.trim($label.text());
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

        var $liveRegion = $("#popup-live-region");

        if (!$liveRegion.length) {

            $liveRegion = $("<div>", {
                id: "popup-live-region",
                role: "status",
                "aria-live": "assertive",
                "aria-atomic": "true"
            }).css({
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: "0",
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: "0"
            });

            $("body").append($liveRegion);
        }

        $liveRegion.text("");

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

            $focusable.first().trigger("focus");

            return;
        }

        var $popupInner = $popup.find(".popup-inner").first();

        if ($popupInner.length) {
            $popupInner.trigger("focus");
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
         * Store ONLY the original page element
         * that opened the popup.
         *
         * If another popup is already active,
         * do not overwrite the original page trigger.
         */
        if (!activePopup && triggerElement) {
            lastFocusedElement = triggerElement;
        }


        /*
         * Close any other open popup visually.
         *
         * Do not call closePopup() here because
         * that would restore focus to the page
         * during a popup-to-popup transition.
         */
        $('.modal-overlay[role="dialog"].open')
            .not($popup)
            .removeClass("open")
            .attr("aria-hidden", "true");


        /*
         * Set active popup.
         */
        activePopup = $popup;


        /*
         * Open popup.
         */
        $popup
            .addClass("open")
            .attr("aria-hidden", "false");


        /*
         * Lock page scrolling.
         */
        $("body").addClass("ckyc-popup-open");


        /*
         * Announce popup to screen reader.
         */
        announcePopup($popup);


        /*
         * Move focus inside popup.
         */
        setTimeout(function () {

            if (
                activePopup &&
                activePopup.is($popup) &&
                $popup.hasClass("open")
            ) {
                focusFirstElement($popup);
            }

        }, 100);
    }


    /*
     * Close popup
     *
     * Focus is always restored to the
     * original page element that opened
     * the popup.
     */
    function closePopup($popup) {

        if (!$popup || !$popup.length) {
            return;
        }


        /*
         * Save the return-focus element
         * before clearing the variable.
         */
        var returnFocusElement = lastFocusedElement;


        /*
         * Close popup.
         */
        $popup
            .removeClass("open")
            .attr("aria-hidden", "true");


        /*
         * IMPORTANT:
         *
         * Clear activePopup BEFORE restoring focus.
         *
         * This prevents the focusin handler
         * from moving focus back inside the popup.
         */
        if (activePopup && activePopup.is($popup)) {
            activePopup = null;
        }


        /*
         * Unlock page scrolling.
         */
        $("body").removeClass("ckyc-popup-open");


        /*
         * Clear stored focus element.
         */
        lastFocusedElement = null;


        /*
         * Restore focus to the original page element.
         */
        if (
            returnFocusElement &&
            document.contains(returnFocusElement)
        ) {

            setTimeout(function () {

                /*
                 * Make sure the element is still
                 * visible and enabled before focusing.
                 */
                var $returnElement = $(returnFocusElement);

                if (
                    $returnElement.length &&
                    !$returnElement.is(":disabled") &&
                    $returnElement.is(":visible")
                ) {
                    $returnElement.trigger("focus");
                }

            }, 0);
        }
    }


    /*
     * OPEN POPUP
     *
     * Example:
     *
     * data-popup-target="#ckyc_small_popup"
     */
    $(document).on(
        "click",
        "[data-popup-target]",
        function (e) {

            e.preventDefault();

            var target = $(this).attr("data-popup-target");

            if (!target) {
                return;
            }

            /*
             * Pass the page element that opened
             * the popup.
             */
            openPopup(target, this);
        }
    );


    /*
     * CLOSE POPUP
     *
     * This works for:
     *
     * - Mouse click
     * - Enter
     * - Space
     *
     * because native button activation
     * generates a click event.
     */
    $(document).on(
        "click",
        '.modal-overlay[role="dialog"] .close-popup',
        function (e) {

            e.preventDefault();

            var $popup = $(this).closest(
                '.modal-overlay[role="dialog"]'
            );

            closePopup($popup);
        }
    );


    /*
     * CLOSE ON OVERLAY CLICK
     */
    $(document).on(
        "click",
        '.modal-overlay[role="dialog"]',
        function (e) {

            if (
                $(e.target).is(".modal-overlay") ||
                $(e.target).is(".overlay")
            ) {
                closePopup($(this));
            }
        }
    );


    /*
     * KEYBOARD HANDLING
     */
    $(document).on("keydown", function (e) {

        /*
         * Do nothing when no popup is active.
         */
        if (
            !activePopup ||
            !activePopup.hasClass("open")
        ) {
            return;
        }


        /*
         * ESC
         */
        if (
            e.key === "Escape" ||
            e.key === "Esc"
        ) {

            e.preventDefault();

            closePopup(activePopup);

            return;
        }


        /*
         * Focus trap
         */
        if (e.key !== "Tab") {
            return;
        }


        var $focusable = getFocusableElements(activePopup);


        /*
         * If popup has no focusable element,
         * keep focus inside popup-inner.
         */
        if (!$focusable.length) {

            e.preventDefault();

            focusFirstElement(activePopup);

            return;
        }


        var firstElement = $focusable[0];
        var lastElement =
            $focusable[$focusable.length - 1];


        /*
         * SHIFT + TAB
         */
        if (e.shiftKey) {

            if (
                document.activeElement === firstElement ||
                !activePopup.has(document.activeElement).length
            ) {

                e.preventDefault();

                $(lastElement).trigger("focus");
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

            $(firstElement).trigger("focus");
        }
    });


    /*
     * Prevent focus from leaving popup.
     *
     * This only runs while a popup is active.
     */
    $(document).on("focusin", function (e) {

        if (
            !activePopup ||
            !activePopup.hasClass("open")
        ) {
            return;
        }


        /*
         * Focus is already inside popup.
         */
        if (
            activePopup.is(e.target) ||
            activePopup.has(e.target).length
        ) {
            return;
        }


        /*
         * Focus somehow moved outside.
         * Bring it back inside.
         */
        focusFirstElement(activePopup);
    });

})(jQuery);

//////////////////////////OTP Proceed Button Active///////////////////////////////////
$("#ckyc_otp_input").on("input", function () {
  var otp = $(this).val().replace(/\D/g, "");
  var $proceedButton = $("#ckycProceedFormSubmission_KYCRenewal");

  $(this).val(otp);

  if (otp.length === 6) {
    $proceedButton.prop("disabled", false).removeClass("gray-btn");
  } else {
    $proceedButton.prop("disabled", true).addClass("gray-btn");
  }
});

$("#ckycProceedFormSubmission_KYCRenewal").on("click", function () {
  window.location.href = "select-address-screen.html";
});

$("#ckyc_otp_input").on("input", function () {
  var otpSuccess = $(this).val().replace(/\D/g, "");
  var $proceedButtonSuccess = $("#ckycProceedFormSubmission_success_screen");

  $(this).val(otpSuccess);

  if (otpSuccess.length === 6) {
    $proceedButtonSuccess.prop("disabled", false).removeClass("gray-btn");
  } else {
    $proceedButtonSuccess.prop("disabled", true).addClass("gray-btn");
  }
});

$("#ckycProceedFormSubmission_success_screen").on("click", function () {
  window.location.href = "success-screen.html";
});

//////////////////////////Enable/Disable Proceed button based on checkbox///////////////////////////////////
$("#kin_check_box_1").on("change", function () {
  var $proceedButton = $("#kinPan_popup_proceed_btn");

  if ($(this).is(":checked")) {
    $proceedButton.prop("disabled", false).removeClass("gray-btn");
  } else {
    $proceedButton.prop("disabled", true).addClass("gray-btn");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const addressRadios = document.querySelectorAll('input[name="addressType"]');

  const consentCheckbox = document.getElementById("ckyc_address_consent");

  const confirmBtn = document.getElementById("ckyc_address_confirm_btn");

  const modifyBtn = document.getElementById("ckyc_address_modify_btn");

  // Safeguard
  if (!addressRadios.length || !consentCheckbox || !confirmBtn || !modifyBtn) {
    return;
  }

  function updateAddressButtons() {
    // Check if either Permanent or Current address is selected
    const addressSelected = Array.from(addressRadios).some(function (radio) {
      return radio.checked;
    });

    // Check consent
    const consentSelected = consentCheckbox.checked;

    // Both conditions are mandatory
    const canProceed = addressSelected && consentSelected;

    if (canProceed) {
      // Confirm - Primary / Blue
      confirmBtn.disabled = false;
      confirmBtn.setAttribute("aria-disabled", "false");

      confirmBtn.classList.remove("p-none");
      confirmBtn.classList.remove("gray-btn");

      // Modify - Secondary / Gray
      modifyBtn.disabled = false;
      modifyBtn.setAttribute("aria-disabled", "false");

      modifyBtn.classList.remove("p-none");
      modifyBtn.classList.add("ckyc-secondary-btn");
    } else {
      // Confirm - Disabled
      confirmBtn.disabled = true;
      confirmBtn.setAttribute("aria-disabled", "true");

      confirmBtn.classList.add("p-none");
      confirmBtn.classList.add("gray-btn");

      // Modify - Disabled
      modifyBtn.disabled = true;
      modifyBtn.setAttribute("aria-disabled", "true");

      modifyBtn.classList.add("p-none");
      modifyBtn.classList.add("gray-btn");
      modifyBtn.classList.add("ckyc-secondary-btn");
    }
  }

  /*
   * Address selection
   */
  addressRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      updateAddressButtons();
    });
  });

  /*
   * Consent checkbox
   */
  consentCheckbox.addEventListener("change", function () {
    updateAddressButtons();
  });

  /*
   * Set initial state
   */
  updateAddressButtons();
});

/*  KYC METHOD SELECTION + UPLOAD DOCUMENTS + K-LOCKER MODAL */
document.addEventListener("DOMContentLoaded", function () {
  const modifyBtn = document.getElementById("ckyc_address_modify_btn");

  const addressSection = document.querySelector(".ckyc-journey-wrap");

  const kycMethodSection = document.getElementById("ckyc-method-selection");

  const kycMethodSectionError = document.getElementById("ckyc-method-selection-error");

  const proceedBtn = document.getElementById("ckyc_primary_proceed_btn");

  const primaryConsent = document.getElementById("ckyc_primary_consent");

  const uploadDocumentsSection = document.getElementById(
    "ckyc-upload-documents",
  );

  const uploadDocumentsOption = document.querySelector(
    ".ckyc-method-upload-option",
  );

   const uploadDocumentsStepLink = document.querySelector(
    ".ckyc-upload-link",
  );

  const uploadConsent = document.getElementById("ckyc_upload_consent");

  const uploadSubmitBtn = document.getElementById("ckyc_upload_submit_btn");

  const uploadCancelBtn = document.getElementById("ckyc_upload_cancel_btn");

  /* ==============================
     K-LOCKER MODAL
     ============================== */

  const modal = document.getElementById("ckyc-klocker-modal");

  const dialog = modal ? modal.querySelector(".ckyc-klocker-dialog") : null;

  let previousFocusedElement = null;
  

  /* ==============================
     INITIAL SCREEN
     ============================== */

  if (addressSection) {
    addressSection.style.display = "block";
  }

  if (kycMethodSection) {
    kycMethodSection.style.display = "none";
  }

  if (uploadDocumentsSection) {
    uploadDocumentsSection.style.display = "none";
  }
  

  /* ==============================
     UPDATE PROCEED BUTTON
     ============================== */

  function updateKycProceedButton() {
    if (!proceedBtn) {
      return;
    }

    const consentSelected = primaryConsent && primaryConsent.checked;

    const canProceed = Boolean(consentSelected);

    if (canProceed) {
      proceedBtn.disabled = false;

      proceedBtn.setAttribute("aria-disabled", "false");

      proceedBtn.classList.remove("p-none");
      proceedBtn.classList.remove("gray-btn");
    } else {
      proceedBtn.disabled = true;

      proceedBtn.setAttribute("aria-disabled", "true");

      proceedBtn.classList.add("p-none");
      proceedBtn.classList.add("gray-btn");
    }
  }

  /* ==============================
     CONSENT CHANGE
     ============================== */

  if (primaryConsent) {
    primaryConsent.addEventListener("change", function () {
      updateKycProceedButton();
    });
  }

  /* OPEN UPLOAD DOCUMENTS - STEP 3 */

  function openUploadDocuments() {
    if (kycMethodSection) {
      kycMethodSection.style.display = "none";
      
    }

    if (uploadDocumentsSection) {
      uploadDocumentsSection.style.display = "block";
      kycMethodSectionError.style.display= "none";
    }
  }

  /* UPLOAD DOCUMENTS CLICK */
  if (uploadDocumentsStepLink) {
    uploadDocumentsStepLink.addEventListener("click", function (event) {
      event.preventDefault();
      openUploadDocuments();
    });

    uploadDocumentsStepLink.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openUploadDocuments();
      }
    });
  }

  /* ==============================
     OPEN K-LOCKER MODAL
     ============================== */

  function openKlockerModal() {
    if (!modal || !dialog) {
      return;
    }

    previousFocusedElement = document.activeElement;

    modal.hidden = false;

    document.body.classList.add("ckyc-modal-open");

    /*
     * Move focus into dialog.
     */
    requestAnimationFrame(function () {
      dialog.focus();
    });
  }

  /* ==============================
     CLOSE K-LOCKER MODAL
     ============================== */

  function closeKlockerModal() {
    if (!modal) {
      return;
    }

    modal.hidden = true;

    document.body.classList.remove("ckyc-modal-open");

    /*
     * Return focus to Proceed button.
     */
    if (
      previousFocusedElement &&
      typeof previousFocusedElement.focus === "function"
    ) {
      previousFocusedElement.focus();
    }
  }

  /* PROCEED BUTTON */
  if (proceedBtn) {
    proceedBtn.addEventListener("click", function () {
      /*
       * Disabled safety check
       */
      if (proceedBtn.disabled) {
        return;
      }

      /*
       * Proceed always opens K-Locker modal.
       *
       * There is no KYC method radio anymore.
       */
      openKlockerModal();
    });
  }

  /* MODIFY BUTTON */

  if (modifyBtn) {
    modifyBtn.addEventListener("click", function () {
      if (modifyBtn.disabled) {
        return;
      }

      /* Hide Address */
      if (addressSection) {
        addressSection.style.display = "none";
      }

      /* Hide Upload screen */
      if (uploadDocumentsSection) {
        uploadDocumentsSection.style.display = "none";
      }

      /* Show KYC Method screen */
      if (kycMethodSection) {
        kycMethodSection.classList.remove("hide-section");

        kycMethodSection.style.display = "block";
      }

      /* Update Proceed button */
      updateKycProceedButton();
    });
  }

  /* MODAL KEYBOARD HANDLING */

  if (modal && dialog) {
    modal.addEventListener("keydown", function (event) {
      /* ESC closes modal */
      if (event.key === "Escape") {
        event.preventDefault();

        closeKlockerModal();

        return;
      }

      /* TAB focus trap */
      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        modal.querySelectorAll(
          "button:not([disabled]), " +
            "input:not([disabled]), " +
            "select:not([disabled]), " +
            "textarea:not([disabled]), " +
            "a[href], " +
            '[tabindex]:not([tabindex="-1"])',
        ),
      ).filter(function (element) {
        return element.offsetWidth > 0 || element.offsetHeight > 0;
      });

      /* Your current modal only contains an image, so dialog itself receives focus. */
      if (!focusableElements.length) {
        event.preventDefault();

        dialog.focus();

        return;
      }

      const firstElement = focusableElements[0];

      const lastElement = focusableElements[focusableElements.length - 1];

      /* Shift + Tab from first */
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();

        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        /* Tab from last */
        event.preventDefault();

        firstElement.focus();
      }
    });
  }

  /* INITIAL BUTTON STATE */

  updateKycProceedButton();

  /* UPLOAD DOCUMENT BUTTONS */
  function updateUploadButtons() {
    if (!uploadConsent || !uploadSubmitBtn || !uploadCancelBtn) {
      return;
    }

    const consentSelected = uploadConsent.checked;

    if (consentSelected) {
      // Submit - Primary
      uploadSubmitBtn.disabled = false;
      uploadSubmitBtn.setAttribute("aria-disabled", "false");
      uploadSubmitBtn.classList.remove("p-none");
      uploadSubmitBtn.classList.remove("gray-btn");

      // Cancel - Secondary
      uploadCancelBtn.disabled = false;
      uploadCancelBtn.setAttribute("aria-disabled", "false");
      uploadCancelBtn.classList.remove("p-none");
      uploadCancelBtn.classList.remove("gray-btn");
    } else {
      // Submit - Disabled
      uploadSubmitBtn.disabled = true;
      uploadSubmitBtn.setAttribute("aria-disabled", "true");
      uploadSubmitBtn.classList.add("p-none");
      uploadSubmitBtn.classList.add("gray-btn");

      // Cancel - Disabled
      uploadCancelBtn.disabled = true;
      uploadCancelBtn.setAttribute("aria-disabled", "true");
      uploadCancelBtn.classList.add("p-none");
      uploadCancelBtn.classList.add("gray-btn");
    }
  }

  /* UPLOAD CONSENT CHANGE */
  if (uploadConsent) {
    uploadConsent.addEventListener("change", function () {
      updateUploadButtons();
    });
  }

  /* INITIAL UPLOAD BUTTON STATE */
  updateUploadButtons();
});

///////////////////////////////Custom Select///////////////////////////
(function () {
    "use strict";

    var customSelects = document.querySelectorAll(".custom-select");

    if (!customSelects.length) {
        return;
    }

    function closeAllSelect(exception) {
        customSelects.forEach(function (customSelect) {
            if (customSelect === exception) {
                return;
            }

            var combobox = customSelect.querySelector(".select-selected");
            var listbox = customSelect.querySelector(".select-items");

            if (!combobox || !listbox) {
                return;
            }

            listbox.classList.add("select-hide");
            combobox.setAttribute("aria-expanded", "false");
            combobox.removeAttribute("aria-activedescendant");
        });
    }

    customSelects.forEach(function (customSelect) {
        var select = customSelect.querySelector("select");
        var combobox = customSelect.querySelector(".select-selected");
        var listbox = customSelect.querySelector(".select-items");
        var options = customSelect.querySelectorAll('[role="option"]');

        if (!select || !combobox || !listbox || !options.length) {
            return;
        }

        var selectedIndex = select.selectedIndex > 0
            ? select.selectedIndex - 1
            : -1;

        var activeIndex = selectedIndex;

        function setActiveOption(index) {
            if (index < 0 || index >= options.length) {
                return;
            }

            var option = options[index];

            activeIndex = index;

            /*
             * aria-activedescendant is maintained on the
             * combobox for screen-reader context.
             */
            if (option.id) {
                combobox.setAttribute(
                    "aria-activedescendant",
                    option.id
                );
            }

            /*
             * Move actual keyboard focus to the option.
             */
            option.focus();
        }

        function setSelectedOption(index) {
            if (index < 0 || index >= options.length) {
                return;
            }

            options.forEach(function (option) {
                option.setAttribute("aria-selected", "false");
            });

            options[index].setAttribute("aria-selected", "true");

            selectedIndex = index;
        }

        function openSelect() {
            closeAllSelect(customSelect);

            listbox.classList.remove("select-hide");
            combobox.setAttribute("aria-expanded", "true");

            if (selectedIndex >= 0) {
                activeIndex = selectedIndex;
            } else {
                activeIndex = 0;
            }

            /*
             * Move focus to the currently selected option.
             * If nothing is selected, focus the first option.
             */
            setActiveOption(activeIndex);
        }

        function closeSelect(restoreFocus) {
            listbox.classList.add("select-hide");
            combobox.setAttribute("aria-expanded", "false");
            combobox.removeAttribute("aria-activedescendant");

            activeIndex = selectedIndex;

            if (restoreFocus) {
                combobox.focus();
            }
        }

        function selectOption(index) {
            if (index < 0 || index >= options.length) {
                return;
            }

            var option = options[index];
            var value = option.getAttribute("data-value");

            if (!value) {
                return;
            }

            select.value = value;

            combobox.textContent = option.textContent.trim();

            setSelectedOption(index);

            activeIndex = index;

            select.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );

            /*
             * Return focus to combobox after selection.
             */
            closeSelect(true);
        }

        function moveActiveOption(direction) {
            var nextIndex = activeIndex + direction;

            if (activeIndex === -1) {
                nextIndex = direction > 0
                    ? 0
                    : options.length - 1;
            }

            if (nextIndex < 0) {
                nextIndex = options.length - 1;
            }

            if (nextIndex >= options.length) {
                nextIndex = 0;
            }

            setActiveOption(nextIndex);
        }

        function toggleSelect() {
            var isOpen =
                combobox.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeSelect(true);
            } else {
                openSelect();
            }
        }

        combobox.addEventListener("click", function (event) {
            event.stopPropagation();
            toggleSelect();
        });

        combobox.addEventListener("keydown", function (event) {
            var isOpen =
                combobox.getAttribute("aria-expanded") === "true";

            switch (event.key) {
                case "Enter":
                case " ":
                    event.preventDefault();

                    if (!isOpen) {
                        openSelect();
                    } else if (activeIndex >= 0) {
                        selectOption(activeIndex);
                    }

                    break;

                case "ArrowDown":
                    event.preventDefault();

                    if (!isOpen) {
                        openSelect();
                    } else {
                        moveActiveOption(1);
                    }

                    break;

                case "ArrowUp":
                    event.preventDefault();

                    if (!isOpen) {
                        openSelect();
                    } else {
                        moveActiveOption(-1);
                    }

                    break;

                case "Home":
                    if (isOpen) {
                        event.preventDefault();
                        setActiveOption(0);
                    }
                    break;

                case "End":
                    if (isOpen) {
                        event.preventDefault();
                        setActiveOption(options.length - 1);
                    }
                    break;

                case "Escape":
                    if (isOpen) {
                        event.preventDefault();
                        closeSelect(true);
                    }
                    break;

                case "Tab":
                    if (isOpen) {
                        closeSelect(false);
                    }
                    break;

                default:
                    break;
            }
        });

        options.forEach(function (option, index) {
            option.addEventListener("click", function (event) {
                event.stopPropagation();

                selectOption(index);
            });

            option.addEventListener("keydown", function (event) {
                switch (event.key) {
                    case "ArrowDown":
                        event.preventDefault();
                        moveActiveOption(1);
                        break;

                    case "ArrowUp":
                        event.preventDefault();
                        moveActiveOption(-1);
                        break;

                    case "Home":
                        event.preventDefault();
                        setActiveOption(0);
                        break;

                    case "End":
                        event.preventDefault();
                        setActiveOption(options.length - 1);
                        break;

                    case "Enter":
                    case " ":
                        event.preventDefault();
                        selectOption(index);
                        break;

                    case "Escape":
                        event.preventDefault();
                        closeSelect(true);
                        break;

                    case "Tab":
                        closeSelect(false);
                        break;

                    default:
                        break;
                }
            });

            option.addEventListener("mousemove", function () {
                activeIndex = index;

                if (option.id) {
                    combobox.setAttribute(
                        "aria-activedescendant",
                        option.id
                    );
                }
            });
        });
    });

    document.addEventListener("click", function () {
        closeAllSelect(null);
    });
})();


(function () {
    "use strict";

    function announceCkycError() {
        var announcement = document.getElementById("ckyc-error-announcement");
        var errorMessage = document.getElementById("ckyc-error-message");

        if (!announcement || !errorMessage) {
            return;
        }

        var message = errorMessage.textContent.trim();

        if (!message) {
            return;
        }

        // Ensure the live region starts empty.
        announcement.textContent = "";

        // Wait until the page and live region are rendered.
        window.setTimeout(function () {
            announcement.textContent = message;
        }, 500);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            announceCkycError();
        });
    } else {
        announceCkycError();
    }
})();

$(".form-upload").on("change", ".file-upload-field", function () {
            $(this).parent(".file-upload-wrapper").attr("data-text", $(this).val().replace(/.*(\/|\\)/, ''));
        });
