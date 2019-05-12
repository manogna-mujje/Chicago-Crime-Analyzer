var express = require('express');
var router = express.Router();
var cntl = require('../controllers/index');
var modelMain = require("../models/modelMain");

//Dashboard views
router.get('/', cntl.getDashboard);
router.get('/district-analytics', cntl.getMapDashBoard);
router.get('/contact', cntl.getContact);
router.get('/admin', cntl.getAdminPortal)

//Route to DB operations
router.get('/system', cntl.displayOptionsforDB);
router.get('/insert', cntl.insertRecordsoptions);
router.get('/deleteRecords', cntl.deleteRecords);
router.get('/searchRecords', cntl.searchRecords);
router.get('/updateRecord', cntl.updateRecord);


router.get('/displayContents', modelMain.displayRecords);
//Route to upload csv file
router.get('/upload', modelMain.getUploadForm);
router.post('/upload', modelMain.uploadDataToDB);
router.post('/deleteRecords', modelMain.deleteRecords);
router.post('/searchRecords', modelMain.searchRecords);
router.post('/updateRecord', modelMain.updateRecord);


//Route to upload single record
router.get('/uploadSingleRecord', modelMain.getSingleRecordForm);
router.post('/uploadSingleRecord', modelMain.uploadSingleRecord);

//Route to submit feedback
router.post('/feedback', modelMain.feedbackSubmit);

module.exports = router;
