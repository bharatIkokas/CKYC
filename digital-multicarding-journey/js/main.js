(function () {
    "use strict";

    var confirmAddress = document.getElementById("confirm_address");
    var confirmEditAddress = document.getElementById("confirm_edit_address");
    var verificationAndUpload = document.getElementById("verification_and_upload");

    if (!confirmAddress || !confirmEditAddress || !verificationAndUpload) {
        return;
    }

    confirmAddress.addEventListener("click", function () {
        confirmEditAddress.classList.remove("active");
        verificationAndUpload.classList.add("active");
        confirmEditAddress.classList.add("filled");
    });
})();


// Upload PAN front

function handlePAN(event) {
    var input = event.target;

    if (!input || !input.files || !input.files.length) {
        return;
    }

    var file = input.files[0];
    var fileName = file.name;

    var fileReader = new FileReader();

    fileReader.onload = function () {
        $('#front_title_img_block').addClass('d-none');
        $('#front_img_name').removeClass('d-none');
    };

    fileReader.readAsDataURL(file);

    // Update visible file name
    var fileNameElement = document.getElementById('frontFileName');

    if (fileNameElement) {
        fileNameElement.textContent = fileName;
    }

    // Update upload text
    var uploadText = document.getElementById(
        'upload_text_for_aadhar_front'
    );

    if (uploadText) {
        uploadText.textContent = 'Re-Upload';
    }

    /*
     * Screen reader announcement
     */
    var uploadStatus = document.getElementById('pan_upload_status');

    if (uploadStatus) {
        // Remove old announcement
        uploadStatus.textContent = '';

        setTimeout(function () {
            uploadStatus.textContent =
                'PAN copy uploaded successfully. File name: ' + fileName;

            /*
             * Move focus to the announcement so the screen reader
             * reliably reads the complete message.
             */
            setTimeout(function () {
                uploadStatus.focus();
            }, 50);

        }, 150);
    }

    /*
     * Reset the input after the file name has been captured.
     * This also allows the same file to be selected again.
     */
    input.value = '';
}





//////////////////////////////Verify Your CKYC/KIN Number Checkbox and Button//////////////////////////////////
(function () {
    "use strict";

    var checkbox = document.getElementById("ckyc_kin_constant_1");
    var proceedButton = document.getElementById("ckyc_kin_proceed");
    var errorMessage = document.getElementById("ckyc_kin_error");

    if (!checkbox || !proceedButton || !errorMessage) {
        return;
    }

    var disabledMessage = "Please provide your consent before proceeding.";
    var alertTimer;

    function updateProceedButton() {
        var isChecked = checkbox.checked;

        proceedButton.classList.toggle("gray-btn", !isChecked);
        proceedButton.setAttribute("aria-disabled", String(!isChecked));

        if (isChecked) {
            hideError();
        }
    }

    function hideError() {
        window.clearTimeout(alertTimer);

        errorMessage.classList.remove("show");
        errorMessage.textContent = "";
    }

    function showError() {
        window.clearTimeout(alertTimer);

        errorMessage.textContent = disabledMessage;
        errorMessage.classList.add("show");

        alertTimer = window.setTimeout(function () {
            hideError();
        }, 3000);
    }

    checkbox.addEventListener("change", updateProceedButton);

    proceedButton.addEventListener("click", function (event) {
        if (checkbox.checked) {
            return;
        }

        event.preventDefault();
        showError();
    });

    proceedButton.addEventListener("keydown", function (event) {
        if (checkbox.checked) {
            return;
        }

        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        showError();
    });

    proceedButton.removeAttribute("disabled");
    proceedButton.setAttribute("tabindex", "0");

    updateProceedButton();
}());







