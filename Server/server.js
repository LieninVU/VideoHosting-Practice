const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');


const session = require('express-session');
const { ConnectSessionKnexStore } = require('connect-session-knex');
const { error } = require('console');
const { NOTINITIALIZED } = require('dns');



// подключаю Knex к MySQL
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'video_hosting',
    port: 3306
  }
});

// Настройка хранилища сессий
const sessionStore = new ConnectSessionKnexStore({ // Использование корректного конструктора
  knex: knex,
  tablename: 'sessions',
  // Убедитесь, что таблица 'sessions' создана с правильной схемой:
  // CREATE TABLE `sessions` (
  //     `sid` VARCHAR(255) NOT NULL,
  //     `sess` JSON NOT NULL,
  //     `expire` DATETIME NOT NULL,
  //     PRIMARY KEY (`sid`)
  // );
  // Если вы хотите, чтобы KnexSessionStore сам создавал таблицу,
  // то `createtable: true` должно быть в опциях конструктора.
  createtable: false, // Отключите это, если вы создаете таблицу вручную, или поставьте true, чтобы Knex ее создал
  clearInterval: 1000 * 60 * 15 // очистка каждые 15 минут
});


const PORT = 3001;
const videoFilePath = './VideoFiles/'
const app = express();

app.use(cors({
  origin: `http://localhost:3000`,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: false,
    sameSite: false
  }
}));
app.use(fileUpload());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'video_hosting',
    port: 3306
});


connection.connect(err => {
  if(err){
    console.log(err);
    console.log("EEEERRRRRROR");
  }
  else{
    console.log('it\'s ok');
  }
})

app.get('/', (req, res) => {
  connection.query('SELECT * FROM Accounts', (err, results) => {
    if(err){
      return res.status(500).json({ error: err.message});
    }
    res.json(results);
  })
});


app.post('/api/auth', async (req, res) => {
  if (!req.body || !req.body.login || !req.body.password) {
    console.error('Missing login or password in request body:', req.body);
    return res.status(400).json({ error: 'Missing login or password' });
  }
  
  const { login, password } = req.body; // Получаем login и password из req.body
  
  try {
    const loginExists = await isLoginExists(login); // Теперь login определен
    if (!loginExists) {
      // Если логин не существует, возвращаем 401 Unauthorized
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Error checking login existence:', error);
    return res.status(500).json({ success: false, message: 'Server error during login check.' });
  }

  const sql = 'SELECT * FROM Accounts WHERE login = ? AND password = ?';
  const values = [login, password]; // Используем переменные login и password
  connection.query(sql, values, (err, results) => {
    if(err){
        return res.status(500).json({error: err.message})
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' }); // 401 Unauthorized
    }

    const user = results[0];
    req.session.userId= user.id;
    req.session.userLogin = user.login;

    req.session.save(err => {
      if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ success: false, message: 'Session error.' });
      }
      return res.json({ success: true, message: 'Login successful!', user: { id: user.id, login: user.login } });
    });
  });
});

app.post('/api/register', async (req, res) => {
  if (!req.body || !req.body.login || !req.body.password) {
    console.error('Missing login or password in request body:', req.body);
    return res.status(400).json({ error: 'Missing login or password' });
  }
  if(await isLoginExists(req.body.login)){
    return res.json({ success: false, error: 'Login already exists' });
  }

  const sql = 'INSERT INTO Accounts (login, password, username) VALUES(?,?,?);'
  const values = [req.body.login, req.body.password, req.body.username];
  console.log(JSON.stringify(req.body))
  connection.query(sql, values, (err, results) =>{
    if(err){
      return res.status(500).json({ error: err.message});
    }
    const newUserId = results.insertId;
    req.session.userId= newUserId;
    req.session.userLogin = req.body.login;
    req.session.save(err => {
      if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ success: false, message: 'Session error.' });
      }
      res.json({ success: true, message: 'Registration successful!', userId: results.insertId });
    });
  })
})



app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if(err){
      console.log('Logout error:', err.message);
      return res.status(500).json({success: false, message: 'Could not log out.'});
    }
    res.clearCookie('connect.sid');
    res.json({success: true, message: 'Logged out successfully.'});
  });
});


function isAuthenticated(req, res, next){
  if(req.session.userId){
    next();
  }
  else{
    res.status(401).json({success: false, message: 'Unauthorizaed. Plesae log in.'});
  }
}



app.get('/api/protected-data', isAuthenticated, (req, res) => {
  res.json({ success: true, message: `Welcome, user ${req.session.userLogin}! This is protected data.` });
});

app.get('/api/auth-status', (req,res) => {
  if (req.session.userId) {
    // Пользователь аутентифицирован
    res.json({ isAuthenticated: true, userLogin: req.session.userLogin });
  } else {
    // Пользователь не аутентифицирован
    res.json({ isAuthenticated: false, userLogin: null }); // userLogin должен быть null или undefined
  }
});



function isLoginExists(login){
  return new Promise((resolve, reject) =>{
    const sql = 'SELECT * FROM Accounts WHERE login = ?';
    const value = [login];
    connection.query(sql, value,(err, results) =>{
      if(err) reject(err);
      else  resolve(results.length > 0);
    });
  });
};

app.get('/api/videos', (req, res) => {
  console.log('API/VIDEOS');
  const sql = `SELECT 
    videos.id,
    videos.title, 
    videos.description, 
    videos.views_count, 
    videos.likes_count,
    videos.filename,
    Accounts.username 
FROM videos
INNER JOIN Accounts ON videos.user_id = Accounts.id `;
  
  connection.query(sql, (err, results) => {
    if(err){
      return res.status(500).json({success: false, error: err.message})
    }
    const videos = results.map(video => ({
      title: video.title,
      description: video.description,
      viewsCount: video.views_count,
      username: video.username,
      filename: video.filename
    }));
    console.log(videos[2].description)
    return res.status(200).json({success: true, videos: videos});
  })
})

app.post('/api/upload', async (req, res) =>{
  if(!req.files || !req.body.title || !req.body.description){
    return res.status(400).json({error: 'Server didnt have the file'});
  }
  const file = req.files.videoFile;
  const title = req.body.title;
  const description = req.body.description;
  const accountId = req.session.userId;
  const sqlAddVideo = 'INSERT INTO videos (user_id, title, description, filename, filepath) VALUES (?,?,?,?,?)';
  // const sqlGetUserID = 'SELECT id FROM Accounts WHERE login = ? VALUES(?)';
  let values;
  console.log(title);
  console.log(description);
  console.log(accountId);
  console.log(file.name);
  console.log(file.mimetype);
  console.log(file.size);
  console.log(file.path);
  
  try{
    await fs.mkdir(videoFilePath, {recursive: true});
    const fileName = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(videoFilePath, fileName);
    await file.mv(filePath);
    console.log("SUCSESSSSSSSSSSSSS");
    values = [accountId, title, description, fileName, filePath];
    
  }catch (err){
    console.error('Upload Error: ', err);
  }

  // await connection.query(sqlGetUserID, req.body.login, (err, results) =>{
  //   if(err){
  //     res.status(500).json({error: 'Authorization Error', message: err.cause.message})
  //   }

  // });
  connection.query(sqlAddVideo, values, (err, results) => {
    if(err){
      res.status(500).json({error: 'Upload Video Error', message: err.cause.message})
    }
    return res.json({uploaded: true, message: 'You Uploaded the Video'});
  })
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});