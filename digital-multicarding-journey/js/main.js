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

// Upload Addhar front
function handlePAN(event) {
const file = event.target.files[0];
const fileReader = new FileReader();

fileReader.onload = function () {
// const previewImg = document.getElementById('previewImg');
//const frontImgName = document.getElementById('front_img_name');
//previewImg.setAttribute('src', fileReader.result);
$('#front_title_img_block').addClass('d-none');
$('#front_img_name').removeClass('d-none');
//frontImgName = fileName;
};

fileReader.readAsDataURL(file);

const filePath = URL.createObjectURL(file);
const fileName = file.name;

// document.getElementById('filePath').innerText = "File Path: " + filePath;
document.getElementById('frontFileName').innerText = fileName;
document.getElementById('upload_text_for_aadhar_front').innerText = "Re-Upload";

// Reset FileReader object
event.target.value = ''; // Reset file input
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







///////////////////////////Pan Upload Screen Checkbox////////////////////////////////
(function () {
    "use strict";

    function initConsentButton(options) {
        var checkbox = document.getElementById(options.checkboxId);
        var proceedButton = document.getElementById(options.buttonId);
        var errorMessage = document.getElementById(options.errorId);

        if (!checkbox || !proceedButton || !errorMessage) {
            return;
        }

        var alertTimer;
        var disabledMessage = options.message;

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

        checkbox.addEventListener("change", updateButton);

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

        // Keep the button keyboard accessible.
        proceedButton.removeAttribute("disabled");
        proceedButton.setAttribute("tabindex", "0");

        updateButton();
    }


    /*
     * CKYC KIN consent
     */
    initConsentButton({
        checkboxId: "ckyc_kin_constant_1",
        buttonId: "ckyc_kin_proceed",
        errorId: "ckyc_kin_error",
        message: "Please provide your consent before proceeding."
    });


    /*
     * CKYC Address consent
     */
    initConsentButton({
        checkboxId: "ckyc_address_consent",
        buttonId: "ckyc_address_proceed",
        errorId: "ckyc_address_error",
        message: "Please provide your consent before proceeding."
    });

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

    var otpInputs = Array.prototype.slice.call(
        document.querySelectorAll(".otp-input")
    );

    var successIcon = document.getElementById("otp-success-icon");
    var otpStatus = document.getElementById("otp-status");
    var submitButton = document.getElementById("ckyc_kin_otp_submit");
    var otpError = document.getElementById("ckyc_kin_otp_error");
    var resendLink = document.getElementById("otp-resend-link");
    var resendStatus = document.getElementById("otp-resend-status");

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

        if (input.value && index < otpInputs.length - 1) {
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
                pastedText = event.clipboardData.getData("text");
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
     * Proceed button validation
     */
    submitButton.addEventListener("click", function () {

        if (!isOtpComplete()) {
            submitButton.setAttribute("aria-disabled", "true");

            showOtpError(
                "Please enter all 6 digits of the OTP before proceeding."
            );

            /*
             * Move focus to the first empty field so keyboard
             * and screen-reader users know where to continue.
             */
            var firstEmptyIndex = otpInputs.findIndex(function (input) {
                return input.value === "";
            });

            if (firstEmptyIndex !== -1) {
                focusInput(firstEmptyIndex);
            }

            return;
        }

        submitButton.setAttribute("aria-disabled", "false");

        /*
         * Your existing screen-switching logic can handle
         * the successful submit from here.
         */
    });

    /*
     * Keyboard activation on button
     *
     * Native button already supports Enter/Space.
     * This listener makes sure incomplete OTP is announced
     * even when activated from keyboard.
     */
    submitButton.addEventListener("keydown", function (event) {

        if (
            event.key !== "Enter" &&
            event.key !== " "
        ) {
            return;
        }

        if (!isOtpComplete()) {
            event.preventDefault();

            showOtpError(
                "Please enter all 6 digits of the OTP before proceeding."
            );
        }
    });

    /*
     * Resend OTP
     */
    resendLink.addEventListener("click", function (event) {
        event.preventDefault();

        if (resendLink.getAttribute("aria-disabled") === "true") {
            return;
        }

        startResendTimer();

        /*
         * Add your actual resend OTP API/function here.
         *
         * Example:
         * resendOtpFromServer();
         */
    });

    function startResendTimer() {
        clearInterval(resendTimer);

        resendSeconds = 30;

        resendLink.setAttribute("aria-disabled", "true");
        resendLink.classList.add("is-disabled");

        resendLink.textContent =
            "Resend OTP in " + resendSeconds + " seconds";

        resendStatus.textContent =
            "OTP resend timer started. You can request a new OTP in 30 seconds.";

        resendTimer = setInterval(function () {

            resendSeconds--;

            if (resendSeconds > 0) {

                resendLink.textContent =
                    "Resend OTP in " +
                    resendSeconds +
                    " seconds";

                /*
                 * Don't force screen readers to announce
                 * every second. Announce only useful milestones.
                 */
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

            resendLink.removeAttribute("aria-disabled");
            resendLink.classList.remove("is-disabled");
            resendLink.textContent = "Resend OTP";

            resendStatus.textContent =
                "You can now resend the OTP.";
        }, 1000);
    }

    /*
     * Initial state
     */
    updateOtpStatus();

})();