///////////////////////////Common Checkbox Check and Uncheck////////////////////////////////
(function () {
    "use strict";

    /*
     * =========================================================
     * Common Consent Button
     * =========================================================
     */
    function initConsentButton(options) {
        var checkbox = document.getElementById(options.checkboxId);
        var proceedButton = document.getElementById(options.buttonId);
        var errorMessage = document.getElementById(options.errorId);
        

        if (!checkbox || !proceedButton || !errorMessage) {
            return;
        }

        var alertTimer = null;
        var disabledMessage =
            options.message || "Please provide your consent before proceeding.";

        function hideError() {
            window.clearTimeout(alertTimer);
            alertTimer = null;

            errorMessage.classList.remove("show");
            errorMessage.textContent = "";
        }

        function showError() {
            window.clearTimeout(alertTimer);

            errorMessage.textContent = disabledMessage;
            errorMessage.classList.add("show");

            errorMessage.focus();

            alertTimer = window.setTimeout(function () {
                hideError();
            }, 3000);
        }

        function updateButton() {
            var isChecked = checkbox.checked;

            proceedButton.classList.toggle("gray-btn", !isChecked);

            proceedButton.setAttribute(
                "aria-disabled",
                String(!isChecked)
            );

            if (isChecked) {
                hideError();
            }
        }

        function handleSuccess() {
            hideError();

            if (typeof options.onSuccess === "function") {
                options.onSuccess();
            }
        }

        checkbox.addEventListener("change", updateButton);

        proceedButton.addEventListener("click", function (event) {

            if (!checkbox.checked) {
                event.preventDefault();
                showError();
                return;
            }

            handleSuccess();
        });

        proceedButton.addEventListener("keydown", function (event) {

            if (checkbox.checked) {
                return;
            }

            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            showError();
        });

        proceedButton.removeAttribute("disabled");
        proceedButton.setAttribute("tabindex", "0");

        updateButton();
    }


    /*
     * =========================================================
     * Common Radio + Consent Button
     * =========================================================
     */
function initRadioConsentButton(options) {
    var radios = options.radioIds.map(function (id) {
        return document.getElementById(id);
    });

    var consentCheckbox = document.getElementById(
        options.checkboxId
    );

    var proceedButton = document.getElementById(
        options.buttonId
    );

    var errorMessage = document.getElementById(
        options.errorId
    );

    if (
        radios.some(function (radio) {
            return !radio;
        }) ||
        !consentCheckbox ||
        !proceedButton ||
        !errorMessage
    ) {
        return;
    }

    var errorTimer = null;

    function hideError() {
        window.clearTimeout(errorTimer);
        errorTimer = null;

        errorMessage.classList.add("sr-only");
        errorMessage.classList.remove("show");
        errorMessage.textContent = "";
        errorMessage.setAttribute("aria-hidden", "true");
    }

    function showError() {
        window.clearTimeout(errorTimer);

        errorMessage.textContent =
            options.message ||
            "Please select an address and provide your consent before proceeding.";

        errorMessage.classList.remove("sr-only");
        errorMessage.classList.add("show");
        errorMessage.removeAttribute("aria-hidden");

        errorMessage.focus();

        errorTimer = window.setTimeout(function () {
            hideError();
        }, 3000);
    }

    function isRadioSelected() {
        return radios.some(function (radio) {
            return radio.checked;
        });
    }

    function updateProceedButton() {
        var addressSelected = isRadioSelected();
        var consentSelected = consentCheckbox.checked;
        var isValid = addressSelected && consentSelected;

        proceedButton.classList.toggle(
            "gray-btn",
            !isValid
        );

        proceedButton.setAttribute(
            "aria-disabled",
            String(!isValid)
        );

        /*
         * Hide error once both conditions are satisfied.
         */
        if (isValid) {
            hideError();
        }
    }

    radios.forEach(function (radio) {
        radio.addEventListener("change", updateProceedButton);
    });

    consentCheckbox.addEventListener(
        "change",
        updateProceedButton
    );

    /*
     * Proceed button click.
     */
    proceedButton.addEventListener("click", function (event) {
        var addressSelected = isRadioSelected();
        var consentSelected = consentCheckbox.checked;

        /*
         * Button is not valid.
         */
        if (!addressSelected || !consentSelected) {
            event.preventDefault();
            showError();
            return;
        }

        hideError();

        if (typeof options.onSuccess === "function") {
            options.onSuccess(
                radios,
                consentCheckbox
            );
        }
    });

    /*
     * Keyboard activation.
     */
    proceedButton.addEventListener("keydown", function (event) {
        var addressSelected = isRadioSelected();
        var consentSelected = consentCheckbox.checked;

        if (addressSelected && consentSelected) {
            return;
        }

        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        showError();
    });

    /*
     * Keep button keyboard accessible.
     */
    proceedButton.removeAttribute("disabled");
    proceedButton.setAttribute("tabindex", "0");

    /*
     * Initial state.
     */
    hideError();
    updateProceedButton();
}



    /*
     * =========================================================
     * CKYC KIN Consent
     * =========================================================
     */
    initConsentButton({
        checkboxId: "ckyc_kin_constant_1",
        buttonId: "ckyc_kin_proceed",
        errorId: "ckyc_kin_error",
        message: "Please provide your consent before proceeding."
    });


    /*
     * =========================================================
     * CKYC Address Consent
     * =========================================================
     */
    initConsentButton({
        checkboxId: "ckyc_address_consent",
        buttonId: "ckyc_address_proceed",
        errorId: "ckyc_address_error",
        message: "Please provide your consent before proceeding."
    });


    /*
     * =========================================================
     * DigiLocker / Aadhaar Consent
     * =========================================================
     */
    initConsentButton({
        checkboxId: "digilocker_auth",
        buttonId: "kyc_kin_aadhar_submit",
        errorId: "digilocker-consent-error",
        message: "Please provide your consent before proceeding.",

        onSuccess: function () {
            var klockerModal = document.getElementById(
                "ckyc_klocker_modal"
            );

            if (!klockerModal) {
                return;
            }

            klockerModal.hidden = false;

            document.body.classList.add(
                "ckyc-modal-open"
            );
        }
    });


    /*
     * =========================================================
     * Address Selection
     * Radio + Consent
     * =========================================================
     */
    initRadioConsentButton({
    radioIds: [
        "kyc_kin_radio_1",
        "kyc_kin_radio_2",
        "kyc_kin_radio_3"
    ],

    checkboxId: "select_address_checkbox_from_three",

    buttonId: "kyc_kin_radio_checkbox_proceed",

    errorId: "kyc_kin_radio_checkbox_proceed_error",

    message: "Please select an address and provide your consent before proceeding.",

    onSuccess: function (radios) {
        var radio1 = radios[0];
        var radio2 = radios[1];
        var radio3 = radios[2];

        if (radio1.checked || radio2.checked) {
            showOTPAddressVerify();
            return;
        }

        if (radio3.checked) {
            showAddNewAddress();
        }
    }
});


    /*
     * =========================================================
     * Screen Switching Functions
     * =========================================================
     */

    function showOTPAddressVerify() {
        var selectAddressScreen = document.getElementById(
            "ckyc_kin_constant_select_address"
        );

        var otpScreen = document.getElementById(
            "verify_ckyc_kin_address_otp"
        );

        if (!selectAddressScreen || !otpScreen) {
            return;
        }

        selectAddressScreen.classList.add("d-none");
        otpScreen.classList.remove("d-none");
    }


    

    function showAddNewAddress() {
    var selectAddressScreen = document.getElementById(
        "ckyc_kin_constant_select_address"
    );

    var otpScreen = document.getElementById(
        "verify_ckyc_kin_address_otp"
    );

    var otpScreenHide = document.getElementById(
        "verify_ckykin_otp"
    );

    var verifyUpload = document.getElementById(
        "verify_ckykin_upload"
    );

    var stepper3 = document.querySelector(
        ".kyc-kin-stepper-3"
    );

    var stepper4 = document.querySelector(
        ".kyc-kin-stepper-4"
    );

    var steppersWrapper = document.getElementById(
        "key_kin_steppers"
    );

    if (
        !selectAddressScreen ||
        !otpScreen ||
        !otpScreenHide ||
        !verifyUpload ||
        !stepper3 ||
        !stepper4 ||
        !steppersWrapper
    ) {
        return;
    }

    /*
     * Hide address selection screen.
     */
    selectAddressScreen.classList.add("d-none");

    /*
     * Hide OTP screen.
     */
    otpScreenHide.classList.add("d-none");

    /*
     * Show address OTP screen.
     */
    otpScreen.classList.remove("d-none");

    /*
     * Show upload screen.
     */
    verifyUpload.classList.remove("d-none");

    /*
     * Step 3 completed.
     */
    stepper3.classList.remove("active");
    stepper3.classList.add("filled");

    /*
     * Step 4 becomes active.
     */
    stepper4.classList.remove("d-none");
    stepper4.classList.add("active");

    /*
     * Change parent stepper class from step 3 to step 4.
     */
    steppersWrapper.classList.remove("kyc-kin-3-steps");
    steppersWrapper.classList.add("kyc-kin-4-steps");
} 

}());









