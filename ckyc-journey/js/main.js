// Active Proceed Button When Primary Radio Button is Selected
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