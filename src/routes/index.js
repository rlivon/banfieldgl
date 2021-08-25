const { Router} = require('express');
const { routes } = require('../app');
const router = Router();
const UserLog = require('../models/UserLog');
const Photo = require('../models/Photo');
const cloudinary = require('cloudinary');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const helpers = require('../lib/helpers');
const { isLoggedIn } = require('../lib/auth');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fs = require('fs-extra');

router.use(session({
    secret: 'faztmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
  }));

  router.use(flash());
  router.use(passport.initialize());
  router.use(passport.session());

router.get('signin', isLoggedIn, async (req, res) => {
    const { username } = req.params;
    const { password } = req.password;
    res.render('signin');
    
});
 
router.post('signin',  isLoggedIn, async (req, res, done) => {
const { username, password } = req.body;
const user_in = await UserLog.find({username: username})
    .lean();
    if (user_in.length > 0) {
        const validPassword = await helpers.matchPassword(password, user_in[0].password)
        if (validPassword) {
                console.log('Holaaaa');
                //done(null, user_in[0], req.flash('success', 'Bienvenido ' + user_in.username));
            res.redirect('/images/add');
        } else {
            //done(null, false, req.flash('message', 'Password Incorrecta'));
            res.redirect('/');
        }
    } else {
            //done(null, false, req.flash('message', 'El Nombre de Usuario No Existe.'));
            res.redirect('/');

    };
});
//Categorias
router.get('/', async (req,res) =>{
    const photos = await Photo.aggregate([
        { $sort:{categoria: 1}
        },
        { $group :
            { 
                _id: "$categoria",
                title: { $min: "$title" },
                description: { $min: "$description" },
                imageURL: { $min: "$imageURL" },
                categoria: { $min: "$categoria" },
            }
        }
    ]);
    res.render('images_cat', {photos});
});

//Imagenes de la categoria elegida
router.get('/images/cat/:cat', async (req, res) => {
    const { cat } = req.params;
    const cate = cat;
    const photos = await Photo.find({categoria: cat}).lean();
    res.render('images', {photos,cate});
});

router.get('/image/add', async (req, res) => {
    const photos = await Photo.find()
    .lean();
    res.render('image_form', {photos});
});

router.get('/image/show/:photo_id', async (req, res) => {
    const { photo_id } = req.params;
    const photo = await Photo.findById(photo_id)
    .lean();
    res.render('image_show', photo);
});

router.get('/image/nuevo', async (req, res) => {
    const photos = await Photo.find()
    .lean();
    res.render('image_nuevo', {photos});
});

router.post('/image/nuevo', async (req, res) => {
    const { title, description, categoria, precio, urlVenta } = req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const newPhoto = new Photo({
        title,
        description,
        categoria,
        precio,
        urlVenta,
        imageURL: result.url,
        public_id: result.public_id
    });
    await newPhoto.save();
    await fs.unlink(req.file.path);
    res.redirect('/');
});

router.get('/image/delete/:photo_id', async (req, res) => {
    const { photo_id } = req.params;
    const photo = await Photo.findByIdAndDelete(photo_id)
    .lean();
    const result = await cloudinary.v2.uploader.destroy(photo._id);
    res.redirect('/image/add');
});

router.get('/image/editar/:photo_id', async (req, res) => {
    //const result = await cloudinary.v2.uploader.upload(req.file.path);
    const { photo_id } = req.params;
    const photo = await Photo.findById(photo_id)
    .lean();
    res.render('image_editar', photo);
});

router.post('/image/editar/:photo_id', async (req, res) => {
    const {_id, title, description, categoria, precio, urlVenta, imageURL, public_id} = req.body;
    const { photo_id } = req.params;
    const photoEdit = {
        title,
        description,
        categoria,
        precio,
        urlVenta,
        imageURL,
        public_id
    };
    
    if (typeof req.file == "undefined"){
        console.log("No se eligió imagen");
    } else {
        console.log("Se eligió imagen nueva");
        await cloudinary.v2.uploader.destroy(_id);
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        photoEdit.imageURL= result.url;
        photoEdit.public_id= result.public_id;
    }

    console.log(photo_id);
    console.log(title);
    console.log(description);
    console.log(categoria);
    console.log(precio);
    console.log(urlVenta);
    console.log(imageURL);
    console.log(public_id);

    if (typeof req.file == "undefined"){
        console.log("No se eligió imagen");
    } else
    {
        console.log(req.file)
        await fs.unlink(req.file.path);
    };

    await Photo.findOneAndUpdate( photo_id, photoEdit);

    res.redirect('/image/add');

});


router.get('/', async (req, res) => {
    res.render('index');
});

module.exports = router;