//////////////////////////////Screen Switching///////////////////////////////
(function () {
    "use strict";

    function switchScreen(hideScreenId, showScreenId) {
        var hideScreen = document.getElementById(hideScreenId);
        var showScreen = document.getElementById(showScreenId);

        if (!hideScreen || !showScreen) {
            return;
        }

        hideScreen.classList.add("d-none");
        showScreen.classList.remove("d-none");
    }

    document.addEventListener("click", function (event) {
        var trigger = event.target.closest("[data-switch-screen]");

        if (!trigger) {
            return;
        }

        // Do not switch screen when the button is aria-disabled
        if (trigger.getAttribute("aria-disabled") === "true") {
            event.preventDefault();
            return;
        }

        var hideScreenId = trigger.getAttribute("data-hide-screen");
        var showScreenId = trigger.getAttribute("data-show-screen");

        if (!hideScreenId || !showScreenId) {
            return;
        }

        switchScreen(hideScreenId, showScreenId);
    });

}());









////////////////////////////////////OTP////////////////////////////////
(function () {
    "use strict";

    var otpBlocks = Array.prototype.slice.call(
        document.querySelectorAll(".verify-ckyc-kin-otp-block")
    );

    if (!otpBlocks.length) {
        return;
    }

    otpBlocks.forEach(function (otpBlock) {
        var otpInputs = Array.prototype.slice.call(
            otpBlock.querySelectorAll(".otp-input")
        );

        var successIcon = otpBlock.querySelector(".otp-success-icon");
        var otpStatus = otpBlock.querySelector(".otp-status");
        var submitButton = otpBlock.querySelector(
            'button[id$="_otp_submit"]'
        );
        var otpError = otpBlock.querySelector(
            ".ckyc-kin-alert-message"
        );
        var resendLink = otpBlock.querySelector(".otp-resend-link");
        var resendStatus = otpBlock.querySelector(
            ".otp-resend-link + .sr-only"
        );

        if (
            !otpInputs.length ||
            !successIcon ||
            !otpStatus ||
            !submitButton ||
            !otpError ||
            !resendLink ||
            !resendStatus
        ) {
            return;
        }

        var resendTimer = null;
        var errorTimer = null;
        var resendSeconds = 30;

        function getOtpValue() {
            return otpInputs
                .map(function (input) {
                    return input.value;
                })
                .join("");
        }

        function isOtpComplete() {
            return otpInputs.every(function (input) {
                return input.value !== "";
            });
        }

        function updateSubmitState() {
            var complete = isOtpComplete();

            if (complete) {
                submitButton.classList.remove("gray-btn");
                submitButton.setAttribute("aria-disabled", "false");
            } else {
                submitButton.classList.add("gray-btn");
                submitButton.setAttribute("aria-disabled", "true");
            }
        }

        function updateOtpStatus() {
            var otpValue = getOtpValue();

            if (isOtpComplete()) {
                successIcon.hidden = false;
                otpStatus.textContent = "OTP entered successfully.";
            } else {
                successIcon.hidden = true;

                if (otpValue.length > 0) {
                    otpStatus.textContent =
                        otpValue.length +
                        " of " +
                        otpInputs.length +
                        " OTP digits entered.";
                } else {
                    otpStatus.textContent = "";
                }
            }

            updateSubmitState();
        }

        function focusInput(index) {
            if (!otpInputs[index]) {
                return;
            }

            otpInputs[index].focus();
            otpInputs[index].select();
        }

        function setOtpValue(value) {
            var digits = String(value).replace(/\D/g, "");

            otpInputs.forEach(function (input, index) {
                input.value = digits.charAt(index) || "";
            });

            updateOtpStatus();

            if (digits.length >= otpInputs.length) {
                otpInputs[otpInputs.length - 1].focus();
            } else {
                focusInput(digits.length);
            }
        }

        function showOtpError(message) {
            clearTimeout(errorTimer);

            otpError.textContent = message;
            otpError.classList.add("show");

            errorTimer = setTimeout(function () {
                otpError.textContent = "";
                otpError.classList.remove("show");
            }, 3000);
        }

        function handleOtpInput(input, index) {
            var value = input.value.replace(/\D/g, "");

            input.value = value.charAt(value.length - 1) || "";

            if (
                input.value &&
                index < otpInputs.length - 1
            ) {
                focusInput(index + 1);
            }

            updateOtpStatus();
        }

        otpInputs.forEach(function (input, index) {
            input.addEventListener("input", function () {
                handleOtpInput(input, index);
            });

            input.addEventListener("keydown", function (event) {
                if (event.key === "Backspace") {
                    if (!input.value && index > 0) {
                        otpInputs[index - 1].value = "";
                        focusInput(index - 1);
                    }

                    updateOtpStatus();
                    return;
                }

                if (
                    event.key === "ArrowLeft" &&
                    index > 0
                ) {
                    event.preventDefault();
                    focusInput(index - 1);
                    return;
                }

                if (
                    event.key === "ArrowRight" &&
                    index < otpInputs.length - 1
                ) {
                    event.preventDefault();
                    focusInput(index + 1);
                    return;
                }

                if (event.key === "Home") {
                    event.preventDefault();
                    focusInput(0);
                    return;
                }

                if (event.key === "End") {
                    event.preventDefault();
                    focusInput(otpInputs.length - 1);
                    return;
                }

                if (
                    event.key.length === 1 &&
                    !/[0-9]/.test(event.key)
                ) {
                    event.preventDefault();
                }
            });

            input.addEventListener("paste", function (event) {
                event.preventDefault();

                var pastedText = "";

                if (
                    event.clipboardData &&
                    typeof event.clipboardData.getData === "function"
                ) {
                    pastedText =
                        event.clipboardData.getData("text");
                }

                setOtpValue(pastedText);
            });
        });

        /*
         * Browser / mobile OTP autofill
         */
        otpInputs[0].addEventListener("change", function () {
            var value = otpInputs[0].value.replace(/\D/g, "");

            if (value.length > 1) {
                setOtpValue(value);
                return;
            }

            updateOtpStatus();
        });

        /*
         * Submit button validation
         */
        submitButton.addEventListener("click", function () {
            if (!isOtpComplete()) {
                submitButton.setAttribute(
                    "aria-disabled",
                    "true"
                );

                showOtpError(
                    "Please enter all 6 digits of the OTP before proceeding."
                );

                var firstEmptyIndex = otpInputs.findIndex(
                    function (input) {
                        return input.value === "";
                    }
                );

                if (firstEmptyIndex !== -1) {
                    focusInput(firstEmptyIndex);
                }

                return;
            }

            submitButton.setAttribute(
                "aria-disabled",
                "false"
            );

            /*
             * Your existing data-switch-screen
             * logic can handle successful submission.
             */
        });

        /*
         * Resend OTP
         */
        resendLink.addEventListener("click", function (event) {
            event.preventDefault();

            if (
                resendLink.getAttribute("aria-disabled") ===
                "true"
            ) {
                return;
            }

            startResendTimer();

            /*
             * Add your actual resend OTP API/function here.
             */
        });

        function startResendTimer() {
            clearInterval(resendTimer);

            resendSeconds = 30;

            resendLink.setAttribute(
                "aria-disabled",
                "true"
            );

            resendLink.classList.add("is-disabled");

            resendLink.textContent =
                "Resend OTP in " +
                resendSeconds +
                " seconds";

            resendStatus.textContent =
                "OTP resend timer started. You can request a new OTP in 30 seconds.";

            resendTimer = setInterval(function () {
                resendSeconds--;

                if (resendSeconds > 0) {
                    resendLink.textContent =
                        "Resend OTP in " +
                        resendSeconds +
                        " seconds";

                    if (
                        resendSeconds === 20 ||
                        resendSeconds === 10 ||
                        resendSeconds === 5
                    ) {
                        resendStatus.textContent =
                            "You can resend the OTP in " +
                            resendSeconds +
                            " seconds.";
                    }

                    return;
                }

                clearInterval(resendTimer);

                resendLink.removeAttribute(
                    "aria-disabled"
                );

                resendLink.classList.remove(
                    "is-disabled"
                );

                resendLink.textContent = "Resend OTP";

                resendStatus.textContent =
                    "You can now resend the OTP.";
            }, 1000);
        }

        /*
         * Initial state
         */
        updateOtpStatus();
    });
})();




