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
    loginPage.hidden = true;
    app.hidden = false;
}

function showLogin() {
    loginPage.hidden = false;
    app.hidden = true;
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