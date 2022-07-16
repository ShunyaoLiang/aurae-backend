import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { homePageData, Profiledata, reachOutNotif, setMood } from './functions';
import config from './config.json';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Mount static files in public to be accessible from the prefix static.
// Don't touch this it works ???
app.use('/static', express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/setMood', (req, res, next) => {
  const { uId, mood } = req.query;
  const user = parseInt((uId as string));
  const userMood = parseInt((mood as string))
  res.json(setMood(user, userMood));
});

app.get('/summaryPage', (req, res, next) => {
  let { token } = req.query;
  const user = parseInt((token as string));
  res.json(homePageData(user));
});

app.get('/userProfile', (req, res, next) => {
  let { token, uId } = req.query;
  const userToken = parseInt((token as string));
  const user = parseInt((uId as string));
  res.json(Profiledata(userToken, user));
});

app.get('/reachOut', (req, res, next) => {
  let { token } = req.query;
  const userToken = parseInt((token as string));
  res.json(reachOutNotif(userToken));
});

// The home page.
app.get('/', (req, res) => {
  const token = req.query.token;
  res.render('index', {
    friends: [
      {
        uId: 1000,
        email: 'Amy@gmail.com',
        password: 'password',
        username: 'Amy',
        mood: [5,4,5],
        comment: 'Hello, I am Amy'
      },
      {
        uId: 1001,
        email: 'Deon@gmail.com',
        password: 'password',
        username: 'Deon',
        mood: [1,1,1],
        comment: 'Hi guys, my name is Deon'
      },
      {
        uId: 1002,
        email: 'Emily@gmail.com',
        password: 'password',
        username: 'Emily',
        mood: [4,4,3],
        comment: 'I am probably coding right now '
      },
      {
        uId: 1003,
        email: 'Ava@gmail.com',
        password: 'password',
        username: 'Ava',
        mood: [5,2,5],
        comment: 'Keep smiling' // lol idk
      }
    ]
  });
});

// User profiles.
app.get('/users/:id', (req, res) => {
  const token = parseInt(req.query.token as string);
  const id = parseInt(req.params.id);
  const profile = Profiledata(token, id);
  res.render('user', { id: id, profile: profile });
});

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});
