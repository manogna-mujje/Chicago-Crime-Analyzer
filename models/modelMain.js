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
        return res.status(400).send('No files were uploaded');
    }

    var crimeFile = req.files.file;
    var crimeList = [];
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
            console.log("There is an error parsing it", JSON.stringify(data));
        })
        .on("data", function (data) {
            console.log('after parsing data', JSON.stringify(data));
            data['_id'] = new mongoose.Types.ObjectId();
            crimeList.push(data);
        })
        .on("end", function () {
            console.log("end reached");
            Crime.create(crimeList, function (err, documents) {
                if (err) {
                    console.log("error");
                    // throw err;
                    console.log(err);
                    return res.status(400).send(err);
                }
                else {
                    Crime.find({}, {}, function (err, docs) {
                        if (err) {
                            // throw err;
                            res.status(400).send("Error in displaying records");
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
            console.log("Catch an invalid csv file!!!");
            //return res.fail('The csv file is invalid!');
         });
}

function getSingleRecordForm(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'insertsinglerecord.html'));
}

function uploadSingleRecord(req, res) {
    console.log("hello");
    var crimeRecord = new Crime({
        _id: new mongoose.Types.ObjectId(),
        ID: req.body.ID,
        CaseNumber: req.body.CaseNumber,
        Date: req.body.Date,
        Block: req.body.Block,
        IUCR: req.body.IUCR,
        PrimaryType: req.body.PrimaryType,
        Description: req.body.Description,
        LocationDescription: req.body.LocationDescription,
        Arrest: req.body.Arrest,
        Domestic: req.body.Domestic,
        Beat: req.body.Beat,
        District: req.body.District,
        Ward: req.body.Ward,
        CommunityArea: req.body.CommunityArea,
        FBICode: req.body.FBICode
    });

    crimeRecord.save(function (err) {
        if (err) {
            //    throw err;
            return res.status(400).send("Data not inserted sucessfully");
        }
        else {
            console.log("record saved sucessfully");
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
    console.log("Inside Delete Records", Number(req.body.caseNumber));
    Crime.deleteOne({ "CaseNumber": req.body.caseNumber }, function (err, docs) {
        if (err) {
            // throw err;
            return res.status(400).send("Error in deleting records");
        } else {
            console.log(docs);
            return res.status(200).send("Delete Successful!");
        }
    })
}

function searchRecords(req, res) {
    console.log("Inside Search Records", req.body.caseNumber);
    arr = [];
    Crime.findOne({ "CaseNumber": req.body.caseNumber }, function (err, docs) {
        if (err) {
            //   throw err;
            return res.status(400).send("Error finding the record!");
        } else {
            if (docs == null) {
                res.status(200).send("Couldn't find the record!");
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
        PrimaryType: req.body.PrimaryType,
        Description: req.body.Description,
        LocationDescription: req.body.LocationDescription,
        Arrest: req.body.Arrest,
        Domestic: req.body.Domestic,
        Beat: req.body.Beat,
        District: req.body.District,
        Ward: req.body.Ward,
        CommunityArea: req.body.CommunityArea,
        FBICode: req.body.FBICode
    }
    console.log(JSON.stringify(modifiedData));
    Crime.findOneAndUpdate({ "CaseNumber": req.body.CaseNumber }, { $set: modifiedData }, { new: true }, function (err, docs) {
        if (err) {
            //   throw err;
            return res.status(400).send("Error in searching records");
        } else {
            // console.log("Results: " + JSON.stringify(docs))
            return res.status(200).send("Update successful!")
        }
    })
}

function feedbackSubmit(req, res) {
    console.log("insdie post Feedback: ", req.body);

    var feedbackRecord = new Feedback({
        _id:new mongoose.Types.ObjectId(),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        feedback: req.body.feedback
    });

    console.log("feedbackrecord: ", feedbackRecord);
    feedbackRecord.save(function (err) {
        if (err) {
            throw err;
            return res.status(400).send("Data not inserted sucessfully");
        }
        else {
            console.log("record saved sucessfully");
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
