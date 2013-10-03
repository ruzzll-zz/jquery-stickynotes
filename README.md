jquery-stickynotes
==================

<b>How to use</b>

1. First create the object

```bash
var stickyNotes = $('.container').stickyNotes({
    removed: function (noteId){
        // do something
    },
    
    edited: function (note){
        // do something
    },
    
    moved: function (note){
        // do something
    },
    
    resized: function (note){
        // do something
    }
});
```

2. then, add button event

```bash
$('.add-note').on('click', function (e){
    e.preventDefault();
    
    stickyNotes.create();
});
```
