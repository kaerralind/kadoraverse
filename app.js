// ============================================================
// KADORAVERSE CHARACTER VAULT
// Application JavaScript
// ============================================================


// ------------------------------------------------------------
// ELEMENTS
// ------------------------------------------------------------

// Login
const loginPage = document.getElementById("login-page");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

// Main application
const app = document.getElementById("app");
const logoutButton = document.getElementById("logout-button");

// Character navigation
const createCharacterButton = document.getElementById("create-character-button");
const createCharacterPage = document.getElementById("create-character-page");
const backToVaultButton = document.getElementById("back-to-vault");
const cancelCharacterButton = document.getElementById("cancel-character");
const createCharacterForm = document.getElementById("create-character-form");

// Character image
const profileImageInput = document.getElementById("profile-image");
const imagePreview = document.getElementById("image-preview");
const removeImageButton = document.getElementById("remove-image");

// Cropper
const cropperModal = document.getElementById("image-cropper-modal");
const cropperImage = document.getElementById("cropper-image");
const cropperZoom = document.getElementById("cropper-zoom");
const cropperCancel = document.getElementById("cropper-cancel");
const cropperReset = document.getElementById("cropper-reset");
const cropperApply = document.getElementById("cropper-apply");


// ------------------------------------------------------------
// CROPPIER STATE
// ------------------------------------------------------------

let cropper = null;
let selectedImageURL = null;
let croppedImageBlob = null;


// ------------------------------------------------------------
// SHOW / HIDE APPLICATION
// ------------------------------------------------------------

function showApp() {

    loginPage.style.display = "none";
    app.style.display = "block";

    createCharacterPage.style.display = "none";
}


// ------------------------------------------------------------
// SHOW LOGIN
// ------------------------------------------------------------

function showLogin() {

    loginPage.style.display = "flex";
    app.style.display = "none";
    createCharacterPage.style.display = "none";
}


// ------------------------------------------------------------
// SHOW CHARACTER CREATION
// ------------------------------------------------------------

function showCreateCharacter() {

    app.style.display = "none";
    createCharacterPage.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ------------------------------------------------------------
// RETURN TO CHARACTER VAULT
// ------------------------------------------------------------

function showVault() {

    createCharacterPage.style.display = "none";
    app.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ------------------------------------------------------------
// CHECK CURRENT LOGIN SESSION
// ------------------------------------------------------------

async function checkLogin() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {

        console.error("Session error:", error);

        showLogin();

        return;
    }

    if (data.session) {

        console.log("User is logged in.");

        showApp();

    } else {

        console.log("No active session.");

        showLogin();

    }
}


// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    loginError.textContent = "";

    const email =
        document.getElementById("login-email").value;

    const password =
        document.getElementById("login-password").value;


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,
            password: password

        });


    if (error) {

        console.error("Login error:", error);

        loginError.textContent =
            "Incorrect email or password.";

        return;
    }


    console.log(
        "Successfully logged in:",
        data.user
    );


    showApp();

});


// ------------------------------------------------------------
// LOG OUT
// ------------------------------------------------------------

logoutButton.addEventListener("click", async function() {

    const { error } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "Logout error:",
            error
        );

        return;
    }


    showLogin();

});


// ------------------------------------------------------------
// OPEN CREATE CHARACTER
// ------------------------------------------------------------

createCharacterButton.addEventListener(
    "click",
    function() {

        showCreateCharacter();

    }
);


// ------------------------------------------------------------
// BACK TO VAULT
// ------------------------------------------------------------

backToVaultButton.addEventListener(
    "click",
    function() {

        showVault();

    }
);


// ------------------------------------------------------------
// CANCEL CHARACTER CREATION
// ------------------------------------------------------------

cancelCharacterButton.addEventListener(
    "click",
    function() {

        showVault();

    }
);


// ============================================================
// IMAGE CROPPER
// ============================================================


// ------------------------------------------------------------
// OPEN IMAGE CROPPER
// ------------------------------------------------------------

