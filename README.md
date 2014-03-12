jquery-stickynotes
==================

### How to use

1. First instance the object

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


Other options available: <br/>
`'resizable'` (false) when true allows notes to be resized<br/>
`'draggable'` (true)  when true allows notes to be dragged<br/>
`'bgImage'`   (img/sticky/sticky-bg.png) allows using a custom background, or by disable image background (in favor of css)<br/>