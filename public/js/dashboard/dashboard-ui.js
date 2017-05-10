$files_container = $("#files-container");

$(".ui.dropdown").dropdown();

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

function add_file(file) {
	console.log(file);
	$files_container.append(
		`
		<tr>
		    <td class="collapsing">
		        <i class="${file.icon} icon"></i> ${file.filename}
		    </td>
		    <td>${file.filetype}</td>
		    <td><a href="${file.url}">Download</a></td>
		    <td>${file["readable-date"]}</td>
		    <td class="collapsing"> <div class="ui icon basic mini button"> Share </div> </td>
		    <td class="collapsing">
		        <div class="ui icon top left pointing dropdown basic mini button">
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
}
