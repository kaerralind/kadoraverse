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
const createCharacterButton =
    document.getElementById("create-character-button");

const createCharacterPage =
    document.getElementById("create-character-page");

const backToVaultButton =
    document.getElementById("back-to-vault");

const cancelCharacterButton =
    document.getElementById("cancel-character");

const createCharacterForm =
    document.getElementById("create-character-form");

// Relationship / partner elements
const partnerSection =
    document.getElementById("partner-section");

const partnersContainer =
    document.getElementById("partners-container");

const addPartnerButton =
    document.getElementById("add-partner");

// Character image
const profileImageInput =
    document.getElementById("profile-image");

const imagePreview =
    document.getElementById("image-preview");

const removeImageButton =
    document.getElementById("remove-image");

// Gender
const genderSelect =
    document.getElementById("gender");

const genderSymbol =
    document.getElementById("gender-symbol");

// Cropper
const cropperModal =
    document.getElementById("image-cropper-modal");

const cropperImage =
    document.getElementById("cropper-image");

const cropperZoom =
    document.getElementById("cropper-zoom");

const cropperCancel =
    document.getElementById("cropper-cancel");

const cropperReset =
    document.getElementById("cropper-reset");

const cropperApply =
    document.getElementById("cropper-apply");


// ------------------------------------------------------------
// DRAFT / CROPPER STATE
// ------------------------------------------------------------

let cropper = null;
let selectedImageURL = null;
let croppedImageBlob = null;

let currentCharacterId = null;
let autosaveInterval = null;


// ============================================================
// SHOW / HIDE APPLICATION
// ============================================================


// ------------------------------------------------------------
// SHOW APPLICATION
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

    stopCharacterDraftAutosave();

}


// ------------------------------------------------------------
// SHOW CHARACTER CREATION
// ------------------------------------------------------------

