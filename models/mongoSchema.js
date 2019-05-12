var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var feedbackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    feedback: String
});
var Feedback = mongoose.model('feedback', feedbackSchema);

var crimeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: {type: String, unique: true},
    "Case Number": {type: String},
    //CaseNumber: {type: String, unique:true},
    Date: String,
    Block: String,
    IUCR: String,
    "Primary Type": {type: String},
    //PrimaryType: {type: String},
    Description: String,
    "Location Description": String,
    //LocationDescription: String,
    Arrest: String,
    Domestic: String,
    Beat: String,
    District: String,
    Ward: String,
    "Community Area": String,
    //CommunityArea: String,
    "FBI Code": String,
    //FBICode: String,
    Year: String,
    Country: String,
    State: String
});
crimeSchema.plugin(uniqueValidator);
var Crime = mongoose.model('crimes', crimeSchema);

module.exports = { Crime, Feedback };
