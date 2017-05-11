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
	if (value == "download") return download_file(_id);
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
			add_file_to_page(response, description);
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
		$.post(
			"/dashboard/editFile",
			{
				_id: _id, 
				new_filename: new_filename, 
				new_description: new_description,
			},
			function(new_url) {
				$row.find("#filename").text(new_filename);
				$row.find("#description").attr("data-content", new_description);
				$row.find("#download-link" + _id).attr("href", new_url)
			}
		);
	})
}	

function download_file(_id) {
	var url = $("#download-link" + _id).attr("href");
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

function add_file_to_page(file, description) {
	return location.reload();
}

event_handlers();

