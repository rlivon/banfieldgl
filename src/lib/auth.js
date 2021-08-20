module.exports = {

    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/image/add');
    },

    isNotLoggedIn (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/image_show');
    }
};