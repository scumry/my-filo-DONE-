let form = document.getElementById('my-form')

const list = document.querySelector('.error-register')


form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('email')
    const login = formData.get('login')
    const password = formData.get('password')

    if (!email || !login || !password) {
        list.innerHTML = '<p class="error-txt">Укажите все данные</p>'
        return;
    }

    fetch('http://localhost:8000/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, login, password }),
        });
})

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    return res.send('Успешно!');
  });