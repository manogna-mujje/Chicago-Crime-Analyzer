var path = require('path');

function getDashboard(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'overallCrimeReport.html'));
}

function getMapDashBoard(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'districtLevelReport.html'));
}

function getContact(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'contact.html'));
}

function getAdminPortal(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
}

function getOverallInsights(req, res) {
    /**
     * Import Data and check || Data: https://docs.google.com/spreadsheets/d/1yN7BCNn7xWerEqYdpHsKzRP9jY3b5NfW4iCo5Eaabvg/edit?usp=sharing
     */
    var csv_data = dl.load({ url: './public/sampledata.csv' });
    var data = dl.read(csv_data, { type: 'csv', parse: 'auto' });

    var rollup = dl.groupby('Primary Type', 'Arrest')
    .count()
        .execute(data);

        console.log(JSON.stringify(rollup));

        //Fetched distinct primary types
        var types = [...new Set(rollup.map(d => d["Primary Type"]))];
        console.log(types);

        var grouped = _.mapValues(_.groupBy(rollup, 'Primary Type'),
                          crimeslist => crimeslist.map(crime => _.omit(crime, 'Primary Type')));

console.log(grouped);

    //console.log(dl.print.table(rollup));

    res.render('bar', {grouped: grouped, crime_types: types});
    //res.sendFile(path.join(__dirname, '../public', 'bar.html'));
}


function displayOptionsforDB(req, res){
     res.sendFile(path.join(__dirname, '../public', 'dboptions.html'));
}

function insertRecordsoptions(req,res){
     res.sendFile(path.join(__dirname, '../public', 'insertoptions.html'));
}

function deleteRecords(req, res)
{
    res.sendFile(path.join(__dirname, '../public', 'deleteRecord.html'));
}

function searchRecords(req, res)
{
    res.sendFile(path.join(__dirname, '../public', 'searchRecord.html'));
}

function updateRecord(req, res)
{
    res.sendFile(path.join(__dirname, '../public', 'updateRecord.html'));
}

module.exports = {
    getDashboard,
    getMapDashBoard,
    getContact,
    getOverallInsights,
    displayOptionsforDB,
    insertRecordsoptions,
    deleteRecords,
    searchRecords,
    updateRecord,
    getAdminPortal
}