///////////////////////////////////////Address Selection Screen/////////////////////////////////////////////////////
(function () {
    "use strict";

    var successScreen = document.getElementById(
        "address_suceesfully_retrieved_screen"
    );

    var selectAddressScreen = document.getElementById(
        "ckyc_kin_constant_select_address"
    );

    var stepper2 = document.querySelector(
        ".kyc-kin-stepper-2"
    );

    var stepper3 = document.querySelector(
        ".kyc-kin-stepper-3"
    );

    if (
        !successScreen ||
        !selectAddressScreen ||
        !stepper2 ||
        !stepper3
    ) {
        return;
    }

    var timerStarted = false;

    var observer = new MutationObserver(function () {
        var successScreenVisible =
            !successScreen.classList.contains("d-none");

        if (!successScreenVisible || timerStarted) {
            return;
        }

        timerStarted = true;

        window.setTimeout(function () {

            /*
             * Hide success screen.
             */
            successScreen.classList.add("d-none");

            /*
             * Show address selection screen.
             */
            selectAddressScreen.classList.remove("d-none");

            /*
             * Step 2 completed.
             */
            stepper2.classList.remove("active");
            stepper2.classList.add("filled");

            /*
             * Step 3 active.
             */
            stepper3.classList.add("active");

            /*
             * No longer need the observer.
             */
            observer.disconnect();

        }, 3000);
    });

    observer.observe(successScreen, {
        attributes: true,
        attributeFilter: ["class"]
    });

}());



