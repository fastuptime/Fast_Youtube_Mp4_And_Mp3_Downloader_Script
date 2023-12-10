const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const colors = require('colors');
const ytdl = require('ytdl-core');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/main_page', express.static('./views/main_page'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    let {
        domain,
        type
    } = req.body;
    if (!domain) return res.send(`<center><h1>Youtube linki giriniz.</h1></center>`);
    if (!ytdl.validateURL(domain)) return res.send(`<center><h1>Geçersiz Youtube linki.</h1></center>`);
    id = Math.floor(Math.random() * 1000000);
    
    new Promise(async (resolve, reject) => {
        await ytdl(domain, {
            format: type === 'mp3' ? 'mp3' : 'mp4',
            quality: 'highestvideo'
        }).pipe(res.status(200).setHeader('Content-Disposition', `attachment; filename="${id}.${type === 'mp3' ? 'mp3' : 'mp4'}"`)).on('finish', () => {
            resolve();
        }).on('error', err => {
            reject(err);
        });
    }).catch(err => {
        console.log(err);
        try {
            res.redirect('/');
        } catch (e) {
            console.log(e);
        }
    });
});

app.listen(80, () => {
    console.log('Fast Videos Aktif'.green);
});