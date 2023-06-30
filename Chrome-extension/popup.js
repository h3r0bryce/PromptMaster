document.addEventListener("DOMContentLoaded", function() {
  var noteText = document.getElementById("noteText");
  var saveButton = document.getElementById("saveButton");
  var noteList = document.getElementById("noteList");

  saveButton.addEventListener("click", function() {
    var note = noteText.value;
    if (note.trim() !== "") {
      saveNoteWithTitle(note);
      noteText.value = "";
    }
  });

  // Save note to storage
  function saveNoteWithTitle(note) {
    var title = prompt("Enter the title for the note:");
    if (title !== null && title.trim() !== "") {
      var noteObject = {
        title: title,
        content: note
      };

      chrome.storage.sync.get({ notes: [] }, function(result) {
        var notes = result.notes;
        notes.push(noteObject);
        chrome.storage.sync.set({ notes: notes }, function() {
          displayNotes(notes);
        });
      });
    }
  }

  // Delete note
  function deleteNote(index) {
    chrome.storage.sync.get({ notes: [] }, function(result) {
      var notes = result.notes;
      if (index >= 0 && index < notes.length) {
        notes.splice(index, 1);
        chrome.storage.sync.set({ notes: notes }, function() {
          displayNotes(notes);
        });
      }
    });
  }

  // Edit note
  function editNote(index) {
    chrome.storage.sync.get({ notes: [] }, function(result) {
      var notes = result.notes;
      if (index >= 0 && index < notes.length) {
        var updatedNote = prompt("Enter the updated note:", notes[index].content);
        if (updatedNote !== null && updatedNote.trim() !== "") {
          notes[index].content = updatedNote;
          chrome.storage.sync.set({ notes: notes }, function() {
            displayNotes(notes);
          });
        }
      }
    });
  }

  // Copy note
  function copyNote(index) {
    chrome.storage.sync.get({ notes: [] }, function(result) {
      var notes = result.notes;
      if (index >= 0 && index < notes.length) {
        var noteToCopy = notes[index].content;
        navigator.clipboard.writeText(noteToCopy)
          .then(function() {
            alert("Note copied to clipboard: " + noteToCopy);
          })
          .catch(function(error) {
            console.error("Unable to copy note: ", error);
          });
      }
    });
  }

  // Display saved notes
  function displayNotes(notes) {
    noteList.innerHTML = "";
    for (var i = 0; i < notes.length; i++) {
      var li = document.createElement("li");
      var note = notes[i];

      // Check if the note starts with "http://" or "https://"
      if (note.content.startsWith("http://") || note.content.startsWith("https://")) {
        var link = document.createElement("a");
        link.href = note.content;
        link.target = "_blank";
        link.textContent = note.title;
        li.appendChild(link);
      } else {
        li.textContent = note.title;
      }

      var actions = document.createElement("div");
      actions.className = "actions";

      var copyButton = createActionButton("Copy", copyNote.bind(null, i));
      actions.appendChild(copyButton);

      var editButton = createActionButton("Edit", editNote.bind(null, i));
      actions.appendChild(editButton);

      var deleteButton = createActionButton("Delete", deleteNote.bind(null, i));
      actions.appendChild(deleteButton);

      li.appendChild(actions);

      // Add padding between the saved notes
      li.style.paddingBottom = "10px";

      noteList.appendChild(li);
    }
  }

  // Helper function to create an action button
  function createActionButton(label, action) {
    var button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
  }

  // Retrieve and display saved notes on page load
  chrome.storage.sync.get({ notes: [] }, function(result) {
    var notes = result.notes;
    displayNotes(notes);
  });
});
