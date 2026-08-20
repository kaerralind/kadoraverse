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

// Gender
const genderSelect = document.getElementById("gender");
const genderSymbol = document.getElementById("gender-symbol");

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
// GENDER SYMBOLS
// ------------------------------------------------------------

const genderSymbols = {
    Alpha: "α",
    Sigma: "Σ",
    Beta: "β",
    Zeta: "ζ",
    Omega: "ω",
    Omicron: "ο",
    Tau: "τ"
};


genderSelect.addEventListener(
    "change",
    function() {

        const selectedGender =
            this.value;

        genderSymbol.textContent =
            genderSymbols[selectedGender] || "—";

    }
);


// ------------------------------------------------------------
// CREATE CHARACTER FORM
// ------------------------------------------------------------

createCharacterForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const errorElement =
            document.getElementById(
                "character-form-error"
            );

        errorElement.textContent = "";


        // ----------------------------------------------------
        // GET BASIC IDENTITY
        // ----------------------------------------------------

        const firstName =
            document.getElementById(
                "first-name"
            ).value.trim();

        const lastName =
            document.getElementById(
                "last-name"
            ).value.trim();


        // ----------------------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ----------------------------------------------------

        if (!firstName || !lastName) {

            errorElement.textContent =
                "First Name and Last Name are required.";

            return;

        }

        // ----------------------------------------------------
        // GET ALL FORM VALUES
        // ----------------------------------------------------

        const displayName =
            document.getElementById(
                "display-name"
            ).value.trim() || null;


        const aliases =
            document.getElementById(
                "aliases"
            ).value.trim() || null;


        const gender =
            document.getElementById(
                "gender"
            ).value.trim() || null;


        const species =
            document.getElementById(
                "species"
            ).value.trim() || null;


        const height =
            document.getElementById(
                "height"
            ).value.trim() || null;


        const hairColor =
            document.getElementById(
                "hair-color"
            ).value.trim() || null;


        const eyeColor =
            document.getElementById(
                "eye-color"
            ).value.trim() || null;


        const birthMonth =
            document.getElementById(
                "birth-month"
            ).value;


        const birthDay =
            document.getElementById(
                "birth-day"
            ).value;


        const birthYear =
            document.getElementById(
                "birth-year"
            ).value;


        const zodiacSign =
            document.getElementById(
                "zodiac-sign"
            ).value.trim() || null;


        const birthPlace =
            document.getElementById(
                "birth-place"
            ).value.trim() || null;


        const residence =
            document.getElementById(
                "residence"
            ).value.trim() || null;


        const occupation =
            document.getElementById(
                "occupation"
            ).value.trim() || null;


        const affiliations =
            document.getElementById(
                "affiliations"
            ).value.trim() || null;


        const maritalStatus =
            document.getElementById(
                "marital-status"
            ).value.trim() || null;


        // ----------------------------------------------------
        // BUILD DATE OF BIRTH
        // ----------------------------------------------------

        let dateOfBirth = null;


        if (
            birthMonth &&
            birthDay &&
            birthYear
        ) {

            const month =
                String(birthMonth).padStart(2, "0");

            const day =
                String(birthDay).padStart(2, "0");


            dateOfBirth =
                `${birthYear}-${month}-${day}`;

        }


        // ----------------------------------------------------
        // SHOW SAVING STATE
        // ----------------------------------------------------

        const saveButton =
            createCharacterForm.querySelector(
                ".save-character-button"
            );


        const originalButtonText =
            saveButton.textContent;


        saveButton.disabled = true;

        saveButton.textContent =
            "Creating Character...";


        try {


            // =================================================
            // 1. CHECK FOR EXISTING CHARACTER
            // =================================================

            const {
                data: existingCharacter,
                error: existingCharacterError
            } = await supabaseClient
                .from("characters")
                .select("id")
                .eq("first_name", firstName)
                .eq("last_name", lastName)
                .maybeSingle();


            if (existingCharacterError) {

                console.error(
                    "Character lookup error:",
                    existingCharacterError
                );

                throw new Error(
                    "Could not check whether this character already exists."
                );

            }


            if (existingCharacter) {

                throw new Error(
                    `${firstName} ${lastName} already exists in the Character Vault.`
                );

            }


            // =================================================
            // 2. UPLOAD PROFILE IMAGE
            // =================================================

            let profileImageURL = null;


            if (croppedImageBlob) {

                const imageFileName =
                    `${firstName} ${lastName}.png`;


                const imagePath =
                    imageFileName;


                // ---------------------------------------------
                // Check whether exact filename already exists
                // ---------------------------------------------

                const {
                    data: existingFiles,
                    error: fileCheckError
                } = await supabaseClient
                    .storage
                    .from("character-images")
                    .list("", {
                        search: imageFileName
                    });


                if (fileCheckError) {

                    console.error(
                        "Image check error:",
                        fileCheckError
                    );

                    throw new Error(
                        "Could not check the character image storage."
                    );

                }


                const exactFileExists =
                    existingFiles &&
                    existingFiles.some(
                        file =>
                            file.name === imageFileName
                    );


                if (exactFileExists) {

                    throw new Error(
                        `The image "${imageFileName}" already exists in Character Images.`
                    );

                }


                // ---------------------------------------------
                // Upload image
                // ---------------------------------------------

                const {
                    error: uploadError
                } = await supabaseClient
                    .storage
                    .from("character-images")
                    .upload(
                        imagePath,
                        croppedImageBlob,
                        {
                            contentType: "image/png",
                            upsert: false
                        }
                    );


                if (uploadError) {

                    console.error(
                        "Image upload error:",
                        uploadError
                    );

                    throw new Error(
                        "The character image could not be uploaded."
                    );

                }


                // ---------------------------------------------
                // Get public image URL
                // ---------------------------------------------

                const {
                    data: publicURLData
                } = supabaseClient
                    .storage
                    .from("character-images")
                    .getPublicUrl(imagePath);


                profileImageURL =
                    publicURLData.publicUrl;

            }


            // =================================================
            // 3. CREATE CHARACTER
            // =================================================

            const {
                data: newCharacter,
                error: characterInsertError
            } = await supabaseClient
                .from("characters")
                .insert({

                    first_name: firstName,

                    last_name: lastName,

                    display_name: displayName,

                    aliases: aliases,

                    gender: gender,

                    species: species,

                    height: height,

                    hair_color: hairColor,

                    eye_color: eyeColor,

                    date_of_birth: dateOfBirth,

                    zodiac_sign: zodiacSign,

                    birth_place: birthPlace,

                    residence: residence,

                    occupation: occupation,

                    affiliations: affiliations,

                    marital_status: maritalStatus,

                    profile_status: "draft",

                    profile_image: profileImageURL

                })
                .select()
                .single();


            if (characterInsertError) {

                console.error(
                    "Character creation error:",
                    characterInsertError
                );


                // ---------------------------------------------
                // If database creation failed after uploading
                // the image, remove the orphaned image.
                // ---------------------------------------------

                if (croppedImageBlob) {

                    await supabaseClient
                        .storage
                        .from("character-images")
                        .remove([
                            imagePath
                        ]);

                }


                // Handle duplicate-name constraint

                if (
                    characterInsertError.code === "23505"
                ) {

                    throw new Error(
                        `${firstName} ${lastName} already exists in the Character Vault.`
                    );

                }


                throw new Error(
                    "The character could not be created."
                );

            }


            // =================================================
            // 4. SUCCESS
            // =================================================

            console.log(
                "Character successfully created:",
                newCharacter
            );


            alert(
                `${firstName} ${lastName} has been created!`
            );


            // -------------------------------------------------
            // Reset form
            // -------------------------------------------------

            createCharacterForm.reset();


            croppedImageBlob = null;


            imagePreview.innerHTML =
                "<span>No Image</span>";


            removeImageButton.style.display =
                "none";


            profileImageInput.value = "";


            // -------------------------------------------------
            // Return to Character Vault
            // -------------------------------------------------

            showVault();


        } catch (error) {

            console.error(
                "Character creation failed:",
                error
            );


            errorElement.textContent =
                error.message ||
                "Something went wrong while creating the character.";


        } finally {

            saveButton.disabled = false;

            saveButton.textContent =
                originalButtonText;

        }

    }
);


// ------------------------------------------------------------
// START APPLICATION
// ------------------------------------------------------------

checkLogin();