function showCreateCharacter() {

    loginPage.style.display = "none";
    app.style.display = "none";
    createCharacterPage.style.display = "block";

    localStorage.setItem(
        "kadoraverse_current_page",
        "create-character"
    );

    startCharacterDraftAutosave();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ------------------------------------------------------------
// RETURN TO CHARACTER VAULT
// ------------------------------------------------------------

function showVault() {

    loginPage.style.display = "none";
    createCharacterPage.style.display = "none";
    app.style.display = "block";

    localStorage.setItem(
        "kadoraverse_current_page",
        "vault"
    );

    stopCharacterDraftAutosave();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ============================================================
// CHARACTER DRAFT AUTOSAVE
// ============================================================


// ------------------------------------------------------------
// START AUTOSAVE
// ------------------------------------------------------------

function startCharacterDraftAutosave() {

    if (autosaveInterval) {

        clearInterval(
            autosaveInterval
        );

    }

    autosaveInterval =
        setInterval(
            saveCharacterDraft,
            30 * 1000
        );

    console.log(
        "Character draft autosave started."
    );

}


// ------------------------------------------------------------
// STOP AUTOSAVE
// ------------------------------------------------------------

function stopCharacterDraftAutosave() {

    if (autosaveInterval) {

        clearInterval(
            autosaveInterval
        );

        autosaveInterval = null;

    }

    console.log(
        "Character draft autosave stopped."
    );

}


// ------------------------------------------------------------
// SAVE CHARACTER DRAFT
// ------------------------------------------------------------

async function saveCharacterDraft() {

    // Don't autosave when the creation page is hidden
    if (
        createCharacterPage.style.display === "none"
    ) {

        return;

    }


    // --------------------------------------------------------
    // REQUIRED NAME FIELDS
    // --------------------------------------------------------

    const firstName =
        document.getElementById(
            "first-name"
        ).value.trim();

    const lastName =
        document.getElementById(
            "last-name"
        ).value.trim();


    // Don't create a database row without a name
    if (
        !firstName ||
        !lastName
    ) {

        console.log(
            "Draft autosave skipped: first and last name are required."
        );

        return;

    }


    // --------------------------------------------------------
    // FORM VALUES
    // --------------------------------------------------------

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


    const penisSize =
        document.getElementById(
            "penis-size"
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


    const profileDumpElement =
        document.getElementById(
            "profile-dump"
        );


    const profileDump =
        profileDumpElement
            ? profileDumpElement.value.trim() || null
            : null;


    // --------------------------------------------------------
    // BUILD DATE OF BIRTH
    // --------------------------------------------------------

    let dateOfBirth = null;


    if (
        birthMonth &&
        birthDay &&
        birthYear
    ) {

        const month =
            String(
                birthMonth
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                birthDay
            ).padStart(
                2,
                "0"
            );


        dateOfBirth =
            `${birthYear}-${month}-${day}`;

    }


    // --------------------------------------------------------
    // CALCULATE AGE
    // --------------------------------------------------------

    const age =
        calculateAge(
            dateOfBirth
        );


    // --------------------------------------------------------
    // CHARACTER DATA
    // --------------------------------------------------------

    const characterData = {

        first_name:
            firstName,

        last_name:
            lastName,

        display_name:
            displayName,

        aliases:
            aliases,

        gender:
            gender,

        species:
            species,

        height:
            height,

        penis_size:
            penisSize,

        hair_color:
            hairColor,

        eye_color:
            eyeColor,

        date_of_birth:
            dateOfBirth,

        age:
            age,

        zodiac_sign:
            zodiacSign,

        birth_place:
            birthPlace,

        residence:
            residence,

        occupation:
            occupation,

        affiliations:
            affiliations,

        marital_status:
            maritalStatus,

        profile_dump:
            profileDump,

        profile_status:
            "draft"

    };


    try {

        // ====================================================
        // UPDATE EXISTING DRAFT
        // ====================================================

        if (currentCharacterId) {

            const {
                error
            } = await supabaseClient
                .from("characters")
                .update(
                    characterData
                )
                .eq(
                    "id",
                    currentCharacterId
                );


            if (error) {

                console.error(
                    "Draft autosave update error:",
                    error
                );

                return;

            }


            console.log(
                "Character draft autosaved."
            );

            return;

        }


        // ====================================================
        // CREATE NEW DRAFT
        // ====================================================

        const {
            data,
            error
        } = await supabaseClient
            .from("characters")
            .insert(
                characterData
            )
            .select("id")
            .single();


        if (error) {

            console.error(
                "Draft autosave creation error:",
                error
            );

            return;

        }


        currentCharacterId =
            data.id;


        console.log(
            "Character draft created:",
            currentCharacterId
        );

    } catch (error) {

        console.error(
            "Character draft autosave failed:",
            error
        );

    }

}


// ============================================================
// LOGIN SESSION
// ============================================================


// ------------------------------------------------------------
// CHECK CURRENT LOGIN SESSION
// ------------------------------------------------------------

async function checkLogin() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        showLogin();

        return;

    }


    if (data.session) {

        console.log(
            "User is logged in."
        );


        const currentPage =
            localStorage.getItem(
                "kadoraverse_current_page"
            );


        if (
            currentPage ===
            "create-character"
        ) {

            showCreateCharacter();

        } else {

            showApp();

        }

    } else {

        console.log(
            "No active session."
        );

        showLogin();

    }

}


// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        loginError.textContent = "";


        const email =
            document.getElementById(
                "login-email"
            ).value;


        const password =
            document.getElementById(
                "login-password"
            ).value;


        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email:
                    email,

                password:
                    password

            });


        if (error) {

            console.error(
                "Login error:",
                error
            );

            loginError.textContent =
                "Incorrect email or password.";

            return;

        }


        console.log(
            "Successfully logged in:",
            data.user
        );


        showApp();

    }
);


// ------------------------------------------------------------
// LOG OUT
// ------------------------------------------------------------

logoutButton.addEventListener(
    "click",
    async function() {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return;

        }


        localStorage.removeItem(
            "kadoraverse_current_page"
        );


        currentCharacterId =
            null;


        showLogin();

    }
);


// ============================================================
// CHARACTER NAVIGATION
// ============================================================


// ------------------------------------------------------------
// OPEN CREATE CHARACTER
// ------------------------------------------------------------

createCharacterButton.addEventListener(
    "click",
    function() {

        currentCharacterId =
            null;

        showCreateCharacter();

    }
);


