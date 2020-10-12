const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const sensex_csv_data = require('./sensex_csv_data.json')

//Importing the model here 
const StockModel = mongoose.model('Stock')

// let getAllStock = (req, res) => {
//     StockModel.find()
//         .select('-__v -_id')
//         .lean() //make it plain javascript object,not mongoose object
//         .exec((err, result) => { //trying to execute this function
//             if (err) {
//                 logger.error(err, 'stockController: getAllStock()', 5)
//                 let apiResponse = response.generate(true, 'Failed To Find Stocks', 500, null)
//                 res.send(apiResponse)
//             } else if (result == undefined || result == null || result == '') {
//                 logger.error('No Stock Found', 'stockController: getAllStock()', 5)
//                 let apiResponse = response.generate(true, 'No Stock Found', 404, null)
//                 res.send(apiResponse)
//             } else {
//                 let apiResponse = response.generate(false, 'All Stock Details Found', 200, result)
//                 res.send(apiResponse)
//             }
//         })
// }// end get all stocks

let getAllStock = (req, res) => {
    if(parseInt(req.query.numberOfStockPerPage)==0 && parseInt(req.query.page)==0){
        StockModel.find({ 'groupId': req.params.groupId })
            .select('-__v -_id')
            .lean() //make it plain javascript object,not mongoose object
            .exec((err, result) => { //trying to execute this function
                if (err) {
                    logger.error(err, 'stockController: getAllStock()', 5)
                    let apiResponse = response.generate(true, 'Failed To Find Stocks', 500, null)
                    res.send(apiResponse)
                } else if (result == undefined || result == null || result == '') {
                    logger.error('No Stock Found', 'stockController: getAllStock()', 5)
                    let apiResponse = response.generate(true, 'No Stock Found', 404, null)
                    res.send(apiResponse)
                } else {
                    StockModel.count({ 'groupId': req.params.groupId }, function( err, count){
                        console.log( "Number of stock:", count );
                        let data={}
                        data.count=count;
                        data.stockList=result;
                        let apiResponse = response.generate(false, 'All Stock Details Found', 200, data)
                        res.send(apiResponse) ; 
                    })
                }
            })
    }   
    else
    {
        getAllStockWithPagination(req, res)
    }
}// end get all stocks

let getAllStockWithPagination = (req, res) => {
    console.log('getAllStockWithPagination');
    let numberOfStockPerPage=parseInt(req.query.numberOfStockPerPage);
    let page=parseInt(req.query.page);
    console.log(page,numberOfStockPerPage);
    if(numberOfStockPerPage)
    StockModel.find({ 'groupId': req.params.groupId })
        .sort({date: -1})
        .select('-__v -_id')
        .lean() //make it plain javascript object,not mongoose object
        .skip(numberOfStockPerPage * (page - 1)).limit(numberOfStockPerPage )
        .exec((err, result) => { //trying to execute this function
            if (err) {
                logger.error(err, 'stockController: getAllStock()', 5)
                let apiResponse = response.generate(true, 'Failed To Find Stocks', 500, null)
                res.send(apiResponse)
            } else if (result == undefined || result == null || result == '') {
                logger.error('No Stock Found', 'stockController: getAllStock()', 5)
                let apiResponse = response.generate(true, 'No Stock Found', 404, null)
                res.send(apiResponse)
            } else {
                StockModel.count({ 'groupId': req.params.groupId }, function( err, count){
                    console.log( "Number of stock:", count );
                    let data={}
                    data.count=count;
                    data.stockList=result;
                    let apiResponse = response.generate(false, 'All Stock Details Found', 200, data)
                    res.send(apiResponse) ; 
                })
            }
        })
}// end get all stocks

/**
 * function to get single stock.
 */
let viewByStockId = (req, res) => {

    StockModel.findOne({ 'id': req.params.id }, (err, result) => {

        if (err) {
            logger.error(err, 'stockController: viewByStockId()', 5)
            let apiResponse = response.generate(true, 'Failed To Find Stock Details', 500, null)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            logger.error('No Stock Found', 'stockController: viewByStockId()', 5)
            let apiResponse = response.generate(true, 'No Stock Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Stock Details Found', 200, result)
            res.send(apiResponse)
        }
    })
}


/**
 * function to edit stock by admin.
 */
let editStock = (req, res) => {

    // console.log('id',id);
    editStock=req.body
    //console.log(req);
    //  console.log('title',req.body['title']);
     console.log('watchers->',req.body.watchers);

    console.log('édit Stock->',editStock)
    StockModel.findOneAndUpdate({ 'id': req.params.id }, {$set:editStock}, { new: true }).exec((err, result) => {
        if (err) {
            logger.error(err, 'stockController: editStock()', 5)
            let apiResponse = response.generate(true, 'Failed To Edit stock', 500, null)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            logger.error('No Stock Found', 'stockController: editStock()', 5)
            let apiResponse = response.generate(true, 'No Stock Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Stock Details Found', 200, result)
            res.send(apiResponse)
        }
    })
}


let deleteStock = (req, res) => {
    StockModel.remove({ 'id': req.params.id }, (err, result) => {
        if (err) {
            logger.error(err, 'stockController: deleteStock()', 5)
            let apiResponse = response.generate(true, 'Failed To Delete Stock', 500, null)
            res.send(apiResponse)
        } else if (result == undefined || result == null || result == '') {
            logger.error('No Stock Found', 'stockController: deleteStock()', 5)
            let apiResponse = response.generate(true, 'No Stock Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Stock is Deleted Successfully', 200, result)
            res.send(apiResponse)
        }
    })
}

let createStock = (req, res) => {
    let id = shortid.generate()
    //console.log('id',id);
    let newStock = new StockModel({
        id: id,
        open: req.body.open,
        close: req.body.close,
        low: req.body.low,
        high: req.body.high,
        date: time.now(),
    }) // end new stock model

    newStock.save((err, result) => {
        if (err) {
            logger.error(err.message, 'stockController: createStock', 10)
            let apiResponse = response.generate(true, 'Failed to create new Stock', 500, null)
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, 'All Stock Details Found', 200, result)
            res.send(apiResponse)   
        }        
    }) // end new stock save
}

let insertManyStock= (req, res) => {
    //let id = shortid.generate()
    sensex_csv_data.forEach(element => {
        element.id=shortid.generate()
    });
    StockModel.insertMany(sensex_csv_data,(err, result) => {
        if (err) {
            logger.error(err.message, 'stockController: createStock', 10)
            let apiResponse = response.generate(true, 'Failed to insert csv Stock', 500, null)
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, 'All Stock Inserted from csv', 200, result)
            res.send(apiResponse)   
        }        
    }) // end new stock save
}

module.exports = {
    getAllStock: getAllStock,
    createStock: createStock,
    viewByStockId: viewByStockId,
    editStock: editStock,
    deleteStock: deleteStock,
    insertManyStock: insertManyStock
}