////////////////////////////Failed to fetch CKYC Details////////////////////////////////////////////
(function () {
    "use strict";

    var failedCkycScreen = document.getElementById("failed_to_fetch_ckyc");

    var doNotSelectAddressScreen = document.getElementById(
        "ckyc_kin_constant_donot_select_address"
    );

    var stepper2 = document.querySelector(
        ".kyc-kin-stepper-2"
    );

    var stepper3 = document.querySelector(
        ".kyc-kin-stepper-3"
    );

    var stepper3Title = document.querySelector(
        ".kyc-kin-stepper-3 .stpper-title"
    );

    if (
        !failedCkycScreen ||
        !doNotSelectAddressScreen ||
        !stepper2 ||
        !stepper3 ||
        !stepper3Title
    ) {
        return;
    }

    var timerStarted = false;

    var observer = new MutationObserver(function () {
        var failedScreenVisible =
            !failedCkycScreen.classList.contains("d-none");

        if (!failedScreenVisible || timerStarted) {
            return;
        }

        timerStarted = true;

        window.setTimeout(function () {

            /*
             * Hide failed CKYC screen.
             */
            failedCkycScreen.classList.add("d-none");

            /*
             * Show photo upload / KYC screen.
             */
            doNotSelectAddressScreen.classList.remove("d-none");

            /*
             * Step 2 completed.
             */
            stepper2.classList.remove("active");
            stepper2.classList.add("filled");

            /*
             * Step 3 active.
             */
            stepper3.classList.add("active");

            /*
             * Change Step 3 title.
             * Address / Upload → Photo / Upload
             */
            stepper3Title.innerHTML = "Photo/<br>Upload";

            /*
             * No longer need the observer.
             */
            observer.disconnect();

        }, 3000);
    });

    observer.observe(failedCkycScreen, {
        attributes: true,
        attributeFilter: ["class"]
    });

}());













