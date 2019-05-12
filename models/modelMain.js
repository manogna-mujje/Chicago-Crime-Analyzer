var Crime = require("../models/mongoSchema").Crime;
var csv = require('fast-csv');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var path = require('path');
var Feedback = require("../models/mongoSchema").Feedback;

function getUploadForm(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'upload.html'));
}

function uploadDataToDB(req, res) {
    if (!req.files) {
        //return res.status(400).send('No files were uploaded');
        res.render('error.ejs', {data: 'No files were uploaded'});
    }

    var crimeFile = (!!req.files && !!req.files.file) ? req.files.file : null;
    var crimeList = [];
    if (crimeFile){
    csv
        .fromString(crimeFile.data.toString(), {
            headers: true,
            ignoreEmpty: true,
            quote: '\\',
            delimiter: ','
            // character to use to escape values that contain a delimiter. If you set to null then all quoting will be ignored
            , quote: '"'
            // The character to use when escaping a value that is quoted and contains a quote character
            , escape: '"'
            // discard columns that do not map to a header.
            , discardUnmappedColumns: true
            // consider empty lines with too few fields as error
            , strictColumnHandling: false
        })
        .on("data-invalid", function(data){
            //do something with invalid row
            res.render('error.ejs', {data: 'Validation Error'});
        })
        .on("data", function (data) {
            data['_id'] = new mongoose.Types.ObjectId();
            crimeList.push(data);
        })
        .on("end", function () {
            Crime.insertMany(crimeList, function (err, documents) {
                if (err) {
                    //return res.status(400).send(err.errors.ID.message);
                    res.render('error.ejs', {data: err.errors.ID.message});
                }
                else {
                    Crime.find({}, {}, function (err, docs) {
                        if (err) {
                            // throw err;
                            //res.status(400).send("Error in displaying records");
                            res.render('error.ejs', {data: 'Error in displaying records'});
                        }
                        else {
                            res.render('crimelist', {
                                "crime": docs
                            });
                        }
                    });
                }
            });
        }).on('error', function(error) {
            res.render('error.ejs', {data: 'Error in uploading new crimes'});
            //return res.fail('The csv file is invalid!');
         });
    }
}

function getSingleRecordForm(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'insertsinglerecord.html'));
}

function uploadSingleRecord(req, res) {
    console.log("Body:  " + req.body);
    var crimeRecord = new Crime({
        _id: new mongoose.Types.ObjectId(),
        ID: req.body.ID,
        "Case Number": req.body.CaseNumber,
        Date: req.body.Date,
        Block: req.body.Block,
        IUCR: req.body.IUCR,
        "Primary Type": req.body.PrimaryType,
        Description: req.body.Description,
        "Location Description": req.body.LocationDescription,
        Arrest: req.body.Arrest,
        Domestic: req.body.Domestic,
        Beat: req.body.Beat,
        District: req.body.District,
        Ward: req.body.Ward,
        "Community Area": req.body.CommunityArea,
        "FBI Code": req.body.FBICode
    });

    crimeRecord.save(function (err) {
        if (err) {
            //    throw err;
            //return res.status(400).send("Data not inserted sucessfully");
            res.render('error.ejs', {data: err.errors.ID.message});
        }
        else {
            Crime.find({}, {}, function (err, docs) {
                if (err) {
                    // throw err;
                    return res.status(400).send("Error in displaying records");
                }
                else {
                    return res.render('crimelist', {
                        "crime": docs
                    });
                }
            });

        }
    });

    // return res.status(200).send('files were uploaded');
}


function displayRecords(req, res) {
    Crime.find({}, {}, function (err, docs) {
        if (err) {
            // throw err;
            return res.status(400).send("Error in displaying records");
        }
        else {
            return res.render('crimelist', {
                "crime": docs
            });
        }
    });
}

function deleteRecords(req, res) {
    Crime.deleteOne({ "CaseNumber": req.body.caseNumber }, function (err, docs) {
        if (err) {
            // throw err;
            // return res.status(400).send("Error in deleting records");
            res.render('error.ejs', {data: 'Error in deleting records'});
        } else {
            // return res.status(200).send("Delete Successful!");
            res.render('sucess.ejs', {data: 'Delete Successful'});
        }
    })
}

function searchRecords(req, res) {
    arr = [];
    Crime.findOne({ "CaseNumber": req.body.caseNumber }, function (err, docs) {
        if (err) {
            //   throw err;
            // return res.status(400).send("Error finding the record!");
            res.render('error.ejs', {data: 'Error finding the record!'});
        } else {
            if (docs == null) {
                // res.status(200).send("Couldn't find the record!");
                res.render('error.ejs', {data: 'Couldn\'t find the record'});
            }
            arr.push(docs);
            return res.status(200).render('crimelist', {
                "crime": arr
            });
        }
    })
}

function updateRecord(req, res) {
    var modifiedData = {
        Date: req.body.Date,
        Block: req.body.Block,
        IUCR: req.body.IUCR,
        "Primary Type": req.body.PrimaryType,
        Description: req.body.Description,
        "Location Description": req.body.LocationDescription,
        Arrest: req.body.Arrest,
        Domestic: req.body.Domestic,
        Beat: req.body.Beat,
        District: req.body.District,
        Ward: req.body.Ward,
        "Community Area": req.body.CommunityArea,
        "FBI Code": req.body.FBICode
    }
    Crime.findOneAndUpdate({ "Case Number": req.body.CaseNumber }, { $set: modifiedData }, { new: true }, function (err, docs) {
        console.log("Case Number: " + req.body.CaseNumber);
        if (err) {
            //   throw err;
            // return res.status(400).send("Error in searching records");
            res.render('error.ejs', {data: 'No files were uploaded'});
        } else {
            console.log("UPDATED docs: " + docs)
            // return res.status(200).send("Update successful!");
            res.render('success.ejs', {data: "Update success"})
        }
    })
}

function feedbackSubmit(req, res) {

    var feedbackRecord = new Feedback({
        _id:new mongoose.Types.ObjectId(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        feedback: req.body.feedback
    });

    feedbackRecord.save(function (err) {
        if (err) {
            throw err;
            return res.status(400).send("Data not inserted sucessfully");
        }
        else {
            Feedback.find({}, {}, function (err, docs) {
                if (err) {
                    throw err;
                    return res.status(400).send("Error in displaying records");
                }
            });

        }
    });

    // return res.status(200).send('files were uploaded');
   res.sendFile(path.join(__dirname, '../public', 'response.html'));
}
module.exports = {
    getUploadForm,
    uploadDataToDB,
    getSingleRecordForm,
    uploadSingleRecord,
    displayRecords,
    deleteRecords,
    searchRecords,
    updateRecord,
    feedbackSubmit
}
