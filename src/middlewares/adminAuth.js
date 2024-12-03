const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const newToken = token.replace("Bearer ","");
    const decode = jwt.verify(newToken, "xeEo2M0ol8CeWr7Nw2g2GjH8QEUK4dyyKCHi4TYJK6znm5fuAHIIPHSQ5YvdVcLlnaxppN64xK6xbhRileWvIlzCEqrBMCiITD8z")
    if(!decode){
      return res.status(401).json({ error: "Please Authenticate" })
    }
    next()
  } catch (err) {
    res.status(403).json({ error: "Please Authenticate" })
  }
}

module.exports = adminAuth;