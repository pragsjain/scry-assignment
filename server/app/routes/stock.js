const stockController = require("./../../app/controllers/stockController");
const appConfig = require("./../../config/appConfig")


let setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/stocks`;

    // defining routes.

    app.get(baseUrl+'/all',stockController.getAllStock)

    app.get(baseUrl+'/view/:id',stockController.viewByStockId);

    app.post(baseUrl+'/:id/delete',stockController.deleteStock);

    app.put(baseUrl+'/:id/edit',stockController.editStock);

    app.post(baseUrl+'/create',stockController.createStock);

}// end setRouter function 

module.exports = {
    setRouter: setRouter
}