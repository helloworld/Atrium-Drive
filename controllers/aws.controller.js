var aws = require("aws-sdk");

// -- AWS Controller -----------------------------------------------------------
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
});

var s3 = new aws.S3();


// -- GET /sign ----------------------------------------------------------------
exports.sign = function(req, res) {
    var options = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: "public-read"
    };
    s3.getSignedUrl("putObject", options, function(err, data) {
        if (err) return res.send("Error with S3");
        res.json({
            signed_request: data,
            url: "https://s3.amazonaws.com/" +
                S3_BUCKET +
                "/" +
                req.query.file_name
        });
    });
};
exports.delete = function(file_name) {
    var options = {
        Bucket: S3_BUCKET,
        Delete: {
            Objects: [{
                Key: file_name
            }]
        }
    };

    s3.deleteObjects(options, function(err, data) {
      if (err) throw err;
    });
}



