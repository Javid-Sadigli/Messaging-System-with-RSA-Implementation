module.exports.GET_Home = (req, res, next) => {
    res.render('home', {page_title : "Home"});
};

module.exports.GET_Log_Out = (req, res, next) => {
    if (req.logged_in) 
    {
        req.session.user_id = undefined;
        req.info = "You have logged out successfully.";
        return next();
    }
    else 
    {
        req.error_message = "You have not logged in!";
        return next();
    }
}; 