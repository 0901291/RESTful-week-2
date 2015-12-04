$(initApp);

function initApp() {
    $(".container").on("click", ".delete .note", function (e) {
        getDetails($(e.currentTarget).data("id"));
    });
    $(".container").on("click", "#notes .edit-button", initEditNote);
    $(".container").on("click", "#notes .delete-button", deleteNote);
    $(".container").on("click", "#notes .undelete-button", undeleteNote);
    $(".container").on("click", "#note-form .panel-heading", function() {
        $("#note-form .panel-body").toggleClass("closed");
    });
    $(".container").on("click", "#save-note", initSaveNote);
    $(".container").on("click", "#cancel-note", closeNoteForm);
    $(".container").on("change", "#undelete", checkUndelete);
    requestNote("getNote", "GET", "?deleted=" + $("#undelete").prop("checked"), "", printNotes);
    initInterval();
}

function printNotes(notes) {
    var newNotes = "<ul id='notes' class='panel list-group " + ($("#undelete").prop("checked") ? "undelete" : "delete") + "'>";
    $.each(notes, function(k, v) {
        newNotes += formatNote(v);
    });
    newNotes += "</ul>";
    $(".container").append(newNotes);
    $("#temp-notes-1").text($("#notes").html());
}

function formatNote(note) {
    return "<li href='#' data-id='" + note.id + "' data-toggle='collapse' data-target='#note-" + note.id + "' data-parent='.container' class='note collapsed list-group-item'>" +
                "<span class='note-title'>" + truncateText(note.title, 30) + "</span>" +
                "<span class='note-intro'>" + truncateText(note.body, 50) + "</span>" +
            "</li>" +
            "<div class='sublinks collapse' id='note-" + note.id + "'>" +
                "<div class='note-content list-group-item'>" +
                    "<h3>" + note.title + "</h3>" +
                    "<pre>" + note.body + "</pre>" +
                    "<p class='author'>By </p>" +
                    "<button type='button' class='edit-button btn btn-primary'>Edit</button><button type='button' class='delete-button btn btn-danger'>Delete</button><button type='button' class='undelete-button btn btn-danger'>Undelete</button>" +
                "</div>" +
            "</div>"
}

function initEditNote(e) {
    $("#note-form .panel-heading").text("Edit note");
    var id = $(e.currentTarget).parent().parent().attr("id");
    requestNote("getNote", "GET", "", id.substring(5, id.length), fillNoteForm);
}

function fillNoteForm(note) {
    $("#note-id").val(note.id);
    $("#input-title").val(note.title);
    $("#input-body").val(note.body);
    $("#input-author").val(note.author);
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
        extendNote({}, "createNote", function (note) {
            $("#notes").append(formatNote(note));
            closeNoteForm();
            showMessage("<strong>Saved!</strong> Your note <strong>\"" + truncateText(note.title, 30) + "\"</strong> is successfully saved.");
        });
    } else if ($.isNumeric(id)) {
        requestNote("getNote", "GET", "", id, function (note) {
            extendNote(note, "updateNote", function (note) {
                $("#notes .note[data-id=" + note.id + "]").remove();
                $("#notes #note-" + note.id).addClass("to-remove").after(formatNote(note));
                $(".to-remove").remove();
                closeNoteForm();
                showMessage("<strong>Saved!</strong> Your note <strong>\"" + truncateText(note.title, 30) + "\"</strong> is successfully saved.");
            });
        });
    }
}

function extendNote(note, request, onSuccess) {
    note = $.extend(note, {
        title: $("#input-title").val(),
        body: $("#input-body").val(),
        author: $("#input-author").val()
    });
    requestNote(request, "POST", "", note.id, onSuccess, {json: note});
}

function deleteNote(e) {
    var id = $(e.currentTarget).parent().parent().attr("id");
    id = id.substring(5, id.length);
    requestNote("deleteNote", "POST", "", id, function (output) {
        $(".note[data-id=" + id + "]").remove();
        var title = $("#note-" + id).find("h3").text();
        $("#note-" + id).remove();
        $("body").animate({ scrollTop: 0 });
        showMessage("<strong>Deleted!</strong> Your note <strong>\"" + truncateText(title, 30) + "\"</strong> is successfully deleted.");
    });
}

function undeleteNote(e) {
    var id = $(e.currentTarget).parent().parent().attr("id");
    id = id.substring(5, id.length);
    requestNote("undeleteNote", "POST", "", id, function (output) {
        $(".note[data-id=" + id + "]").remove();
        var title = $("#note-" + id).find("h3").text();
        $("#note-" + id).remove();
        $("body").animate({ scrollTop: 0 });
        showMessage("<strong>Undeleted!</strong> Your note <strong>\"" + truncateText(title, 30) + "\"</strong> is successfully Undeleted.");
    }, {form_params: {method: "undelete"}});
}

function getDetails(id) {
    requestNote("getNote", "GET", "", id, function (note) {
        $("#note-" + id).find(".author").text("By " + (note.author.length > 0 ? note.author : "-") + " on " + note.date);
    });
}

function initInterval() {
    setInterval(function () {
        requestNote("getNote", "GET", "?deleted=" + $("#undelete").prop("checked"), "", checkNotes);
    }, 1000);
}

function checkNotes(notes) {
    var currentNotes = $("#temp-notes-1").text();
    var newNotes = "";
    $.each(notes, function(k, v) {
        newNotes += formatNote(v);
    });
    $("#temp-notes-2").text(newNotes);
    newNotes = $("#temp-notes-2").text();
    if (currentNotes != newNotes) {
        var openedNoteId = $("#notes .note").not(".collapsed").data("id");
        $("#notes").html(newNotes);
        $("#temp-notes-1").text(newNotes);
        if ($.isNumeric(openedNoteId)) {
            $("#notes .note[data-id=" + openedNoteId + "]").removeClass("collapsed");
            $("#note-" + openedNoteId).addClass("in");
            getDetails(openedNoteId);
        }
    }
}

function checkUndelete() {
    $("#notes.undelete").remove();
    $("#notes.delete").remove();
    requestNote("getNote", "GET", "?deleted=" + $("#undelete").prop("checked"), "", printNotes);
}

function requestNote(request, method, extra, id, onSuccess, note) {
    $.ajax({
        method: method,
        url: "notes.php",
        dataType: "JSON",
        data: {
            request: request,
            id: id,
            note: note,
            extra: extra
        },
        success: onSuccess,
        error: function (output) {
            console.log(output.responseText);
        }
    });
}

function truncateText(t, l) {
    if (t.length < l) return t;
    return t.substring(0, l) + "...";
}

function showMessage(html) {
    $(".system-message").remove();
    $(".container").prepend("<div class='system-message alert alert-success fade in'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" + html + "</div>");
}



