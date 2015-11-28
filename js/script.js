$(initApp);

function initApp() {
    $(".container").on("click", "#notes .edit-button", initEditNote);
    $(".container").on("click", "#notes .delete-button", deleteNote);
    $(".container").on("click", "#note-form .panel-heading", function() {
        $("#note-form .panel-body").toggleClass("closed");
    });
    $(".container").on("click", "#note-form #save-note", initSaveNote);
    $(".container").on("click", "#note-form #cancel-note", closeNoteForm);
    reqNote("getAllNotes", "GET", "", function (output) {
        console.log(output);
        printNotes(output, $(".container"));
    });
}

function printNotes(data, container) {
    var notes = "<ul id='notes' class='panel list-group'>";
    $.each(data, function(k, v) {
        notes += formatNote(v);
    });
    notes += "</ul>";
    container.append(notes);
}

function formatNote(note) {
    return "<li href='#' data-id='" + note.id + "' data-toggle='collapse' data-target='#note-" + note.id + "' data-parent='.container' class='note collapsed list-group-item'>" +
        "<span class='note-title'>" + note.title + "</span>" +
        "<span class='note-intro'>" + truncateText(note.body, 50) + "</span>" +
    "</li>" +
    "<div class='sublinks collapse' id='note-" + note.id + "'>" +
        "<div class='note-content list-group-item'>" +
            "<p>" + note.body + "</p>" +
            "<button type='button' class='edit-button btn btn-primary'>Edit</button><button type='button' class='delete-button btn btn-danger'>Delete</button>" +
        "</div>" +
    "</div>"
}

function initEditNote(e) {
    $("#note-form .panel-heading").text("Edit note");
    var noteId = $(e.currentTarget).parent().parent().attr("id");
    reqNote("getNote", "GET", noteId.substring(5, noteId.length), fillNoteForm);
}

function fillNoteForm(output) {
    $("#note-form #note-id").val(output.id);
    $("#note-form #input-title").val(output.title);
    $("#note-form #input-body").val(output.body);
    $("#note-form #input-author").val(output.author);
    $("body").animate({ scrollTop: 0 });
    $("#note-form .panel-body").removeClass("closed");
}

function closeNoteForm() {
    $("#note-form .panel-heading").text("New note");
    $("#note-form .panel-body").addClass("closed");
    setTimeout(function() {
        $("#note-form input").val("");
        $("#note-form textarea").val("");
    }, 300);
}

function initSaveNote() {
    var id = $("#note-id").val();
    if (id == "") {
        extendNote({}, "createNote", function (output) {
            $(".container #notes").append(formatNote(output));
            closeNoteForm();
            showMessage("<strong>Saved!</strong> Your note is successfully saved.");
        });
    } else if ($.isNumeric(id)) {
        reqNote("getNote", "GET", id, function (output) {
            extendNote(output, "updateNote", function (output) {
                $(".container #notes .note[data-id=" + output.id + "]").addClass("to-remove");
                $(".container #notes #note-" + output.id).addClass("to-remove").after(formatNote(output));
                $(".to-remove").remove();
            });
            closeNoteForm();
            showMessage("<strong>Saved!</strong> Your note is successfully saved.");
        });
    }
}

function extendNote(note, request, onSuccess) {
    note = $.extend(note, {
        title: $("#note-form #input-title").val(),
        body: $("#note-form #input-body").val(),
        author: $("#note-form #input-author").val(),
        date: formatDate(new Date())
    });
    reqNote(request, "POST", "", onSuccess, note);
}

function deleteNote(e) {
    var id = $(e.currentTarget).parent().parent().attr("id");
    id = id.substring(5, id.length);
    reqNote("deleteNote", "POST", id, function (output) {
        console.log(output);
        $(".container #notes .note[data-id=" + id + "]").remove();
        $(".container #notes #note-" + id).remove();
        $("body").animate({ scrollTop: 0 });
        showMessage("<strong>Deleted!</strong> Your note is successfully deleted.");
    });
}

function reqNote(request, method, id, onSuccess, note) {
    $.ajax({
        method: method,
        url: "notes.php",
        dataType: "JSON",
        data: {
            request: request,
            id: id,
            note: note
        },
        success: onSuccess,
        error: function (output) {
            console.log(output);
        }
    });
}

function truncateText(t, l) {
    if (t.length < l) return t;
    return t.substring(0, l) + "...";
}

function formatDate(date) {
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return date.getFullYear() + "-" + (month < 10?"0":"") + month + "-" + (day < 10?"0":"") + day + " " + (hours < 10?"0":"") + hours + ":" + (minutes < 10?"0":"") + minutes + ":" + (seconds < 10?"0":"") + seconds;
}

function showMessage(html) {
    $(".system-message").remove();
    $(".container").prepend("<div class='system-message alert alert-success fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" + html + "</div>");
}



