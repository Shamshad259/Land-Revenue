const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(401).send({ error: 'Access Denied' });
        } 
        next();
    }
}

module.exports = roleCheck;