profileImageInput.addEventListener(
    "change",
    function(event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }


        // Make sure the selected file is an image
        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            profileImageInput.value = "";

            return;
        }


        // Clean up an old object URL if one exists
        if (selectedImageURL) {

            URL.revokeObjectURL(selectedImageURL);

        }


        selectedImageURL =
            URL.createObjectURL(file);


        // Put the image into the cropper
        cropperImage.src = selectedImageURL;


        // Show cropper
        cropperModal.style.display = "flex";


        // Reset zoom slider
        cropperZoom.value = "1";


        // Destroy previous Cropper instance
        if (cropper) {

            cropper.destroy();

            cropper = null;

        }


        // Wait for image to load
        cropperImage.onload = function() {

            cropper = new Cropper(
                cropperImage,
                {

                    // Fixed character-image ratio
                    aspectRatio: 3 / 4,

                    viewMode: 1,

                    dragMode: "move",

                    autoCropArea: 1,

                    responsive: true,

                    restore: false,

                    guides: false,

                    center: true,

                    highlight: false,

                    background: false,

                    movable: true,

                    zoomable: true,

                    rotatable: false,

                    scalable: false,

                    cropBoxMovable: false,

                    cropBoxResizable: false,

                    toggleDragModeOnDblclick: false

                }
            );

        };

    }
);


// ------------------------------------------------------------
// ZOOM SLIDER
// ------------------------------------------------------------

cropperZoom.addEventListener(
    "input",
    function() {

        if (!cropper) {
            return;
        }


        const zoomValue =
            parseFloat(this.value);


        cropper.zoomTo(zoomValue);

    }
);


// ------------------------------------------------------------
// RESET CROPPER
// ------------------------------------------------------------

cropperReset.addEventListener(
    "click",
    function() {

        if (!cropper) {
            return;
        }


        cropper.reset();

        cropperZoom.value = "1";

    }
);


// ------------------------------------------------------------
// CANCEL CROPPER
// ------------------------------------------------------------

cropperCancel.addEventListener(
    "click",
    function() {

        closeCropper();

        // Clear selected file
        profileImageInput.value = "";

    }
);


// ------------------------------------------------------------
// APPLY CROP
// ------------------------------------------------------------

cropperApply.addEventListener(
    "click",
    function() {

        if (!cropper) {
            return;
        }


        // Get the cropped canvas
        const canvas =
            cropper.getCroppedCanvas({

                width: 600,
                height: 800,

                imageSmoothingEnabled: true,

                imageSmoothingQuality: "high"

            });


        if (!canvas) {

            console.error(
                "Could not create cropped image."
            );

            return;
        }


        // Show the cropped image immediately
        const previewURL =
            canvas.toDataURL("image/png");


        imagePreview.innerHTML = "";


        const previewImage =
            document.createElement("img");


        previewImage.src = previewURL;

        previewImage.alt =
            "Character profile image";


        imagePreview.appendChild(
            previewImage
        );


        // Convert canvas to a Blob.
        // This is what we'll eventually upload
        // to Supabase Storage.
        canvas.toBlob(
            function(blob) {

                croppedImageBlob = blob;

            },
            "image/png"
        );


        // Show remove button
        removeImageButton.style.display =
            "inline-block";


        closeCropper();

    }
);


// ------------------------------------------------------------
// CLOSE CROPPER
// ------------------------------------------------------------

function closeCropper() {

    cropperModal.style.display = "none";


    if (cropper) {

        cropper.destroy();

        cropper = null;

    }


    cropperImage.removeAttribute("src");


    cropperZoom.value = "1";


    if (selectedImageURL) {

        URL.revokeObjectURL(
            selectedImageURL
        );

        selectedImageURL = null;

    }

}


// ------------------------------------------------------------
// REMOVE IMAGE
// ------------------------------------------------------------

removeImageButton.addEventListener(
    "click",
    function() {

        croppedImageBlob = null;

        profileImageInput.value = "";


        imagePreview.innerHTML =
            "<span>No Image</span>";


        removeImageButton.style.display =
            "none";

    }
);


// ============================================================
// CHARACTER FORM
// ============================================================


// ------------------------------------------------------------
// CREATE CHARACTER FORM
// ------------------------------------------------------------

createCharacterForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        console.log(
            "Character form submitted."
        );


        const errorElement =
            document.getElementById(
                "character-form-error"
            );


        errorElement.textContent = "";


        // Make sure the required names exist
        const firstName =
            document.getElementById(
                "first-name"
            ).value.trim();


        const lastName =
            document.getElementById(
                "last-name"
            ).value.trim();


        if (!firstName || !lastName) {

            errorElement.textContent =
                "First Name and Last Name are required.";

            return;

        }


        /*
         * CHARACTER CREATION WILL BE CONNECTED
         * TO SUPABASE HERE.
         *
         * For now, we're just confirming that
         * the form is working.
         */

        console.log(
            "Character:",
            firstName,
            lastName
        );


        if (croppedImageBlob) {

            console.log(
                "Cropped profile image ready:",
                croppedImageBlob
            );

        }


        alert(
            `${firstName} ${lastName} is ready to be created!`
        );

    }
);


// ------------------------------------------------------------
// START APPLICATION
// ------------------------------------------------------------

checkLogin();