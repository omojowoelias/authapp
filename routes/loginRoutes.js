const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    const form = '<h1>Login Page</h1><form method="post" action="register">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="submit"></form>';

    res.send(form);
});

module.exports = router;