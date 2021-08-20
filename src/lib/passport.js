// 'use strict';

// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// // const nodemailer = require('nodemailer');
// const UserLog = require('../models/UserLog');
// const helpers = require('./helpers');

// passport.use('local.signin', new LocalStrategy({
//   usernameField: 'username',
//   passwordField: 'password',
//   passReqToCallback: true
// }, async (req, username, password, done) => {
//   const rows = await UserLog.find( { username: username } )
//   .lean(); 

//   if (rows.length > 0) {
//     const validPassword =  helpers.matchPassword(password, rows[0].password)
//     if (validPassword) {
//       done(null, rows, req.flash('success', 'Bienvenido ' + rows[0].fullname));
//     } else {
//       done(null, false, req.flash('message', 'Password Incorrecta'));
//     }
//   } else {
//     return done(null, false, req.flash('message', 'El Nombre de Usuario No Existe.'));
//   };
// }));

// // passport.use('local.signup', new LocalStrategy({
// //   usernameField: 'username',
// //   passwordField: 'password',
// //   passReqToCallback: true
// // }, async (req, username, password, done) => {

// //   const { fullname } = req.body;
// //   let newUser = {
// //     fullname,
// //     username,
// //     password
// //   };
// //   newUser.password = await helpers.encryptPassword(password);
// //   // Saving in the Database
// //   const result = await pool.query('INSERT INTO users SET ? ', newUser);
// //   newUser.id = result.insertId;
// //   return done(null, newUser);
// // }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const rows = await UserLog.find( { id: _id } )
//   .lean(); 
//   done(null, rows[0]);
// });

const UserLog = require('../models/UserLog');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await UserLog.find( { username: username } )
  .lean(); 
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.fullname));
    } else {
      done(null, false, req.flash('message', 'Password Incorrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'El Nombre de Usuario No Existe.'));
  }
}));

// passport.use('local.signup', new LocalStrategy({
//   usernameField: 'username',
//   passwordField: 'password',
//   passReqToCallback: true
// }, async (req, username, password, done) => {

//   const { fullname } = req.body;
//   let newUser = {
//     fullname,
//     username,
//     password
//   };
//   newUser.password = await helpers.encryptPassword(password);
//   // Saving in the Database
//   const result = await pool.query('INSERT INTO users SET ? ', newUser);
//   newUser.id = result.insertId;
//   return done(null, newUser);
// }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await UserLog.find( { _id: id } ).lean(); 
// const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});

