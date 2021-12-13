//middleware to test if user is admin



const manager = (req, res, next) => {
    if (req.user.manager) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

module.exports = manager;