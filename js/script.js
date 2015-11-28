$(initApp);

function initApp() {
    $.ajax({
        method: "GET",
        url: "notes.php",
        dataType: "JSON",
        data: {
            request: "getAllNotes"
        },
        success: function (data) {
            printNotes(data, $(".container"));
        },
        error: function (o) {
            console.log(o);
        }
    });
    $(".container").on("click", ".note", showNote);
}

function printNotes(data, container) {
    var notes = "<ul class='panel list-group'>";
    $.each(data, function(k, v) {
        notes += "<li href='#' data-id='" + v.id + "' data-toggle='collapse' data-target='#note-" + v.id + "' data-parent='.container' class='note collapsed list-group-item'>" +
                    "<span class='note-title'>" + v.title + "</span>" +
                    "<span class='note-intro'>" + truncateText(v.body, 50) + "</span>" +
                "</li>" +
                "<div class='sublinks collapse' id='note-" + v.id + "'>" +
                    "<div class='note-content list-group-item'>" +
                        "<p>" + v.body + "</p>" +
                        "<button type='button' class='btn btn-primary'>Edit</button><button type='button' class='btn btn-danger'>Delete</button>" +
                    "</div>" +
                "</div>";
    });
    notes += "</ul>";
    container[0].innerHTML += notes;
}

function showNote(e) {
    var note = $(e.currentTarget);
    // note.addClass("panel panel-default").removeClass("list-group-item");
}


function truncateText(t, l) {
    if (t.length < l) return t;
    return t.substring(0, l) + "...";
}