////////////////////////////////////Upload Photo/////////////////////////////////////
(function () {
    "use strict";

    var modal = document.getElementById("upload_modal");
    var openButton = document.getElementById("openModalBtn");
    var closeButton = document.getElementById("closeUploadModal");

    var fileInput = document.getElementById("fileInput");
    var previewImg = document.getElementById("previewImg");
    var photo = document.getElementById("photo");

    var deleteButton = document.getElementById("delte_file");
    var proceedButton = document.getElementById("kyc_kin_upload_photo_card");

    var switchFrontButton = document.getElementById("switchFrontBtn");
    var cameraSection = document.getElementById("cameraSection");
    var video = document.getElementById("cam");
    var snapButton = document.getElementById("snapBtn");
    var canvas = document.getElementById("canvas");

    var modalStatus = document.getElementById("modal-status");
    var modalError = document.getElementById("modal-error");

    var uploadStatus = document.getElementById("photo-upload-status");
    var uploadError = document.getElementById("photo-upload-error");

    var lastFocusedElement = null;
    var cameraStream = null;
    var uploadErrorTimer = null;

    var MAX_FILE_SIZE = 5 * 1024 * 1024;

    var allowedTypes = [
        "image/png",
        "image/jpeg"
    ];


    /*
     * ---------------------------------------------------------
     * Utility functions
     * ---------------------------------------------------------
     */

    function announce(element, message) {
        if (!element) {
            return;
        }

        element.textContent = "";

        window.setTimeout(function () {
            element.textContent = message;
        }, 50);
    }


    function clearAnnouncement(element) {
        if (!element) {
            return;
        }

        element.textContent = "";
    }


    function getFocusableElements(container) {
        if (!container) {
            return [];
        }

        return Array.prototype.slice.call(
            container.querySelectorAll(
                'button:not([disabled]), ' +
                '[href], ' +
                'input:not([disabled]):not([type="hidden"]), ' +
                'select:not([disabled]), ' +
                'textarea:not([disabled]), ' +
                '[tabindex]:not([tabindex="-1"])'
            )
        ).filter(function (element) {
            return element.offsetParent !== null ||
                element === document.activeElement;
        });
    }


    /*
     * ---------------------------------------------------------
     * Photo upload error handling
     * ---------------------------------------------------------
     */

    function hideUploadError() {
        window.clearTimeout(uploadErrorTimer);
        uploadErrorTimer = null;

        if (!uploadError) {
            return;
        }

        uploadError.textContent = "";
        uploadError.classList.add("sr-only");
        uploadError.classList.remove("show");
        uploadError.setAttribute("aria-hidden", "true");
    }


    function showUploadError(message) {
        window.clearTimeout(uploadErrorTimer);

        if (!uploadError) {
            return;
        }

        uploadError.textContent = message;
        uploadError.classList.remove("sr-only");
        uploadError.classList.add("show");
        uploadError.removeAttribute("aria-hidden");

        /*
         * Move focus to the error so screen readers
         * announce the validation message.
         */
        uploadError.focus();

        uploadErrorTimer = window.setTimeout(function () {
            hideUploadError();
        }, 3000);
    }


    /*
     * ---------------------------------------------------------
     * Check whether photo/selfie is available
     * ---------------------------------------------------------
     */

    function hasPhoto() {
        var hasSelfie =
            photo &&
            !photo.classList.contains("d-none") &&
            photo.getAttribute("src");

        var hasUploadedPhoto =
            previewImg &&
            !previewImg.classList.contains("d-none") &&
            previewImg.getAttribute("src") &&
            previewImg.getAttribute("src").indexOf("upload-img.png") === -1;

        return Boolean(hasSelfie || hasUploadedPhoto);
    }


    /*
     * ---------------------------------------------------------
     * Modal
     * ---------------------------------------------------------
     */

    function openModal() {
        if (!modal) {
            return;
        }

        lastFocusedElement = document.activeElement;

        modal.hidden = false;
        modal.style.display = "block";

        document.body.classList.add("modal-open");

        clearAnnouncement(modalError);

        /*
         * Move focus into the dialog.
         */
        if (closeButton) {
            closeButton.focus();
        }

        announce(
            modalStatus,
            "Photo upload dialog opened. Choose Upload Photo or Take Selfie."
        );
    }


    function closeModal() {
        if (!modal) {
            return;
        }

        stopCamera();

        modal.hidden = true;
        modal.style.display = "none";

        document.body.classList.remove("modal-open");

        if (switchFrontButton) {
            switchFrontButton.setAttribute("aria-expanded", "false");
        }

        if (cameraSection) {
            cameraSection.classList.add("d-none");
            cameraSection.setAttribute("aria-hidden", "true");
        }

        clearAnnouncement(modalStatus);
        clearAnnouncement(modalError);

        /*
         * Return focus to the element that opened the dialog.
         */
        if (
            lastFocusedElement &&
            document.body.contains(lastFocusedElement)
        ) {
            lastFocusedElement.focus();
        } else if (openButton) {
            openButton.focus();
        }
    }


    if (openButton) {
        openButton.addEventListener("click", openModal);
    }


    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }


    /*
     * Close when clicking the modal backdrop.
     */
    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }


    /*
     * ESC closes modal.
     */
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            modal &&
            !modal.hidden
        ) {
            event.preventDefault();
            closeModal();
        }
    });


    /*
     * Focus trap inside modal.
     */
    if (modal) {
        modal.addEventListener("keydown", function (event) {
            if (
                event.key !== "Tab" ||
                modal.hidden
            ) {
                return;
            }

            var focusableElements = getFocusableElements(modal);

            if (!focusableElements.length) {
                event.preventDefault();
                return;
            }

            var firstElement = focusableElements[0];

            var lastElement =
                focusableElements[focusableElements.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
                return;
            }

            if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        });
    }


    /*
     * ---------------------------------------------------------
     * File upload
     * ---------------------------------------------------------
     */

    if (fileInput) {
        fileInput.addEventListener("change", function (event) {
            handleFileUpload(event);
        });
    }


    function handleFileUpload(event) {
        var file =
            event &&
            event.target &&
            event.target.files
                ? event.target.files[0]
                : null;

        if (!file) {
            return;
        }

        hideUploadError();
        clearAnnouncement(modalError);

        /*
         * Validate file type.
         */
        if (allowedTypes.indexOf(file.type) === -1) {
            announce(
                modalError,
                "Invalid file format. Please upload a PNG or JPG image."
            );

            resetFileInput();
            return;
        }


        /*
         * Validate file size.
         */
        if (file.size > MAX_FILE_SIZE) {
            announce(
                modalError,
                "The selected file is larger than 5 megabytes. Please choose a smaller image."
            );

            resetFileInput();
            return;
        }


        var fileReader = new FileReader();


        fileReader.onload = function () {
            if (!previewImg) {
                return;
            }

            previewImg.src = fileReader.result;
            previewImg.alt = "Uploaded photo preview";
            previewImg.classList.remove("d-none");


            /*
             * Hide captured selfie.
             */
            if (photo) {
                photo.classList.add("d-none");
                photo.removeAttribute("src");
            }


            /*
             * Show delete button.
             */
            if (deleteButton) {
                deleteButton.classList.remove("d-none");
            }


            /*
             * Enable Proceed.
             */
            enableProceedButton();


            /*
             * Update button text.
             */
            if (openButton) {
                openButton.textContent = "Update Photo";
            }


            /*
             * Close modal.
             */
            closeModal();


            announce(
                uploadStatus,
                "Photo uploaded successfully."
            );
        };


        fileReader.onerror = function () {
            announce(
                modalError,
                "The photo could not be uploaded. Please try again."
            );
        };


        fileReader.readAsDataURL(file);

        resetFileInput();
    }


    function resetFileInput() {
        if (fileInput) {
            fileInput.value = "";
        }
    }


    /*
     * ---------------------------------------------------------
     * Delete uploaded photo
     * ---------------------------------------------------------
     */

    if (deleteButton) {
        deleteButton.addEventListener(
            "click",
            handleDeleteIconClick
        );
    }


    function handleDeleteIconClick() {
        if (previewImg) {
            previewImg.src = "../img/upload-img.png";
            previewImg.alt = "No photo uploaded";
            previewImg.classList.remove("d-none");
        }

        if (photo) {
            photo.removeAttribute("src");
            photo.classList.add("d-none");
        }

        if (deleteButton) {
            deleteButton.classList.add("d-none");
        }

        if (openButton) {
            openButton.textContent = "Share Photo";
        }

        disableProceedButton();


        announce(
            uploadStatus,
            "Uploaded photo deleted. Please upload a photo or take a selfie."
        );
    }


    /*
     * ---------------------------------------------------------
     * Proceed button
     * ---------------------------------------------------------
     */

    function enableProceedButton() {
        if (!proceedButton) {
            return;
        }

        proceedButton.disabled = false;

        proceedButton.setAttribute(
            "aria-disabled",
            "false"
        );

        proceedButton.classList.remove("inactive-btn");
        proceedButton.classList.remove("gray-btn");

        hideUploadError();
    }


    function disableProceedButton() {
        if (!proceedButton) {
            return;
        }

        /*
         * Keep button keyboard accessible.
         */
        proceedButton.disabled = false;

        proceedButton.setAttribute(
            "aria-disabled",
            "true"
        );

        proceedButton.classList.add("gray-btn");

        hideUploadError();
    }


    /*
     * ---------------------------------------------------------
     * Proceed button validation
     * ---------------------------------------------------------
     */

    if (proceedButton) {

        /*
         * Mouse / touch / normal activation.
         */
        proceedButton.addEventListener("click", function (event) {

            if (hasPhoto()) {
                hideUploadError();
                return;
            }

            /*
             * Prevent screen switching.
             */
            event.preventDefault();

            proceedButton.setAttribute(
                "aria-disabled",
                "true"
            );

            proceedButton.classList.add("gray-btn");

            showUploadError(
                "Please upload a photo or take a selfie before proceeding."
            );
        });


        /*
         * Keyboard activation.
         */
        proceedButton.addEventListener("keydown", function (event) {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }

            if (hasPhoto()) {
                return;
            }

            event.preventDefault();

            showUploadError(
                "Please upload a photo or take a selfie before proceeding."
            );
        });
    }


    /*
     * ---------------------------------------------------------
     * Camera
     * ---------------------------------------------------------
     */

    if (switchFrontButton) {
        switchFrontButton.addEventListener("click", function () {
            startCamera();
        });
    }


    async function startCamera() {
        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {
            announce(
                modalError,
                "Camera access is not supported by your browser. Please upload a photo instead."
            );

            return;
        }


        try {
            cameraStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });


            if (video) {
                video.srcObject = cameraStream;
            }


            if (cameraSection) {
                cameraSection.classList.remove("d-none");
                cameraSection.setAttribute(
                    "aria-hidden",
                    "false"
                );
            }


            if (switchFrontButton) {
                switchFrontButton.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }


            announce(
                modalStatus,
                "Camera started. Position your face in the camera preview and select Take Selfie."
            );


            if (snapButton) {
                snapButton.focus();
            }

        } catch (error) {
            announce(
                modalError,
                "Camera access was denied or unavailable. Please allow camera access or upload a photo instead."
            );
        }
    }


    function stopCamera() {
        if (!cameraStream) {
            return;
        }

        cameraStream.getTracks().forEach(function (track) {
            track.stop();
        });

        cameraStream = null;

        if (video) {
            video.srcObject = null;
        }
    }


    /*
     * ---------------------------------------------------------
     * Take selfie
     * ---------------------------------------------------------
     */

    if (snapButton) {
        snapButton.addEventListener("click", function () {
            takeSelfie();
        });
    }


    function takeSelfie() {
        if (
            !video ||
            !canvas ||
            !video.videoWidth ||
            !video.videoHeight
        ) {
            announce(
                modalError,
                "The camera is not ready. Please wait a moment and try again."
            );

            return;
        }


        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        var context = canvas.getContext("2d");

        if (!context) {
            announce(
                modalError,
                "The selfie could not be captured. Please try again."
            );

            return;
        }


        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        var imageData =
            canvas.toDataURL("image/jpeg", 0.9);


        if (photo) {
            photo.src = imageData;
            photo.alt = "Captured selfie preview";
            photo.classList.remove("d-none");
        }


        if (previewImg) {
            previewImg.classList.add("d-none");
        }


        if (deleteButton) {
            deleteButton.classList.remove("d-none");
        }


        /*
         * Enable Proceed.
         */
        enableProceedButton();


        if (openButton) {
            openButton.textContent = "Update Photo";
        }


        stopCamera();

        closeModal();


        announce(
            uploadStatus,
            "Selfie captured successfully."
        );
    }


    /*
     * ---------------------------------------------------------
     * DigiLocker checkbox
     * ---------------------------------------------------------
     */

    var checkBox =
        document.getElementById("digilocker_auth");

    var stepperButton =
        document.querySelector(".steper-step-3");

    if (checkBox && stepperButton) {
        checkBox.addEventListener("change", function () {

            if (checkBox.checked) {
                stepperButton.classList.remove(
                    "inactive-btn"
                );

                stepperButton.setAttribute(
                    "aria-disabled",
                    "false"
                );

            } else {
                stepperButton.classList.add(
                    "inactive-btn"
                );

                stepperButton.setAttribute(
                    "aria-disabled",
                    "true"
                );
            }
        });
    }


    /*
     * ---------------------------------------------------------
     * Initial Proceed button state
     * ---------------------------------------------------------
     */

    if (proceedButton) {
        proceedButton.disabled = false;

        proceedButton.setAttribute(
            "aria-disabled",
            "true"
        );

        proceedButton.setAttribute(
            "tabindex",
            "0"
        );

        proceedButton.classList.add("gray-btn");
    }

    hideUploadError();

}());

