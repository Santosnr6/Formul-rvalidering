'use strict';

window.addEventListener('load', () => {
    initPage();

    console.log(getUsers());

    // localStorage.setItem('users', JSON.stringify(users));

    // const userArray = JSON.parse(localStorage.getItem('users'));

    // console.log(userArray);

    // const peach = userArray.find(user => user.username === 'princesspeach');

    // console.log(peach.password);
});

function initPage() {
    const loginBtn = document.querySelector('#loginBtn');
    const toRegBtn = document.querySelector('#toRegisterBtn');
    const regBtn = document.querySelector('#registerBtn');
    const backBtn = document.querySelector('#backBtn');
    const contentDiv = document.querySelector('#contentContainer');
    const regForm = document.querySelector('#registerForm');

    contentDiv.classList.add('d-none');
    regForm.classList.add('d-none');

    loginBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if(validateLogin()) {
            toggleDisplay(3); 
            initContent();       
        }
    });

    toRegBtn.addEventListener('click', (event) => {
        event.preventDefault();
        toggleDisplay(2);
    });

    regBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if(validateRegistration()) {
            toggleDisplay(1);   
        }
    });

    backBtn.addEventListener('click', (event) => {
        event.preventDefault();
        toggleDisplay(1);
    });
}

function toggleDisplay(action) {
    const formDiv = document.querySelector('#formContainer');
    const contentDiv = document.querySelector('#contentContainer');
    const loginForm = document.querySelector('#loginForm');
    const regForm = document.querySelector('#registerForm');

    if(action === 1) {
        formDiv.classList.remove('d-none');
        loginForm.classList.remove('d-none');
        regForm.classList.add('d-none');
        contentDiv.classList.add('d-none');

    } else if(action === 2) {
        formDiv.classList.remove('d-none');
        loginForm.classList.add('d-none');
        regForm.classList.remove('d-none');
        contentDiv.classList.add('d-none');
    } else if(action === 3) {
        formDiv.classList.add('d-none');
        contentDiv.classList.remove('d-none');
    }
}

function validateLogin() {
    console.log('validateLogin()');

    try {
        const username = document.querySelector('#username');
        const password = document.querySelector('#password');
        const users = getUsers();
        let user = {}
        
        if(!users.some(user => user.username === username.value)) {
            throw {
                'nodeRef' : username,
                'msg' : 'Ogiltigt användarnamn'
            }
        } else {
            user = users.find(user => user.username === username.value);

            if(user.password !== password.value) {
                throw {
                    'nodeRef' : password,
                    'msg' : 'Felaktigt lösenord'
                }
            }
        }
        const errorMsg = document.querySelector('#errorMsg');
        errorMsg.textContent = '';

        password.value = '';
        setUser(user.id);

        return true;
    } catch(error) {
        const errorMsg = document.querySelector('#errorMsg');

        if(error.nodeRef !== undefined) {
            error.nodeRef.value = '';
            error.nodeRef.focus();
            errorMsg.textContent = error.msg;
        } else {
            error.textContent = error;
            console.log(error);
        }
    }
}

function validateRegistration() {
    console.log('validateRegistration()');

    try {
        const username = document.querySelector('#uName');
        const password = document.querySelector('#pWord');
        const passwordAgain = document.querySelector('#pWordAgain');
        const users = getUsers();
        
        
        if(users.some(user => user.username === username.value)) {
            throw {
                'nodeRef' : username,
                'msg' : 'Användarnamn upptaget'
            }
        } else {
            if(password.value.length < 8) {
                throw {
                    'nodeRef' : password,
                    'msg' : 'Lösenordet måste innehålla minst 8 tecken'
                }
            } else if(password.value !== passwordAgain.value) {
                throw {
                    'nodeRef' : password,
                    'msg' : 'Du måste fylla i samma lösenord i båda fälten'
                }
            }
        }

        const errorMsg = document.querySelector('#errorMsg');
        errorMsg.textContent = '';
        

        addUser(username.value, password.value);
        username.value = '';
        password.value = '';
        passwordAgain.value = '';

        return true;
    } catch(error) {
        const errorMsg = document.querySelector('#errorMsg');
        const password = document.querySelector('#pWord');
        const passwordAgain = document.querySelector('#pWordAgain');

        if(error.nodeRef !== undefined) {
            error.nodeRef.value = '';
            error.nodeRef.focus();
            errorMsg.textContent = error.msg;
            password.value = '';
            passwordAgain.value = '';
        } else {
            error.textContent = error;
            console.log(error);
        }
        return false;
    }
}

function initContent() {
    const logoutBtn = document.querySelector('#logoutBtn');
    const deleteAccountBtn = document.querySelector('#deleteAccBtn');
    logoutBtn.addEventListener('click', logOut);
    deleteAccountBtn.addEventListener('click', () => {
        deleteAccount();
        logOut();
    });

    //Fyll gärna på med mer saker här rent innehållsmässigt...
}

function logOut() {
    toggleDisplay(1);
}

function getUsers() {
    console.log('getUsers()');

    try {
        const usersString = sessionStorage.getItem('users') || JSON.stringify([]);
        const users = JSON.parse(usersString);

        return users;
    } catch(error) {
        console.log(error);
        return [];
    }

}

function addUser(uName, pWord) {
    console.log('addUser()');

    try {
        const users = getUsers();
        let userId = 1;
        if(users.length > 0) {
            userId = users[users.length - 1].id + 1;
        }

        const newUser = {
            id : userId,
            username : uName,
            password : pWord 
        }

        users.push(newUser);

        sessionStorage.setItem('users', JSON.stringify(users));

    } catch(error) {
        console.log(error);
    }
    
}

function setUser(userId) {
    sessionStorage.setItem('currentUser', userId);
}

function deleteAccount() {
    console.log('deleteAccount()');

    try {
        let users = getUsers();
        const userId = JSON.parse(sessionStorage.getItem('currentUser'));
        users = users.filter(user => { return user.id !== userId });
        sessionStorage.setItem('users', JSON.stringify(users));

        sessionStorage.removeItem('currentUser');
    } catch (error) {
        console.log(error);
    }
}