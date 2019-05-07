var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var feedbackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: {type: String, unique:true},
    firstname: String,
    lastname: String,
    email: String,
    location: String,
    datepicker: String,
    comment: String
});
var Feedback = mongoose.model('feedback', feedbackSchema);

var crimeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ID: {type: String, unique:true},
    CaseNumber: {type: String, unique:true},
    Date: String,
    Block: String,
    IUCR: String,
    PrimaryType: {type: String},
    Description: String,
    LocationDescription: String,
    Arrest: String,
    Domestic: String,
    Beat: String,
    District: String,
    Ward: String,
    CommunityArea: String,
    FBICode: String

});
crimeSchema.plugin(uniqueValidator);
var Crime = mongoose.model('crimes', crimeSchema);

module.exports = { Crime, Feedback };