let localToken = localStorage.getItem('auth_token')
var token = JSON.parse(localToken);

let noReg = document.querySelector('.no-reg')

let reg = document.querySelector('.reg')

let LogForn = document.getElementById('uploadForm')


const loginform = document.querySelector('#my-form-login');


let checkLogin = document.getElementById('my-form')



let btnLeaveToken = document.getElementById('btn-clear-token')

const list1 = document.querySelector('.error-login')

loginform.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData1 = new FormData(loginform);
    const login = formData1.get('login-log')
    const password = formData1.get('password-log')


    let responceEmailLogin = await fetch(`http://localhost:8000/check/email/login`, {
        method: 'GET',
    })
    const contentEmailLogin = await responceEmailLogin.json();

    contentEmailLogin.map(a => {
        console.log(contentEmailLogin)
        console.log(login, password)

        async function CheckPassword(login, password) {
            let checkPassword;
            await fetch(`http://localhost:8000/login/checkpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            })
                .then(response => response.json())
                .then(result => {
                    console.log(checkPassword = result);
                })

            if (a.login === login && checkPassword) {

                let inportToken = await fetch(`http://localhost:8000/users/${login}`, {
                    method: 'GET',
                })

                const contentInportToken = await inportToken.json();

                contentInportToken.map(a => {
                    localStorage.setItem("auth_token", `"${a.token}"`)
                    console.log(localStorage.getItem('auth_token'))

                    window.location = window.location
                })

            } else {
                list1.innerHTML = '<p class="error-txt">Неверная почта или пароль</p>';
            }
        }
        CheckPassword(login, password)

    })

})






document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];





    if (!file) {
        alert('Выберите файл.');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);

    console.log(file)
    
    fetch('http://localhost:8000/upload', { method: 'POST', body: formData })
        .then(response => response.text())
        .then((result) => {
            alert(result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });


    let checkId = await fetch(`http://localhost:8000/Checkid/token/${token}`, {
        method: 'GET',
    })

    const contentId = await checkId.json();

    let user_id;
    let file_name = file.name
    let file_path = `uploads/${file_name}`
    let file_format = file.type

    console.log(user_id, file_name, file_path, file_format)

    contentId.map(async a => {
        user_id = a.id

        
        await fetch('http://localhost:8000/loading/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, file_name, file_path, file_format }),
        });
    })
});







console.log(localStorage.getItem('auth_token'))



btnLeaveToken.addEventListener('click', () => {

    localStorage.clear();
    window.location = window.location
})

if (token == null) {

    noReg.style.display = 'flex';
    reg.style.display = 'none'
    LogForn.style.display = 'none'


} else {
    noReg.style.display = 'none';
    reg.style.display = 'flex';
    LogForn.style.display = 'flex';
    checkLogin.style.display = 'none';
    loginform.style.display = 'none'
}