// ------------------------------------------------------------
// BACK TO CHARACTER VAULT
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

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Please select an image file."
            );

            profileImageInput.value =
                "";

            return;

        }


        if (selectedImageURL) {

            URL.revokeObjectURL(
                selectedImageURL
            );

        }


        selectedImageURL =
            URL.createObjectURL(
                file
            );


        cropperImage.src =
            selectedImageURL;


        cropperModal.style.display =
            "flex";


        cropperZoom.value =
            "1";


        if (cropper) {

            cropper.destroy();

            cropper =
                null;

        }


        cropperImage.onload =
            function() {

                cropper =
                    new Cropper(
                        cropperImage,
                        {

                            aspectRatio:
                                3 / 4,

                            viewMode:
                                1,

                            dragMode:
                                "move",

                            autoCropArea:
                                1,

                            responsive:
                                true,

                            restore:
                                false,

                            guides:
                                false,

                            center:
                                true,

                            highlight:
                                false,

                            background:
                                false,

                            movable:
                                true,

                            zoomable:
                                true,

                            rotatable:
                                false,

                            scalable:
                                false,

                            cropBoxMovable:
                                false,

                            cropBoxResizable:
                                false,

                            toggleDragModeOnDblclick:
                                false

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
            parseFloat(
                this.value
            );


        cropper.zoomTo(
            zoomValue
        );

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

        cropperZoom.value =
            "1";

    }
);


// ------------------------------------------------------------
// CANCEL CROPPER
// ------------------------------------------------------------

cropperCancel.addEventListener(
    "click",
    function() {

        closeCropper();

        profileImageInput.value =
            "";

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


        const canvas =
            cropper.getCroppedCanvas({

                width:
                    600,

                height:
                    800,

                imageSmoothingEnabled:
                    true,

                imageSmoothingQuality:
                    "high"

            });


        if (!canvas) {

            console.error(
                "Could not create cropped image."
            );

            return;

        }


        // ----------------------------------------------------
        // SHOW PREVIEW
        // ----------------------------------------------------

        const previewURL =
            canvas.toDataURL(
                "image/png"
            );


        imagePreview.innerHTML =
            "";


        const previewImage =
            document.createElement(
                "img"
            );


        previewImage.src =
            previewURL;


        previewImage.alt =
            "Character profile image";


        imagePreview.appendChild(
            previewImage
        );


        // ----------------------------------------------------
        // CONVERT TO BLOB
        // ----------------------------------------------------

        canvas.toBlob(
            function(blob) {

                croppedImageBlob =
                    blob;

            },
            "image/png"
        );


        removeImageButton.style.display =
            "inline-block";


        closeCropper();

    }
);


// ------------------------------------------------------------
// CLOSE CROPPER
// ------------------------------------------------------------

function closeCropper() {

    cropperModal.style.display =
        "none";


    if (cropper) {

        cropper.destroy();

        cropper =
            null;

    }


    cropperImage.removeAttribute(
        "src"
    );


    cropperZoom.value =
        "1";


    if (selectedImageURL) {

        URL.revokeObjectURL(
            selectedImageURL
        );

        selectedImageURL =
            null;

    }

}


// ------------------------------------------------------------
// REMOVE IMAGE
// ------------------------------------------------------------

removeImageButton.addEventListener(
    "click",
    function() {

        croppedImageBlob =
            null;


        profileImageInput.value =
            "";


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
//
// These are DISPLAY ONLY.
// They are NOT saved to Supabase.
// The gender itself is saved.
// ------------------------------------------------------------

const genderSymbols = {

    Alpha:
        "α",

    Sigma:
        "Σ",

    Beta:
        "β",

    Zeta:
        "ζ",

    Omega:
        "ω",

    Omicron:
        "ο",

    Tau:
        "τ"

};


// ------------------------------------------------------------
// SCENTS
// ------------------------------------------------------------

const alphaSigmaScents = {

    "Marine / Fresh": [
        "Citrus",
        "Coconut",
        "Saltwater",
        "Sea Breeze"
    ],

    "Woods / Forest": [
        "Cedar",
        "Driftwood",
        "Juniper Wood",
        "Moss",
        "Oakwood",
        "Pine",
        "Sandalwood"
    ],

    "Animalic / Natural": [
        "Allspice",
        "Bay Leaf",
        "Black Pepper",
        "Clove",
        "Coriander Seed",
        "Cumin Seed",
        "Musk",
        "Pepper",
        "Smokiness",
        "Star Anise",
        "Tanned Leather"
    ],

    "Earth / Weather": [
        "Ozone",
        "Petrichor",
        "Winter Breeze"
    ],

    "Herbal": [
        "Basil",
        "Cedar Leaf",
        "Eucalyptus",
        "Laurel Leaf",
        "Marjoram",
        "Mint",
        "Oregano",
        "Pine Needle",
        "Rosemary",
        "Sage",
        "Tarragon",
        "Thyme"
    ],

    "Nutty": [
        "Almond",
        "Chestnut",
        "Hazelnut",
        "Walnut"
    ],

    "Metallic / Mineral": [
        "Iron",
        "Metallic",
        "Steel"
    ],

    "Resin / Wood Smoke": [
        "Amber",
        "Burning Cedar",
        "Cedar Tar",
        "Charred Wood",
        "Guaiac Wood",
        "Pine Tar"
    ],

    "Stone / Earth": [
        "Chalk",
        "Clay",
        "Dry Earth",
        "Dust",
        "Forest Floor",
        "Granite Dust",
        "Limestone",
        "Loam",
        "River Rock",
        "Root-Rich Soil",
        "Sand",
        "Sandstone",
        "Slate",
        "Volcanic Ash",
        "Wet Stone"
    ],

    "Cold / Atmospheric": [
        "Alpine Chill",
        "Campfire",
        "Charcoal",
        "Fireplace Ash",
        "Fresh Asphalt",
        "Fresh-cut Grass",
        "Frost",
        "Gunpowder",
        "Snowmelt"
    ],

    "Bitter / Green": [
        "Bitter Greens",
        "Crushed Stems",
        "Juniper",
        "Wormwood"
    ],

    "Resinous Wood": [
        "Balsam",
        "Fir Resin",
        "Maple Sap",
        "Sweet Birch"
    ],

    "Plants / Bark / Root": [
        "Bark Shavings",
        "Dried Hay",
        "Oakmoss",
        "Tobacco Leaf",
        "Tree Sap"
    ]

};


const omegaZetaScents = {

    "Floral": [
        "Apple Blossom",
        "Chamomile",
        "Clover Blossom",
        "Freesia",
        "Gardenia",
        "Heather",
        "Heliotrope",
        "Hibiscus",
        "Honeysuckle",
        "Iris",
        "Jasmine",
        "Lilac",
        "Lily",
        "Lily of the Valley",
        "Lotus",
        "Magnolia",
        "Mimosa",
        "Orange Blossom",
        "Orchid",
        "Osmanthus",
        "Peony",
        "Plumeria",
        "Rose",
        "Sweet Pea",
        "Violet",
        "Water Lily",
        "Wildflowers",
        "Wisteria"
    ],

    "Fruity": [
        "Apple Blossom",
        "Apricot",
        "Blackberry",
        "Blueberry",
        "Citrus",
        "Fig",
        "Guava",
        "Mango",
        "Melon",
        "Passionfruit",
        "Peach",
        "Pear",
        "Pineapple",
        "Plum",
        "Raspberry",
        "Ripe Berries",
        "Strawberry",
        "Tropical Fruit",
        "White Grape"
    ],

    "Sweet / Nectarous": [
        "Acacia Blossom",
        "Agave",
        "Brown Sugar",
        "Elderflower",
        "Golden Honey",
        "Honey",
        "Honeysuckle Nectar",
        "Linden Blossom",
        "Maple Syrup",
        "Pollen-Sweet Bloom"
    ],

    "Gourmand": [
        "Angel Food Cake",
        "Brown Butter",
        "Caramel",
        "Chocolate",
        "Condensed Milk",
        "Cream Puff",
        "Macadamia",
        "Marshmallow",
        "Meringue",
        "Oat Cream",
        "Pecan",
        "Pistachio",
        "Rice Milk",
        "Shortbread",
        "Spun Sugar",
        "Steamed Rice",
        "Sweet Cream",
        "Toasted Sugar",
        "Vanilla",
        "Warm Milk"
    ],

    "Spices": [
        "Cardamom",
        "Cinnamon",
        "Nutmeg"
    ],

    "Herbal": [
        "Aloe Vera",
        "Green Tea",
        "Lemongrass",
        "Spearmint",
        "Verbena",
        "White Tea"
    ],

    "Plant-Based": [
        "Damp Leaves",
        "Fresh Hay",
        "Fresh Soil",
        "Mossy Green",
        "Rice Husk",
        "Sweetgrass",
        "Wheatgrass"
    ]

};


const scentGroups = {

    Alpha:
        alphaSigmaScents,

    Sigma:
        alphaSigmaScents,

    Omega:
        omegaZetaScents,

    Zeta:
        omegaZetaScents

};


// ------------------------------------------------------------
// SCENT SELECTOR
// ------------------------------------------------------------

const scentSelect =
    document.getElementById(
        "scent"
    );


function populateScentDropdown(gender) {

    scentSelect.innerHTML =
        '<option value="">Select Scent</option>';


    const groups =
        scentGroups[gender];


    if (!groups) {

        scentSelect.disabled =
            true;

        return;

    }


    Object.entries(groups).forEach(
        ([category, scents]) => {

            const optgroup =
                document.createElement(
                    "optgroup"
                );


            optgroup.label =
                category;


            scents.forEach(
                scent => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        scent;


                    option.textContent =
                        scent;


                    optgroup.appendChild(
                        option
                    );

                }
            );


            scentSelect.appendChild(
                optgroup
            );

        }
    );


    scentSelect.disabled =
        false;

}


// ------------------------------------------------------------
// GENDER CHANGE
// ------------------------------------------------------------

genderSelect.addEventListener(
    "change",
    function() {

        const selectedGender =
            this.value;


        // Display only
        genderSymbol.textContent =
            genderSymbols[selectedGender] ||
            "—";


        populateScentDropdown(
            selectedGender
        );

    }
);


// ============================================================
// AGE CALCULATION
// ============================================================

function calculateAge(dateOfBirth) {

    if (!dateOfBirth) {

        return null;

    }


    const birthDate =
        new Date(
            `${dateOfBirth}T00:00:00`
        );


    if (
        Number.isNaN(
            birthDate.getTime()
        )
    ) {

        return null;

    }


    const today =
        new Date();


    let age =
        today.getFullYear() -
        birthDate.getFullYear();


    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();


    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
            birthDate.getDate()
        )
    ) {

        age--;

    }


    return age;

}


