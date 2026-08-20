// ============================================================
// KADORAVERSE CHARACTER VAULT
// Application JavaScript
// ============================================================


// ------------------------------------------------------------
// ELEMENTS
// ------------------------------------------------------------

const loginPage = document.getElementById("login-page");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

const app = document.getElementById("app");
const logoutButton = document.getElementById("logout-button");


// ------------------------------------------------------------
// SHOW / HIDE APPLICATION
// ------------------------------------------------------------

function showApp() {
    loginPage.style.display = "none";
    app.style.display = "block";
}

function showLogin() {
    loginPage.style.display = "flex";
    app.style.display = "none";
}


// ------------------------------------------------------------
// CHECK CURRENT LOGIN SESSION
// ------------------------------------------------------------

async function checkLogin() {

    const { data, error } = await supabaseClient.auth.getSession();

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

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {

        console.error("Login error:", error);

        loginError.textContent = "Incorrect email or password.";

        return;
    }

    console.log("Successfully logged in:", data.user);

    showApp();
});


// ------------------------------------------------------------
// LOG OUT
// ------------------------------------------------------------

logoutButton.addEventListener("click", async function() {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error);
        return;
    }

    showLogin();
});


// ------------------------------------------------------------
// START APPLICATION
// ------------------------------------------------------------

checkLogin();

// ------------------------------------------------------------
// START APPLICATION
// ------------------------------------------------------------

checkLogin();


// ============================================================
// CHARACTER CREATION NAVIGATION
// ============================================================

const createCharacterPage =
    document.getElementById("create-character-page");

const createCharacterButton =
    document.getElementById("create-character-button");

const backToVaultButton =
    document.getElementById("back-to-vault");

const cancelCharacterButton =
    document.getElementById("cancel-character");


// ------------------------------------------------------------
// SHOW CHARACTER CREATION PAGE
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

function showCharacterVault() {

    app.style.display = "block";

    createCharacterPage.style.display = "none";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ------------------------------------------------------------
// CREATE CHARACTER BUTTON
// ------------------------------------------------------------

if (createCharacterButton) {

    createCharacterButton.addEventListener("click", function() {

        showCreateCharacter();

    });

}


// ------------------------------------------------------------
// BACK TO CHARACTER VAULT
// ------------------------------------------------------------

if (backToVaultButton) {

    backToVaultButton.addEventListener("click", function() {

        showCharacterVault();

    });

}


// ------------------------------------------------------------
// CANCEL CHARACTER
// ------------------------------------------------------------

if (cancelCharacterButton) {

    cancelCharacterButton.addEventListener("click", function() {

        showCharacterVault();

    });

}