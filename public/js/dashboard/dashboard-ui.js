$files_container = $("#files-container");

function event_handlers() {
	$(".options.dropdown").dropdown({
		action: "hide",
		onChange: function(value) {
			perform_action(value, $(this).data("id"));
		}
	});

	$('.ui.description').popup();
}

function perform_action(value, _id) {
	if (value == "delete") return delete_file(_id);
	if(value == "edit name") return edit_file(_id);
}

function save_file(filename, description, url) {
	$.post(
		"/dashboard/addFile",
		{
			filename: filename,
			description: description,
			url: url
		},
		function(response) {
			add_file_to_page(response);
		}
	);
}

function delete_file(_id) {
	$.post(
		"/dashboard/deleteFile",
		{
			_id: _id
		},
		function(response) {
			remove_file_from_page(_id);
		}
	);
}

function edit_file(_id) {
	console.log("edit", _id);
}

function show_modal(filename, callback) {
	$filename_field = $("#modal-file-name");
	$description_field = $("#modal-description");

	$filename_field.val(filename);
	$description_field.val("");

	$(".ui.modal")
		.modal({
			closable: false,
			onApprove: function() {
				var new_filename = $filename_field.val();
				var description = $description_field.val();
				callback(new_filename, description);
			}
		})
		.modal("show");
}

function remove_file_from_page(_id) {
	$("#files-container").find(`tr[data-id='${_id}']`).remove();
}

function add_file_to_page(file) {
	$files_container.append(
		`
		<tr data-id="${file._id}">
		    <td class="collapsing">
		        <i class="${file.icon} icon"></i> ${file.filename}
		    </td>
		    <td>${file.filetype}</td>
		    <td><a href="${file.url}">Download</a></td>
		    <td>${file["readable-date"]}</td>
		    <td>
		        <div class="ui popup icon button" data-content="${file.description}" data-variation="basic">
		        Description
		          <i class="dropdown icon"></i>
		        </div>
		    </td>
		    <td class="collapsing">
		        <div class="ui icon basic mini button"> Share </div>
		    </td>
		    <td class="collapsing">
		        <div class="ui icon top left pointing dropdown basic mini button" data-id="${file._id}">
		            <span class="text">...</span>
		            <div class="menu">
		                <div class="header">File options</div>
		                <div class="item">Download</div>
		                <div class="item">Delete</div>
		                <div class="ui divider"></div>
		                <div class="item">Edit Name</div>
		                <div class="item">Edit Description</div>
		            </div>
		        </div>
		    </td>
		</tr>`
	);

	event_handlers();
}

event_handlers();