// ============================================================
// ZODIAC SIGN
// ============================================================

function getZodiacSign(month, day) {

    month =
        parseInt(
            month
        );


    day =
        parseInt(
            day
        );


    if (
        !month ||
        !day
    ) {

        return "";

    }


    if (
        (month === 3 && day >= 21) ||
        (month === 4 && day <= 19)
    ) {

        return "Aries";

    }


    if (
        (month === 4 && day >= 20) ||
        (month === 5 && day <= 20)
    ) {

        return "Taurus";

    }


    if (
        (month === 5 && day >= 21) ||
        (month === 6 && day <= 20)
    ) {

        return "Gemini";

    }


    if (
        (month === 6 && day >= 21) ||
        (month === 7 && day <= 22)
    ) {

        return "Cancer";

    }


    if (
        (month === 7 && day >= 23) ||
        (month === 8 && day <= 22)
    ) {

        return "Leo";

    }


    if (
        (month === 8 && day >= 23) ||
        (month === 9 && day <= 22)
    ) {

        return "Virgo";

    }


    if (
        (month === 9 && day >= 23) ||
        (month === 10 && day <= 22)
    ) {

        return "Libra";

    }


    if (
        (month === 10 && day >= 23) ||
        (month === 11 && day <= 21)
    ) {

        return "Scorpio";

    }


    if (
        (month === 11 && day >= 22) ||
        (month === 12 && day <= 21)
    ) {

        return "Sagittarius";

    }


    if (
        (month === 12 && day >= 22) ||
        (month === 1 && day <= 19)
    ) {

        return "Capricorn";

    }


    if (
        (month === 1 && day >= 20) ||
        (month === 2 && day <= 18)
    ) {

        return "Aquarius";

    }


    if (
        (month === 2 && day >= 19) ||
        (month === 3 && day <= 20)
    ) {

        return "Pisces";

    }


    return "";

}


