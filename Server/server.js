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
    maxAge: 1000 * 60,
    httpOnly: true,
    secure: false,
    sameSite: false
  }
}));
app.use(fileUpload());




app.use('/video', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  express.static(videoFilePath)(req, res, next);
});



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
  
  // try {
  //   const loginExists = await isLoginExists(login); // Теперь login определен
  //   if (!loginExists) {
  //     // Если логин не существует, возвращаем 401 Unauthorized
  //     return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  //   }
  // } catch (error) {
  //   console.error('Error checking login existence:', error);
  //   return res.status(500).json({ success: false, message: 'Server error during login check.' });
  // }

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




function validateUserSession(userId, callback){
  const sql = 'SELECT id FROM Accounts WHERE id = ?';
  connection.query(sql, [userId], (err, results) => {
    if(err){
      console.log('Error validation user session: ', err);
      callback(false);
    }else{
      callback(results.length > 0);
    }
  })
}

function isAuthenticated(req, res, next){
  console.log(req.session.userId);

  if(!req.session || !req.session.userId){
    return res.status(401).json({success: false, message: 'Unauthorized. Please log in.', isAuthenticated: false});
  }
  if(req.session.cookie.expires && req.session.cookie.expires < Date.now()){
    req.session.destroy((err) =>{
      if(err){
        console.log('Unsuccessfuly Destroying the Session: ', err);
      }
      res.clearCookie('connect.sid');
      return res.status(401).json({success: false, message: 'Session invalid. Please log in again.', isAuthenticated: false});
    })
    return;
  }

  console.log(req.session);
  console.log(req.session.userId);
  validateUserSession(req.session.userId, (isValid) => {
    if(!isValid){
      req.session.destroy(err =>{
        if(err){
          console.log('Error of destroing invalid session: ', err);
        }
        res.clearCookie('connect.sid');
        return res.status(401).json({success: false, message: 'Session invalid. Please log in again.', isAuthenticated: false});
      })
    } else{
      next();
    }
  })
}


app.get('/api/protected-data', isAuthenticated, (req, res) => {
  res.json({ success: true, message: `Welcome, user ${req.session.userLogin}! This is protected data.` });
});

app.get('/api/auth-status', isAuthenticated, (req,res) => {
  res.json({ isAuthenticated: true, userLogin: req.session.userLogin });
  
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
      likesCount: video.likes_count,
      username: video.username,
      filename: video.filename
    }));
    console.log(videos[2].description)
    return res.status(200).json({success: true, videos: videos});
  })
})


app.get('/api/video/:link', async (req, res) =>{
  const link = req.params.link;
  const sqlAddViews = 'UPDATE videos SET views_count = views_count + 1 WHERE filename = ?';
  const sqlCountLikes = `UPDATE video_hosting.videos v
SET likes_count = (
	SELECT COUNT(*)
    FROM video_hosting.likes l
    WHERE v.id = l.video_id
)
WHERE filename = ?;
`;
  const sql = `SELECT 
    videos.id,
    videos.title, 
    videos.description, 
    videos.views_count, 
    videos.likes_count,
    videos.filename,
    Accounts.username 
FROM videos
INNER JOIN Accounts ON videos.user_id = Accounts.id
WHERE videos.filename = ?`;

  connection.query(sqlAddViews, [link], (err, results) =>{
    if(err){
      console.log('Unsucsessful adding view: ', err.message);
    }
    console.log('We added views');
  })

  connection.query(sqlCountLikes, [link], (err, results) => {
    if(err){
      console.log('Failed Couting the Likes', err.message);
    }
    console.log('We Count Likes');
  })

  connection.query(sql, [link], (err, results) => {
    if(err){
      return res.status(500).json({success: false, error: err.message})
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Видео не найдено' });
    }
    let result = results[0];
    fs.readFile(`${videoFilePath}${result.filename}`, (err) => {
      if(err){
        return res.status(404).json({success: false, message: 'We Dont`t Found The Video'});
      }
    });
    const video = {
      channelName: result.username,
      title: result.title,
      description: result.description,
      views: result.views_count,
      likes: result.likes_count,
      videofile: `${req.protocol}://${req.get('host')}/video/${result.filename}`,
      fileName: result.filename
    }
    return res.status(200).json({success: true, video: video});
  })

})


app.get('/video/:filename', (req, res) => {
  const fileName = req.params.filename;
  const videopath = path.join(videoFilePath, fileName);
  fs.access(videopath, fs.constants.F_OK, (err) => {
    if(err){
      console.log('File isn`t Found');
      return res.status(404).json({success: false, error: err.message});
    }
    res.sendFile(path.resolve(videopath));
  });
});


app.post('/api/upload', isAuthenticated, async (req, res) =>{
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
      return res.status(500).json({error: 'Upload Video Error', message: err.cause.message})
    }
    return res.json({uploaded: true, message: 'You Uploaded the Video'});
  })
});



app.post('/api/addLike/:filename', isAuthenticated, (req, res) => {
  const userLogin = req.session.userLogin;
  const filename = req.params.filename;
  const sql = `INSERT INTO video_hosting.likes(user_id, video_id)
SELECT a.id, v.id
FROM video_hosting.accounts a
JOIN video_hosting.videos v
ON a.login = ? AND v.filename = ?;`

  console.log('User login from session:', userLogin);
  console.log('Filename from params:', filename);
  connection.query(sql, [userLogin, filename], (err, results) => {
    if(err){
      return res.status(500).json({success: false, message: err.message})
    }
    console.log('You Add Like Successfuly');
    return res.status(200).json({success: true, message: 'You Add Like Successfuly'})

  })

})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});