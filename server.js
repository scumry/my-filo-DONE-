const express = require('express');
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
const md5 = require('md5')
const multer = require('multer');
const path = require('path');
const sqlite3 = require("sqlite3");
const cors = require("cors");
const db = new sqlite3.Database('user.db')
var jwt = require('jsonwebtoken');
const secret = 'users-auth'
const session = require('express-session');

app.use(express.json());
app.use(cors());


app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors())
const jsonParser = express.json()


app.listen(8000, function () {
  console.log('запуск на 8000 порту');
});


app.post("/users/register", jsonParser, (req, res) => {
  const user = { email, login, password } = req.body;
  const createNewUser = () => {
    const token = jwt.sign({
      email: user.email
    }, secret, {
      expiresIn: 86400
    })
    db.run(`INSERT INTO users (login, password , email  , token ) VALUES("${login}", "${md5(password)}" , "${email}", "${token}")`)



    db.get(`SELECT * FROM users WHERE login = "${login}"`, (err, data) => {
      res.status(201).json({
        data: {
          user: data,
          token
        }
      })
    })
  }





  db.get(`SELECT * FROM users WHERE email = "${email}"`, (err, data) => {
    if (err) {
      console.log('error: '.err)
    }
    if (data) {
      return res.status(409).json({
        error: "Пользователь с такой почтой уже существует"
      })
    }

    createNewUser()
  })
})


app.post('/users/login', async (req, res) => {
  const user = { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${md5(password)}'`;

  // запрос к бд по логину
  db.get(sql, (err, row) => {
    if (err) {
      console.log(err.message);
      res.status(500).send('Ошибка входа.');
    } else if (row === undefined) {
      res.status(401).send('Неверная почта или пароль.'); //
    } else {
      const token = jwt.sign({
        email: user.email
      }, secret, {
        expiresIn: 86000
      })
      return res.json({
        data: {
          user,
          token
        }
      })

    }
  });
});

app.post('/login/checkpassword', (req, res) => {
  const login = req.body.login;
  const password = md5(req.body.password);

  db.get('SELECT * FROM users WHERE login = ? AND password = ?', [login, password], (err, row) => {
    if (err || !row) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

app.get('/users/:login', (req, res) => {
  const login = req.params.login;

  db.all(`SELECT token FROM users WHERE login = ?`, login, (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(row);
  });
});

app.get('/check/email/login', (req, res) => {
  db.all(`SELECT  email , login , password , token FROM users `, (err, rows) => {
    res.json(rows)
  })
})

// const upload = multer({ dest: 'uploads/' });
// app.post('/upload', upload.single('file'), (req, res) => {
//   console.log(req.file.originalname)
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   return res.send('Готово')

// });

// app.post('/upload', (req, res) => {
//   const form = new formidable.IncomingForm();

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).send('Error parsing form data.');
//     }

//     const file = files.file;

//     if (!file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     const oldPath = file.path;
//     const newPath = 'uploads/' + file.name;

//     fs.rename(oldPath, newPath, (err) => {
//       if (err) {
//         return res.status(500).send('Error moving file.');
//       }

//       return res.send('Готово');
//     });
//   });
// });

app.post('/loading/files', (req, res) => {
  const { user_id, file_name, file_path, file_format } = req.body;

  db.run(`INSERT INTO files (user_id, file_name , file_path ,  file_format ) VALUES("${user_id}", "${file_name}" , "${file_path}", "${file_format}")`)

  res.send({
    user_id,
    file_name,
    file_path,
    file_format
  });
});


app.get('/Checkid/token/:token', (req, res) => {
  const token = req.params.token;

  db.all(`SELECT * FROM users WHERE token = ?`, token, (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(row);
  });
});


app.get('/id/:token', (req, res) => {
  const token = req.params.token;

  db.all(`SELECT id FROM users WHERE token = ?`, token, (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(row);
  });
});

app.get('/files/id/allinfo/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  db.all(`SELECT * FROM files WHERE user_id = ?`, user_id, (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(row);
  });
});


app.get('/files/id/allinfo/id/:id', (req, res) => {
  const id = req.params.id;

  db.all(`SELECT * FROM files WHERE id = ?`, id, (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    res.send(row);
  });
});



app.use(session({
  secret: '123',
  resave: false,
  saveUninitialized: true
}));

const authenticateUser = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), authenticateUser,(req, res) => {
  const file = req.file;

  db.run('INSERT INTO files (name) VALUES (?)', [file.originalname], function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'File uploaded successfully' });
    }
  });
});