//////////////////////////////////////////////Stepper//////////////////////////////////
(function () {
    "use strict";

    var proceedButton = document.getElementById(
        "ckyc_address_proceed"
    );

    var consentCheckbox = document.getElementById(
        "ckyc_address_consent"
    );

    var firstStepper = document.querySelector(
        ".kyc-kin-stepper-1"
    );

    var secondStepper = document.querySelector(
        ".kyc-kin-stepper-2"
    );

    if (
        !proceedButton ||
        !consentCheckbox ||
        !firstStepper ||
        !secondStepper
    ) {
        return;
    }

    proceedButton.addEventListener("click", function () {
        /*
         * Do not update the stepper if consent
         * has not been provided.
         */
        if (!consentCheckbox.checked) {
            return;
        }

        /*
         * Step 1 completed.
         */
        firstStepper.classList.remove("active");
        firstStepper.classList.add("filled");

        /*
         * Step 2 becomes active.
         */
        secondStepper.classList.add("active");
    });

}());


(function () {
    "use strict";

    var uploadPhotoCardButton = document.getElementById(
        "kyc_kin_upload_photo_card"
    );

    if (!uploadPhotoCardButton) {
        return;
    }

    uploadPhotoCardButton.addEventListener("click", function () {
        /*
         * Do nothing when the button is disabled.
         */
        if (this.getAttribute("aria-disabled") !== "false") {
            return;
        }

        /*
         * Get the main stepper wrapper.
         */
        var steppersWrapper = document.getElementById(
            "key_kin_steppers"
        );

        /*
         * Get step 4 and step 5.
         */
        var stepper4 = document.querySelector(
            ".kyc-kin-stepper-4"
        );

        var stepper5 = document.querySelector(
            ".kyc-kin-stepper-5"
        );

        if (!steppersWrapper || !stepper4 || !stepper5) {
            return;
        }

        /*
         * Change 3-step layout to 5-step layout.
         */
        steppersWrapper.classList.remove("kyc-kin-4-steps");
        steppersWrapper.classList.add("kyc-kin-5-steps");

        /*
         * Step 4 is completed.
         */
        stepper4.classList.remove("active");
        stepper4.classList.add("filled");

        /*
         * Show step 5.
         */
        stepper5.classList.remove("d-none");

        /*
         * Make step 5 active.
         */
        stepper5.classList.add("active");
    });
})();

