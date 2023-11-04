const bodyParser = require('body-parser');
const methodOverride = require('method-override');


module.exports.init = initExpress;
function initExpress(app) {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());     // daca nu scriu nu mai returneaza datele
    app.use(methodOverride());

// middleware generic care intra la fiecare call fiecare ruta
    app.use(function (req, res, next) {
        next();
    });
}