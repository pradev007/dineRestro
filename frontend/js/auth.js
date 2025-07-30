let currentUser = null;
let authToken = null;

async function signIn() {
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;
    const userType = document.getElementById('user-type').value;

    try {
        const response = await fetch('/api/auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role: userType })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            currentUser = data.user;
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            document.getElementById('auth-link').innerText = 'Sign Out';
            document.getElementById('auth-link').onclick = signOut;
            showScreen('menu');
        } else {
            document.getElementById('signin-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('signin-error').style.display = 'block';
    }
}

async function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('signup-email').value;

    try {
        const response = await fetch('/api/auth/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email, role: 'user' })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            showScreen('signin');
        } else {
            document.getElementById('signup-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('signup-error').style.display = 'block';
    }
}

function signOut() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('authToken');
    document.getElementById('auth-link').innerText = 'Sign In';
    document.getElementById('auth-link').onclick = () => showScreen('signin');
    showScreen('onboarding');
}