// ============================================================
// BIRTH DATE / ZODIAC
// ============================================================

const birthMonthInput =
    document.getElementById(
        "birth-month"
    );


const birthDayInput =
    document.getElementById(
        "birth-day"
    );


const birthYearInput =
    document.getElementById(
        "birth-year"
    );


const zodiacSignInput =
    document.getElementById(
        "zodiac-sign"
    );


// ------------------------------------------------------------
// UPDATE AVAILABLE DAYS
// ------------------------------------------------------------

function updateBirthDays() {

    const month =
        parseInt(
            birthMonthInput.value
        );


    const year =
        parseInt(
            birthYearInput.value
        );


    const currentDay =
        birthDayInput.value;


    let daysInMonth =
        31;


    if (month) {

        if (
            month === 2
        ) {

            if (
                year &&
                (
                    year % 400 === 0 ||
                    (
                        year % 4 === 0 &&
                        year % 100 !== 0
                    )
                )
            ) {

                daysInMonth =
                    29;

            } else {

                daysInMonth =
                    28;

            }

        } else if (
            [4, 6, 9, 11].includes(
                month
            )
        ) {

            daysInMonth =
                30;

        }

    }


    birthDayInput.innerHTML =
        '<option value="">Day</option>';


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            day;


        option.textContent =
            day;


        birthDayInput.appendChild(
            option
        );

    }


    if (
        currentDay &&
        parseInt(
            currentDay
        ) <= daysInMonth
    ) {

        birthDayInput.value =
            currentDay;

    }

}


