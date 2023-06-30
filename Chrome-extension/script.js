document.addEventListener("DOMContentLoaded", function() {
    var noteText = document.getElementById("noteText");
    var saveButton = document.getElementById("saveButton");
    var noteList = document.getElementById("noteList");
  
    saveButton.addEventListener("click", saveNote);
  
    var notes = []; // Array to store the notes
  
    function saveNote() {
      var note = noteText.value.trim();
  
      if (note !== "") {
        // Add the note to the array
        notes.push(note);
  
        // Log the notes to the console
        console.log(notes);
  
        // Render the updated notes
        renderNotes();
      }
  
      // Clear the note input after saving
      noteText.value = "";
    }
  
    function renderNotes() {
      // Clear the existing note list
      noteList.innerHTML = "";
  
      // Render the notes
      notes.forEach(function(note) {
        var noteItem = document.createElement("li");
        noteItem.classList.add("note");
        noteItem.textContent = note;
  
        noteList.appendChild(noteItem);
      });
    }
  });
  