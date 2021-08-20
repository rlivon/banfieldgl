const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req,res) =>{
    //const links= await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    const links= await UserLog.find({username: [req.user._id]})
    .lean();
    res.render('links/add');
});

module.exports = router;