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
    "use strict";

    var checkbox = document.getElementById(options.checkboxId);
    var proceedButton = document.getElementById(options.buttonId);

    if (!checkbox || !proceedButton) {
        return;
    }

    function updateButton() {
    var isChecked = checkbox.checked;

    proceedButton.disabled = !isChecked;

    proceedButton.setAttribute(
        "aria-disabled",
        String(!isChecked)
    );

    proceedButton.classList.toggle(
        "gray-btn",
        !isChecked
    );
}

    checkbox.addEventListener("change", updateButton);

    proceedButton.addEventListener("click", function () {
        if (proceedButton.disabled || !checkbox.checked) {
            return;
        }

        if (typeof options.onSuccess === "function") {
            options.onSuccess();
        }
    });

    // Initialize the correct disabled state.
    updateButton();
}



    /*
     * =========================================================
     * Common Radio + Consent Button
     * =========================================================
     */

function initRadioConsentButton(options) {
    "use strict";

    var radios = options.radioIds.map(function (id) {
        return document.getElementById(id);
    });

    var consentCheckbox = document.getElementById(
        options.checkboxId
    );

    var proceedButton = document.getElementById(
        options.buttonId
    );

    if (
        radios.some(function (radio) {
            return !radio;
        }) ||
        !consentCheckbox ||
        !proceedButton
    ) {
        return;
    }

    function isRadioSelected() {
        return radios.some(function (radio) {
            return radio.checked;
        });
    }

    function updateProceedButton() {
    var isValid =
        isRadioSelected() &&
        consentCheckbox.checked;

    proceedButton.disabled = !isValid;

    proceedButton.setAttribute(
        "aria-disabled",
        String(!isValid)
    );

    proceedButton.classList.toggle(
        "gray-btn",
        !isValid
    );
}

    radios.forEach(function (radio) {
        radio.addEventListener(
            "change",
            updateProceedButton
        );
    });

    consentCheckbox.addEventListener(
        "change",
        updateProceedButton
    );

    proceedButton.addEventListener("click", function () {
        if (
            proceedButton.disabled ||
            !isRadioSelected() ||
            !consentCheckbox.checked
        ) {
            return;
        }

        if (typeof options.onSuccess === "function") {
            options.onSuccess(radios, consentCheckbox);
        }
    });

    // Initialize the correct disabled state.
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

    var RESEND_SECONDS = 30;
    var SENT_REGION_ID = "kyc_kin_otp_sent_announcer";
    var sentRegion = null;
    var sentTimer = null;

    function getSentRegion() {
        if (sentRegion) { return sentRegion; }

        sentRegion = document.getElementById(SENT_REGION_ID);
        if (!sentRegion) {
            sentRegion = document.createElement("div");
            sentRegion.id = SENT_REGION_ID;
            sentRegion.className = "sr-only";
            sentRegion.setAttribute("role", "status");
            sentRegion.setAttribute("aria-live", "polite");
            sentRegion.setAttribute("aria-atomic", "true");
            document.body.appendChild(sentRegion);
        }
        return sentRegion;
    }

    function announceSent(message) {
        var region = getSentRegion();
        window.clearTimeout(sentTimer);
        region.textContent = "";
        // Short delay so the screen reader has finished reacting to the screen change.
        sentTimer = window.setTimeout(function () { region.textContent = message; }, 500);
    }

    Array.prototype.slice
        .call(document.querySelectorAll(".verify-ckyc-kin-otp-block"))
        .forEach(function (block) {
            var inputs = Array.prototype.slice.call(block.querySelectorAll(".otp-input"));
            var successIcon = block.querySelector(".otp-success-icon");
            var status = block.querySelector(".otp-status");
            var submitBtn = block.querySelector('button[id$="_otp_submit"]');
            var errorBox = block.querySelector(".ckyc-kin-alert-message");
            var resendBtn = block.querySelector(".otp-resend-link");
            var resendTimerText = block.querySelector(".otp-resend-timer");
            var resendStatus = block.querySelector(".otp-resend-status");

            // Optional server-side error state (see otp-block-error.html)
            var wrapper = block.querySelector(".otp-field-wrapper");
            var fieldset = block.querySelector("fieldset");
            var serverErrIcon = block.querySelector(".otp-error-icon");
            var serverErrMsg = block.querySelector(".otp-error-message");

            // successIcon is optional (a template may omit it).
            if (!inputs.length || !status || !submitBtn ||
                !errorBox || !resendBtn || !resendTimerText || !resendStatus) {
                return;
            }

            var total = inputs.length;
            var timer = null;

            function isComplete() {
                return inputs.every(function (i) { return i.value !== ""; });
            }

            function firstEmptyIndex() {
                for (var i = 0; i < total; i++) {
                    if (inputs[i].value === "") { return i; }
                }
                return -1;
            }

            function focusInput(index) {
                var el = inputs[index];
                if (!el) { return; }
                el.focus();
                el.select();
            }

            function hasServerError() {
                return !!(wrapper && wrapper.classList.contains("invalid-otp"));
            }

            // Removes the backend-rendered error state as soon as the user starts correcting the OTP.
            function clearServerError() {
                if (!hasServerError()) { return; }
                wrapper.classList.remove("invalid-otp");
                if (serverErrIcon) { serverErrIcon.hidden = true; }
                if (serverErrMsg) {
                    serverErrMsg.hidden = true;
                    // A hidden element is still read via aria-describedby, so drop the reference too.
                    if (fieldset && serverErrMsg.id) {
                        var ids = (fieldset.getAttribute("aria-describedby") || "")
                            .split(/\s+/)
                            .filter(function (id) { return id && id !== serverErrMsg.id; });
                        fieldset.setAttribute("aria-describedby", ids.join(" "));
                    }
                }
            }

            function clearError() {
                errorBox.textContent = "";
                errorBox.classList.remove("show");
                inputs.forEach(function (i) { i.removeAttribute("aria-invalid"); });
                clearServerError();
            }

            function showError(message) {
                // Persistent (no auto-dismiss, WCAG 2.2.1); cleared when the user edits.
                errorBox.textContent = "";
                errorBox.classList.add("show");
                // Re-insert text on next frame so repeated identical errors are re-announced.
                window.setTimeout(function () { errorBox.textContent = message; }, 50);
                inputs.forEach(function (i) {
                    if (i.value === "") { i.setAttribute("aria-invalid", "true"); }
                });
            }

            var wasComplete = false;

            function update() {
                var complete = isComplete();
                var invalid = hasServerError();
                // The error icon takes the success icon's place while the server error is showing.
                if (successIcon) { successIcon.hidden = !complete || invalid; }
                submitBtn.classList.toggle("gray-btn", !complete);
                // Real "disabled": the button cannot be clicked and is skipped by Tab until the OTP is complete.
                // (aria-disabled is kept in sync for any CSS or script that reads it.)
                submitBtn.disabled = !complete;
                submitBtn.setAttribute("aria-disabled", complete ? "false" : "true");

                // Announce only on state change, not on every digit (avoids screen-reader noise).
                if (complete && !wasComplete && !invalid) {
                    status.textContent = "All 6 digits entered. You can now activate the Submit button.";
                } else if (!complete && wasComplete) {
                    status.textContent = "";
                }
                wasComplete = complete;
            }

            function fillFrom(index, raw) {
                var digits = String(raw).replace(/\D/g, "");
                if (!digits) { return; }
                var i = index;
                for (var d = 0; d < digits.length && i < total; d++, i++) {
                    inputs[i].value = digits.charAt(d);
                }
                clearError();
                update();
                focusInput(Math.min(i, total - 1));
            }

            inputs.forEach(function (input, index) {
                input.addEventListener("input", function () {
                    var digits = input.value.replace(/\D/g, "");
                    if (digits.length > 1) {
                        // Autofill / multi-char input: distribute across boxes.
                        input.value = "";
                        fillFrom(index, digits);
                        return;
                    }
                    input.value = digits;
                    clearError();
                    if (digits && index < total - 1) { focusInput(index + 1); }
                    update();
                });

                input.addEventListener("keydown", function (e) {
                    var key = e.key;

                    if (key === "Backspace") {
                        if (!input.value && index > 0) {
                            e.preventDefault();
                            inputs[index - 1].value = "";
                            clearError();
                            focusInput(index - 1);
                            update();
                        }
                        return;
                    }
                    if (key === "ArrowLeft" && index > 0) { e.preventDefault(); focusInput(index - 1); return; }
                    if (key === "ArrowRight" && index < total - 1) { e.preventDefault(); focusInput(index + 1); return; }
                    if (key === "Home") { e.preventDefault(); focusInput(0); return; }
                    if (key === "End") { e.preventDefault(); focusInput(total - 1); return; }

                    // Block non-digit printable characters; never block shortcuts (Ctrl/Cmd+V etc.).
                    if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && !/[0-9]/.test(key)) {
                        e.preventDefault();
                    }
                });

                input.addEventListener("paste", function (e) {
                    e.preventDefault();
                    var text = (e.clipboardData && e.clipboardData.getData("text")) ||
                               (window.clipboardData && window.clipboardData.getData("Text")) || "";
                    fillFrom(0, text);
                });

                input.addEventListener("focus", function () { input.select(); });
            });

            // Submit: block the data-switch-screen handler unless the OTP is complete.
            // Capture phase on the container runs before handlers on/above the button.
            block.addEventListener("click", function (e) {
                var target = e.target;
                if (!(target === submitBtn || submitBtn.contains(target))) { return; }
                if (isComplete()) { return; }

                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                var idx = firstEmptyIndex();
                showError("Error: Please enter all 6 digits of the OTP. Digit " + (idx + 1) + " is empty.");
                focusInput(idx);
            }, true);

            // ---- Resend OTP ----
            function stopTimer() {
                if (timer) { window.clearInterval(timer); timer = null; }
            }

            // Visible timer shows only the countdown (e.g. "00:30").
            function formatTime(s) {
                var m = Math.floor(s / 60);
                var r = s % 60;
                return "0" + m + ":" + (r < 10 ? "0" : "") + r;
            }

            function startResendTimer() {
                stopTimer();
                var remaining = RESEND_SECONDS;

                resendBtn.setAttribute("aria-disabled", "true");
                resendBtn.classList.add("is-disabled");
                // Sighted users: timer only. Screen readers: full sentence below (sr-only, announced once).
                resendTimerText.textContent = formatTime(remaining);
                resendStatus.textContent = "A new OTP has been sent. Resend will be available in " + remaining + " seconds.";

                timer = window.setInterval(function () {
                    remaining--;
                    if (remaining > 0) {
                        resendTimerText.textContent = formatTime(remaining);
                        return;
                    }
                    stopTimer();
                    resendBtn.removeAttribute("aria-disabled");
                    resendBtn.classList.remove("is-disabled");
                    resendTimerText.textContent = "";
                    resendStatus.textContent = "You can now resend the OTP.";
                }, 1000);
            }

            resendBtn.addEventListener("click", function (e) {
                e.preventDefault();
                if (resendBtn.getAttribute("aria-disabled") === "true") { return; }

                inputs.forEach(function (i) { i.value = ""; });
                clearError();
                update();
                startResendTimer();
                focusInput(0);

                /* TODO: call your real resend-OTP API here. */
            });

            update();

            // ---- Announce "OTP sent" when this step appears ----
            // Uses the block's own description text, so it always matches what is on screen:
            // the masked values are aria-hidden and replaced by their readable sr-only versions.
            function sentMessage() {
                var desc = block.querySelector(".ckyc-kin-subline");
                var text = "";

                if (desc) {
                    var clone = desc.cloneNode(true);
                    Array.prototype.forEach.call(clone.querySelectorAll('[aria-hidden="true"]'), function (n) {
                        n.parentNode.removeChild(n);
                    });
                    Array.prototype.forEach.call(clone.querySelectorAll("br"), function (br) {
                        br.parentNode.replaceChild(document.createTextNode(" "), br);
                    });
                    text = clone.textContent.replace(/\s+/g, " ").trim();
                }

                return text || "An OTP has been sent to your registered mobile number and email address.";
            }

            var wasShown = false;

            function checkShown() {
                // getClientRects is empty when the block or any parent is display:none.
                var shown = block.getClientRects().length > 0;

                // Not after a wrong OTP: the error message takes over then.
                if (shown && !wasShown && !hasServerError()) {
                    announceSent(sentMessage());
                }
                wasShown = shown;
            }

            getSentRegion(); // create the region now, before it is needed
            checkShown();

            if (typeof MutationObserver === "function") {
                // Watches show/hide done by your code (class, hidden, inline style) anywhere above the block.
                new MutationObserver(checkShown).observe(document.body, {
                    attributes: true,
                    attributeFilter: ["class", "hidden", "style"],
                    subtree: true
                });
            }

            // Server-rendered error state: move focus to the first box so the error is read out
            // (only when the block is visible; a hidden block must not steal focus).
            if (hasServerError() && block.offsetParent !== null) { focusInput(0); }
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

    proceedButton.disabled = true;

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
    proceedButton.addEventListener("click", function (event) {
        if (proceedButton.disabled || !hasPhoto()) {
            event.preventDefault();
            return;
        }

        hideUploadError();
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
    if (hasPhoto()) {
        enableProceedButton();
    } else {
        disableProceedButton();
    }
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

//////////////////////////Step Announcement///////////////////////////
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








/////////////////////////////// Disability Popover ///////////////////////////////

(function () {
    "use strict";

    var checkbox = document.getElementById("ckyc_disability");
    var popover = document.getElementById("disability_popover");
    var closeButton = document.getElementById("close_disability_popover");

    var proceedButton = document.getElementById(
        "ckyc_kin_disability_options_proceed"
    );

    var impairmentSelect = document.getElementById(
        "disability-1-add-type"
    );

    var customCombobox = document.getElementById(
        "disability-1-add-type-combobox"
    );

    var percentageInput = document.getElementById(
        "disability-1-impairment-percentage"
    );

    var udidInput = document.getElementById(
        "disability-2-udid-number"
    );

    var listbox = document.getElementById(
        "disability-1-add-type-listbox"
    );

    var summaryBlock = document.querySelector(
        ".disability-selected-values-block"
    );

    var summaryBlockWrap = document.getElementById(
        "disability_options_visibility_not_visibility"
    );

    var summaryType = document.getElementById(
        "disability-summary-type"
    );

    var summaryPercentage = document.getElementById(
        "disability-summary-percentage"
    );

    var summaryUdid = document.getElementById(
        "disability-summary-udid"
    );

    var editButtons = document.querySelectorAll(
        ".disability-selected-values-block .edit-popover-values"
    );

    // Stop if the required elements are missing.
    if (
        !checkbox ||
        !popover ||
        !closeButton ||
        !proceedButton ||
        !impairmentSelect ||
        !customCombobox ||
        !percentageInput ||
        !udidInput ||
        !summaryBlock ||
        !summaryType ||
        !summaryPercentage ||
        !summaryUdid ||
        !summaryBlockWrap
    ) {
        return;
    }

    var isOpen = false;
    var hasConfirmedDetails = false;
    var previousFocus = checkbox;

    // Create the validation error message if it does not exist.
    var errorMessage = document.getElementById(
        "disability_popover_error"
    );

    if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.id = "disability_popover_error";
        errorMessage.className = "disability-error-message";
        errorMessage.setAttribute("role", "alert");
        errorMessage.setAttribute("aria-atomic", "true");
        errorMessage.hidden = true;

        proceedButton.parentNode.insertBefore(
            errorMessage,
            proceedButton
        );
    }

    // Show a validation error.
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    }

    // Clear the validation error.
    function clearError() {
        errorMessage.textContent = "";
        errorMessage.hidden = true;
    }

    // Read the selected impairment value.
    function getImpairmentValue() {
        var value = impairmentSelect.value;

        if (value !== "") {
            return value;
        }

        if (listbox) {
            var selectedOption = listbox.querySelector(
                '[role="option"][aria-selected="true"]'
            );

            if (selectedOption) {
                value = selectedOption.getAttribute("data-value");

                if (value) {
                    impairmentSelect.value = value;
                    return value;
                }
            }
        }

        return "";
    }

    // Get the selected impairment's visible text.
    function getImpairmentText() {
        var selectedValue = getImpairmentValue();

        if (!selectedValue) {
            return "";
        }

        var selectedNativeOption = impairmentSelect.options[
            impairmentSelect.selectedIndex
        ];

        if (
            selectedNativeOption &&
            selectedNativeOption.value === selectedValue
        ) {
            return selectedNativeOption.textContent.trim();
        }

        if (listbox) {
            var selectedCustomOption = listbox.querySelector(
                '[role="option"][aria-selected="true"]'
            );

            if (
                selectedCustomOption &&
                selectedCustomOption.getAttribute("data-value") ===
                    selectedValue
            ) {
                return selectedCustomOption.textContent.trim();
            }

            var matchingOption = listbox.querySelector(
                '[role="option"][data-value="' + selectedValue + '"]'
            );

            if (matchingOption) {
                return matchingOption.textContent.trim();
            }
        }

        return "";
    }

    // Update the Confirm button's enabled state.
    function updateProceedButtonState() {
        var impairmentValue = getImpairmentValue();
        var percentage = percentageInput.value.trim();
        var udid = udidInput.value.trim();

        var isFormValid =
            impairmentValue !== "" &&
            percentage !== "" &&
            udid !== "";

        proceedButton.classList.toggle(
            "gray-btn",
            !isFormValid
        );

        proceedButton.disabled = !isFormValid;

        proceedButton.setAttribute(
            "aria-disabled",
            String(!isFormValid)
        );
    }

    // Validate the fields when Confirm is activated.
    function validateFields() {
        if (!getImpairmentValue()) {
            showError("Please select a type of impairment.");
            customCombobox.focus();
            return false;
        }

        if (!udidInput.value.trim()) {
            showError("Please enter your UDID number.");
            udidInput.focus();
            return false;
        }

        if (!getImpairmentText()) {
            showError("Please select a valid type of impairment.");
            customCombobox.focus();
            return false;
        }

        clearError();
        return true;
    }

    // Update the three summary values after successful validation.
    function updateDisabilitySummary() {
        var impairmentText = getImpairmentText();
        var percentage = percentageInput.value.trim();
        var udid = udidInput.value.trim();

        if (!impairmentText || !percentage || !udid) {
            return false;
        }

        summaryType.textContent = impairmentText;
        summaryPercentage.textContent = percentage + "%";
        summaryUdid.textContent = udid;

        // Reveal the summary only after successful confirmation.
        summaryBlock.classList.remove("d-none");
        summaryBlockWrap.classList.remove("disablity-options-not-visible");

        hasConfirmedDetails = true;

        return true;
    }

    // Open the popover and remember which element opened it.
    function openPopover(triggerElement) {
        if (isOpen) {
            return;
        }

        previousFocus = triggerElement || checkbox;
        isOpen = true;

        if (triggerElement && triggerElement.classList.contains("edit-popover-values")) {
    triggerElement.setAttribute("aria-expanded", "true");
}

        popover.classList.remove("d-none");

        checkbox.checked = true;
        //checkbox.setAttribute("aria-expanded", "true");

        clearError();
        updateProceedButtonState();

        customCombobox.focus();
    }

    // Close the popover and optionally restore focus.
    function closePopover(restoreFocus) {
        isOpen = false;
        editButtons.forEach(function (editButton) {
    editButton.setAttribute("aria-expanded", "false");
});

        popover.classList.add("d-none");

        //checkbox.setAttribute("aria-expanded", "false");

        // Keep the checkbox checked after details are confirmed.
        // If no details have been confirmed, closing cancels the selection.
        if (!hasConfirmedDetails) {
            checkbox.checked = false;
        }

        clearError();

        if (restoreFocus && previousFocus) {
            previousFocus.focus();
        }
    }

    // Update Confirm state when the native select changes.
    impairmentSelect.addEventListener(
        "change",
        function () {
            clearError();
            updateProceedButtonState();
        }
    );

    // Update Confirm state when the percentage changes.
    percentageInput.addEventListener("input", function () {
        clearError();
        updateProceedButtonState();
    });

    // Update Confirm state when the UDID changes.
    udidInput.addEventListener("input", function () {
        clearError();
        updateProceedButtonState();
    });

    // Synchronize custom-select option clicks with the native select.
    if (listbox) {
        listbox.addEventListener(
            "click",
            function (event) {
                var option = event.target.closest('[role="option"]');

                if (!option || !listbox.contains(option)) {
                    return;
                }

                var value = option.getAttribute("data-value");

                if (value === null) {
                    return;
                }

                impairmentSelect.value = value;

                clearError();
                updateProceedButtonState();
            },
            true
        );
    }

    // Recalculate Confirm state after keyboard interaction with the combobox.
    customCombobox.addEventListener("keydown", function (event) {
        if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "ArrowDown" ||
            event.key === "ArrowUp"
        ) {
            window.setTimeout(function () {
                clearError();
                updateProceedButtonState();
            }, 0);
        }
    });

    // Open the popover when the checkbox is selected.
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            openPopover(checkbox);
            return;
        }

        // Explicitly unchecking the checkbox clears the confirmed summary.
        hasConfirmedDetails = false;
        summaryBlock.classList.add("d-none");

        summaryType.textContent = "";
        summaryPercentage.textContent = "";
        summaryUdid.textContent = "";

        previousFocus = checkbox;
        closePopover(true);
    });

    // Open the popover from any Edit button.
    editButtons.forEach(function (editButton) {
        editButton.addEventListener("click", function () {
            if (!isOpen) {
                openPopover(editButton);
            }
        });
    });

    // Close the popover with its close button.
    closeButton.addEventListener("click", function () {
        closePopover(true);
    });

    // Return the focusable elements inside the popover.
    function getFocusableElements() {
        return Array.prototype.slice.call(
            popover.querySelectorAll(
                'a[href], button:not([disabled]), ' +
                'input:not([disabled]), select:not([disabled]), ' +
                'textarea:not([disabled]), ' +
                '[tabindex]:not([tabindex="-1"])'
            )
        ).filter(function (element) {
            return (
                !element.closest(".d-none") &&
                element.getAttribute("aria-hidden") !== "true" &&
                element.getClientRects().length > 0
            );
        });
    }

    // Keep keyboard focus inside the open popover.
    // Escape closes it and returns focus to the trigger.
    popover.addEventListener("keydown", function (event) {
        if (!isOpen) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();

            closePopover(true);
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        var focusableElements = getFocusableElements();

        if (!focusableElements.length) {
            event.preventDefault();
            closeButton.focus();
            return;
        }

        var firstElement = focusableElements[0];
        var lastElement = focusableElements[
            focusableElements.length - 1
        ];

        if (event.shiftKey) {
            if (
                document.activeElement === firstElement ||
                !popover.contains(document.activeElement)
            ) {
                event.preventDefault();
                lastElement.focus();
            }
        } else if (
            document.activeElement === lastElement ||
            !popover.contains(document.activeElement)
        ) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    // Prevent focus from moving outside while the popover is open.
    document.addEventListener("focusin", function (event) {
        if (!isOpen || popover.contains(event.target)) {
            return;
        }

        customCombobox.focus();
    });

    // Close on outside click.
    document.addEventListener("click", function (event) {
        if (
            !isOpen ||
            popover.contains(event.target) ||
            checkbox.contains(event.target) ||
            (
                event.target.closest &&
                event.target.closest(
                    ".disability-selected-values-block .edit-popover-values"
                )
            )
        ) {
            return;
        }

        closePopover(true);
    });

    // Confirm details, update the summary, and close the popover.
    proceedButton.addEventListener("click", function (event) {
        event.preventDefault();

        updateProceedButtonState();

        if (!validateFields()) {
            return;
        }

        if (!updateDisabilitySummary()) {
            return;
        }

        closePopover(true);
    });

    // Set the initial Confirm button state.
    updateProceedButtonState();

})();






















