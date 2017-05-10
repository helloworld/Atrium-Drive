function save_upload_to_user(filename, url) {
    $.post(
        "/dashboard/addFile",
        {
            filename: filename,
            url: url
        },
        function(response) {
            console.log("File uploaded:");
            console.log(response);
        }
    );
}

function upload(file, signed_request, url, done) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader("x-amz-acl", "public-read");
    xhr.onload = function() {
        if (xhr.status === 200) {
            done();
        }
    };

    xhr.send(file);
}

function sign_request(file, done) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sign?file_name=" + file.name + "&file_type=" + file.type);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            done(response);
        }
    };

    xhr.send();
}

document.getElementById("file-selection").onchange = function() {
    var file = document.getElementById("file-selection").files[0];
    if (!file) return;

    sign_request(file, function(response) {
        upload(file, response.signed_request, response.url, function() {
            save_upload_to_user(file.name, response.url);
        });
    });
};