// ------------------------------------------------------------
// UPDATE ZODIAC
// ------------------------------------------------------------

function updateZodiacSign() {

    const zodiacSign =
        getZodiacSign(
            birthMonthInput.value,
            birthDayInput.value
        );


    zodiacSignInput.value =
        zodiacSign;

}


// ------------------------------------------------------------
// BIRTH MONTH CHANGE
// ------------------------------------------------------------

birthMonthInput.addEventListener(
    "change",
    function() {

        updateBirthDays();

        updateZodiacSign();

    }
);


// ------------------------------------------------------------
// BIRTH DAY CHANGE
// ------------------------------------------------------------

birthDayInput.addEventListener(
    "change",
    function() {

        updateZodiacSign();

    }
);


// ------------------------------------------------------------
// BIRTH YEAR CHANGE
// ------------------------------------------------------------

birthYearInput.addEventListener(
    "input",
    function() {

        updateBirthDays();

        updateZodiacSign();

    }
);


// ============================================================
// CHARACTER RELATIONSHIPS
// ============================================================

const partnerRelationshipStatuses = [

    "Dating",

    "Engaged",

    "Married",

    "Mated",

    "Separated",

    "Divorced",

    "Widowed",

    "Open Relationship",

    "It's Complicated"

];


// ------------------------------------------------------------
// SHOW PARTNER SECTION
// ------------------------------------------------------------

function updatePartnerSectionVisibility() {

    partnerSection.style.display =
        "block";

}


// ------------------------------------------------------------
// ADD PARTNER
// ------------------------------------------------------------

function addPartner() {

    const partnerEntry =
        document.createElement(
            "div"
        );


    partnerEntry.className =
        "partner-entry";


    partnerEntry.innerHTML = `

        <div class="form-grid">

            <div class="form-field">

                <label>
                    Partner
                </label>

                <input
                    type="text"
                    class="partner-name"
                    placeholder="Character name"
                >

            </div>


            <div class="form-field">

                <label>
                    Relationship Status
                </label>

                <select
                    class="partner-status"
                >

                    <option value="">
                        Select...
                    </option>

                    ${partnerRelationshipStatuses.map(
                        status =>
                            `<option value="${status}">${status}</option>`
                    ).join("")}

                </select>

            </div>

        </div>


        <button
            type="button"
            class="remove-partner-button"
        >
            Remove Partner
        </button>

    `;


    partnersContainer.appendChild(
        partnerEntry
    );


    const removeButton =
        partnerEntry.querySelector(
            ".remove-partner-button"
        );


    removeButton.addEventListener(
        "click",
        function() {

            partnerEntry.remove();

        }
    );

}


