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