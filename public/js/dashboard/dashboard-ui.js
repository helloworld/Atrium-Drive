$files_container = $("#files-container");

function event_handlers() {
	$(".options.dropdown").dropdown({
		action: "hide",
		onChange: function(value) {
			perform_action(value, $(this).data("id"));
		}
	});
}

function perform_action(value, _id) {
	if (value == "open in browser") return download_file(_id);
	if (value == "delete") return delete_file(_id);
	if (value == "edit name") return edit_file(_id);
	if (value == "edit description") return edit_file(_id);
}

function save_file(filename, description, url) {
	console.log(filename, description)
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
	var $row = $("#files-container").find(`tr[data-id='${_id}']`);
	var filename = $row.find("#filename").text();
	var description = $row.find("#description").data("content");
	if(description == "No description") description = "";
	show_modal(filename, description, function(new_filename, new_description) {
		$row.find("#filename").text(new_filename);
		$row.find("#description").attr("data-content", new_description);
	})
}	

function download_file(_id) {
	var url = $("#download-link" + _id).attr("href")
	$('<form target="_blank"> </form>').attr('action', url).appendTo('body').submit().remove();
}

function show_modal(filename, description, callback) {
	$filename_field = $("#modal-file-name");
	$description_field = $("#modal-description");

	$filename_field.val(filename);
	$description_field.val(description);

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
		        <div class="ui icon top left pointing options dropdown basic mini button" data-id="${file._id}">
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
$('.ui.description').popup();

