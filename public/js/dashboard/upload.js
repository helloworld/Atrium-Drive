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

function sign_request(file, new_filename, done) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sign?file_name=" + new_filename + "&file_type=" + file.type);

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

    show_modal(file.name, "", function(new_filename, description) {
        sign_request(file, new_filename, function(response) {
            upload(file, response.signed_request, response.url, function(data) {
                save_file(new_filename, description, response.url);
            });
        });
    });
};
