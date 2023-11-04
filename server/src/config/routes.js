const path=require('path');

module.exports.init=initRoutes;
function initRoutes(app){
    // console.log('DIRNAME',dirname);
    const routesPath=path.join(__dirname,'..','routes');  //path absolut
    const routes=['users', 'books'];   //adaug aici pt rute altfel nu le vede si da err
    // console.log('routesPath',routesPath);
    routes.forEach((route)=>{
        app.use(require(routesPath+'/'+route));
    });
}