// ------------------------------------------------------------
// ADD PARTNER BUTTON
// ------------------------------------------------------------

addPartnerButton.addEventListener(
    "click",
    function() {

        addPartner();

    }
);


// ============================================================
// CREATE / SAVE CHARACTER
// ============================================================


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


        errorElement.textContent =
            "";


        // ----------------------------------------------------
        // BASIC IDENTITY
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

        if (
            !firstName ||
            !lastName
        ) {

            errorElement.textContent =
                "First Name and Last Name are required.";

            return;

        }


        // ----------------------------------------------------
        // FORM VALUES
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


        const penisSize =
            document.getElementById(
                "penis-size"
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


        const profileDumpElement =
            document.getElementById(
                "profile-dump"
            );


        const profileDump =
            profileDumpElement
                ? profileDumpElement.value.trim() || null
                : null;


        // ----------------------------------------------------
        // BUILD DATE OF BIRTH
        // ----------------------------------------------------

        let dateOfBirth =
            null;


        if (
            birthMonth &&
            birthDay &&
            birthYear
        ) {

            const month =
                String(
                    birthMonth
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    birthDay
                ).padStart(
                    2,
                    "0"
                );


            dateOfBirth =
                `${birthYear}-${month}-${day}`;

        }


        // ----------------------------------------------------
        // CALCULATE AGE
        // ----------------------------------------------------

        const age =
            calculateAge(
                dateOfBirth
            );


        // ----------------------------------------------------
        // SHOW SAVING STATE
        // ----------------------------------------------------

        const saveButton =
            createCharacterForm.querySelector(
                ".save-character-button"
            );


        const originalButtonText =
            saveButton.textContent;


        saveButton.disabled =
            true;


        saveButton.textContent =
            "Saving Character...";


        try {

            // =================================================
            // CHARACTER DATA
            // =================================================

            const characterData = {

                first_name:
                    firstName,

                last_name:
                    lastName,

                display_name:
                    displayName,

                aliases:
                    aliases,

                gender:
                    gender,

                species:
                    species,

                height:
                    height,

                penis_size:
                    penisSize,

                hair_color:
                    hairColor,

                eye_color:
                    eyeColor,

                date_of_birth:
                    dateOfBirth,

                age:
                    age,

                zodiac_sign:
                    zodiacSign,

                birth_place:
                    birthPlace,

                residence:
                    residence,

                occupation:
                    occupation,

                affiliations:
                    affiliations,

                marital_status:
                    maritalStatus,

                profile_dump:
                    profileDump,

                profile_status:
                    "draft"

            };


            // =================================================
            // EXISTING AUTOSAVED DRAFT
            // =================================================

            if (currentCharacterId) {

                const {
                    data:
                        updatedCharacter,
                    error:
                        characterUpdateError
                } =
                    await supabaseClient
                        .from("characters")
                        .update(
                            characterData
                        )
                        .eq(
                            "id",
                            currentCharacterId
                        )
                        .select()
                        .single();


                if (
                    characterUpdateError
                ) {

                    console.error(
                        "Character update error:",
                        characterUpdateError
                    );

                    throw new Error(
                        "The character could not be saved."
                    );

                }


                console.log(
                    "Autosaved character updated:",
                    updatedCharacter
                );

            }


            // =================================================
            // NEW CHARACTER
            // =================================================

            else {

                const {
                    data:
                        existingCharacter,
                    error:
                        existingCharacterError
                } =
                    await supabaseClient
                        .from("characters")
                        .select("id")
                        .eq(
                            "first_name",
                            firstName
                        )
                        .eq(
                            "last_name",
                            lastName
                        )
                        .maybeSingle();


                if (
                    existingCharacterError
                ) {

                    console.error(
                        "Character lookup error:",
                        existingCharacterError
                    );

                    throw new Error(
                        "Could not check whether this character already exists."
                    );

                }


                if (
                    existingCharacter
                ) {

                    throw new Error(
                        `${firstName} ${lastName} already exists in the Character Vault.`
                    );

                }


                const {
                    data:
                        newCharacter,
                    error:
                        characterInsertError
                } =
                    await supabaseClient
                        .from("characters")
                        .insert(
                            characterData
                        )
                        .select()
                        .single();


                if (
                    characterInsertError
                ) {

                    console.error(
                        "Character creation error:",
                        characterInsertError
                    );


                    if (
                        characterInsertError.code ===
                        "23505"
                    ) {

                        throw new Error(
                            `${firstName} ${lastName} already exists in the Character Vault.`
                        );

                    }


                    throw new Error(
                        "The character could not be created."
                    );

                }


                currentCharacterId =
                    newCharacter.id;


                console.log(
                    "Character created:",
                    newCharacter
                );

            }


            // =================================================
            // PROFILE IMAGE
            // =================================================

            if (
                croppedImageBlob
            ) {

                const imageFileName =
                    `${firstName} ${lastName}.png`;


                const imagePath =
                    imageFileName;


                // ---------------------------------------------
                // CHECK EXISTING IMAGE
                // ---------------------------------------------

                const {
                    data:
                        existingFiles,
                    error:
                        fileCheckError
                } =
                    await supabaseClient
                        .storage
                        .from(
                            "character-images"
                        )
                        .list(
                            "",
                            {
                                search:
                                    imageFileName
                            }
                        );


                if (
                    fileCheckError
                ) {

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
                            file.name ===
                            imageFileName
                    );


                if (
                    exactFileExists
                ) {

                    throw new Error(
                        `The image "${imageFileName}" already exists in Character Images.`
                    );

                }


                // ---------------------------------------------
                // UPLOAD IMAGE
                // ---------------------------------------------

                const {
                    error:
                        uploadError
                } =
                    await supabaseClient
                        .storage
                        .from(
                            "character-images"
                        )
                        .upload(
                            imagePath,
                            croppedImageBlob,
                            {

                                contentType:
                                    "image/png",

                                upsert:
                                    false

                            }
                        );


                if (
                    uploadError
                ) {

                    console.error(
                        "Image upload error:",
                        uploadError
                    );

                    throw new Error(
                        "The character image could not be uploaded."
                    );

                }


                // ---------------------------------------------
                // GET PUBLIC URL
                // ---------------------------------------------

                const {
                    data:
                        publicURLData
                } =
                    supabaseClient
                        .storage
                        .from(
                            "character-images"
                        )
                        .getPublicUrl(
                            imagePath
                        );


                const profileImageURL =
                    publicURLData.publicUrl;


                // ---------------------------------------------
                // SAVE IMAGE URL
                // ---------------------------------------------

                const {
                    error:
                        imageUpdateError
                } =
                    await supabaseClient
                        .from(
                            "characters"
                        )
                        .update({

                            profile_image:
                                profileImageURL

                        })
                        .eq(
                            "id",
                            currentCharacterId
                        );


                if (
                    imageUpdateError
                ) {

                    console.error(
                        "Profile image database update error:",
                        imageUpdateError
                    );

                    throw new Error(
                        "The character was saved, but the profile image could not be linked."
                    );

                }

            }


            // =================================================
            // SUCCESS
            // =================================================

            alert(
                `${firstName} ${lastName} has been created!`
            );


            console.log(
                "Character successfully saved."
            );


            stopCharacterDraftAutosave();


            currentCharacterId =
                null;


            createCharacterForm.reset();


            croppedImageBlob =
                null;


            imagePreview.innerHTML =
                "<span>No Image</span>";


            removeImageButton.style.display =
                "none";


            profileImageInput.value =
                "";


            genderSymbol.textContent =
                "—";


            // Clear scent selector
            scentSelect.innerHTML =
                '<option value="">Select Scent</option>';


            scentSelect.disabled =
                true;


            // Return to vault
            showVault();


        } catch (error) {

            console.error(
                "Character creation failed:",
                error
            );


            errorElement.textContent =
                error.message ||
                "Something went wrong while saving the character.";


        } finally {

            saveButton.disabled =
                false;


            saveButton.textContent =
                originalButtonText;

        }

    }
);


// ============================================================
// START APPLICATION
// ============================================================

checkLogin();