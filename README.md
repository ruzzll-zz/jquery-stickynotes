jquery-stickynotes
==================

<b>How to use</b>

1. First create the object

{var sticky = $('.container').sticky({
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
});}

2. then, add button event


{$('.add-note').on('click', function (e){
    e.preventDefault();
    
    sticky.create();
});}