//////////////////////////Step Anouncement///////////////////////////
(function () {
    "use strict";

    var steppersWrapper = document.getElementById("key_kin_steppers");

    if (!steppersWrapper) {
        return;
    }

    /*
     * Create screen-reader announcement element.
     */
    var stepperAnnouncement = document.getElementById(
        "kyc-kin-stepper-announcement"
    );

    if (!stepperAnnouncement) {
        stepperAnnouncement = document.createElement("div");
        stepperAnnouncement.id = "kyc-kin-stepper-announcement";
        stepperAnnouncement.className = "sr-only";
        stepperAnnouncement.setAttribute("role", "status");
        stepperAnnouncement.setAttribute("aria-live", "polite");
        stepperAnnouncement.setAttribute("aria-atomic", "true");

        steppersWrapper.parentNode.insertBefore(
            stepperAnnouncement,
            steppersWrapper
        );
    }

    /*
     * Announce the currently active step.
     */
    function announceActiveStepper() {
        var activeStep = steppersWrapper.querySelector(
            ".kyc-kin-stepper.active"
        );

        if (!activeStep) {
            return;
        }

        var stepNumberElement = activeStep.querySelector(
            ".stpper-number-block"
        );

        var stepTitleElement = activeStep.querySelector(
            ".stpper-title"
        );

        if (!stepNumberElement || !stepTitleElement) {
            return;
        }

        var stepNumber = stepNumberElement.textContent.trim();
        var stepTitle = stepTitleElement.textContent
            .replace(/\s+/g, " ")
            .trim();

        /*
         * Clear first so screen readers announce the
         * message even when the same step becomes active again.
         */
        stepperAnnouncement.textContent = "";

        window.setTimeout(function () {
            stepperAnnouncement.textContent =
                "Step " + stepNumber + " active. " + stepTitle;
        }, 100);
    }

    /*
     * Watch for active class changes on the stepper.
     */
    var stepperObserver = new MutationObserver(function (mutations) {
        var activeClassChanged = mutations.some(function (mutation) {
            return (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
            );
        });

        if (activeClassChanged) {
            announceActiveStepper();
        }
    });

    stepperObserver.observe(steppersWrapper, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
    });

    /*
     * Announce the initial active step.
     */
    announceActiveStepper();
})();


//////////////////////////////Add class on parent tag when address radio is selected////////////////////////////////////
(function () {
    "use strict";

    var addressRadios = document.querySelectorAll(
        'input[name="kyc-kin-select-radio"]'
    );

    if (!addressRadios.length) {
        return;
    }

    addressRadios.forEach(function (radio) {
        radio.addEventListener("change", function () {
            // Remove class from all address blocks
            document
                .querySelectorAll(".select-address-radio-block")
                .forEach(function (block) {
                    block.classList.remove("kyckin-radio-selected");
                });

            // Add class only to the selected radio's parent block
            var selectedBlock = radio.closest(".select-address-radio-block");

            if (selectedBlock) {
                selectedBlock.classList.add("kyckin-radio-selected");
            }
        });
    });
})();

















