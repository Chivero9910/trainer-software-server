const { expressjwt: jwt } = require("express-jwt");

// Middleware para pasar el token al FE
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  
  getToken: (req) => {
    
    if (req.headers === undefined || req.headers.authorization === undefined) {
      console.log("No hay Token");
      return null;
    }

    const tokenArr = req.headers.authorization.split(" ");
    const tokenType = tokenArr[0];
    const token = tokenArr[1];

    if (tokenType !== "Bearer") {
      return null;
    }

    return token;
  },
});

module.exports = isAuthenticated;