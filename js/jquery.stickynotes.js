/*****************************************************************
 * @author: Russell Kid Benancio Flores
 * @since: 2013-10-01
 * @version: 1.0
 * @require jquery, jquery-ui-resize, jquery-ui-draggable
 * @comments: based on http://www.jquery-sticky-notes.com/
 *********************************************************************************/
(function ($, undefined){
    $.sticky = {
        defaults: {
            resizable: false,
            moved: null,
            resized: null
        }
    };

    var counter = 1;

    var sticky = function (element, options){
        var self = this;

        self.currentNoteId = null;
        self.notes = {};
        self.options = $.extend({}, $.sticky.defaults, options || {});
        self.container = $('<div class="sticky-container" />');
        element.append(self.container);

        self.container.on('click', function (e){
            if(self.currentNoteId !== null)
                self.stopEditing(self.currentNoteId);
        });
    };

    $.extend(sticky.prototype, {
        set: function (notes){
            $.each(notes, function (i, note){
                self.render(note);
            });
        },

        create: function (){
            this.render({
                id: counter,
                text: '',
                pos_y: 0,
                pos_x: 0,
                width: 200,
                height: 200
            });

            counter++;
        },

        getAll: function (){
            return this.notes;
        },

        size: function (){
            if(window.Object && Object.keys)
                return Object.keys(this.notes).length;

            var length = 0;

            $.each(this.notes, function (){
                length++;
            });

            return length;
        },

        getOne: function (noteId){
            return this.notes[noteId];
        },

        stopEditing: function (noteId){
            var self = this,
                note = $("#note-" + noteId, self.container),
                text = $('textarea', note).val();

            // console.log([self.notes, noteId]);

            self.notes[noteId].text = text;

            var _p_note_text = 	$('<p id="p-note-' + noteId + '" />').html(text);
            $('textarea', note).replaceWith(_p_note_text);
            $("#p-note-" + noteId, self.container).on('dblclick', function() {
                self.edit(noteId);
            });

            self.currentNoteId = null;
            $.isFunction(self.options.edited) && self.options.edited(self.notes[noteId]);
        },

        remove: function (noteId){
            $("#note-" + noteId, this.container).remove();
            delete this.notes[noteId];

            $.isFunction(this.options.removed) && this.options.removed(noteId);
        },

        edit: function (noteId){
            if(this.currentNoteId !== null)
                this.stopEditing(this.currentNoteId);

            var note = $('#note-' + noteId, this.container),
                html = $('p', note).html(),
                textarea = $('<textarea class="editor ignore" id="textarea-note-' + noteId + '" />').val(html);

            $('#p-note-' + noteId, this.container).replaceWith(textarea);

            textarea.css({
                width: note.width() - 44,
                height: note.height() - 15
            });

            $('textarea', note).focus();
            this.currentNoteId = noteId;
        },

        render: function (note){
            var self = this;
            var _p_note_text = $('<p id="p-note-' + note.id + '" />').on('dblclick', function (e){
                self.edit(note.id);
            }).html(note.text);

            var _div_note = $('<div class="jStickyNote" />');
            var _div_background = $('<div class="background" />').html('<img src="img/sticky/sticky-bg.png" class="stretch" style="margin-top:5px;" alt="" />');
            _div_note.append(_p_note_text);

            var _div_delete = $('<div class="jSticky-delete" />').on('click', function(){
                self.remove(note.id);
            });

            var _div_wrap = $('<div class="jSticky-medium" />').css({
                position: 'absolute',
                top: parseFloat(note.pos_x),
                left: parseFloat(note.pos_y),
                'float': 'left',
                width: note.width,
                height:note.height
            }).attr({
                id: 'note-' + note.id
            }).append(_div_background)
              .append(_div_note)
              .append(_div_delete);

            if(self.options.resizable){
                _div_wrap.resizable({
                    stop: function(event, ui) {
                        var _note = self.notes[note.id];

                        $.extend(_note, {
                            height: ui.size.height,
                            width: ui.size.width
                        });

                        $.isFunction(self.options.resized) && self.options.resized(_note);
                    }
                });
            }

            _div_wrap.draggable({
                containment: self.container,
                //scroll: false,
                stop: function(event, ui){
                    var _note = self.notes[note.id];

                    $.extend(_note, {
                        pos_y: ui.position.left,
                        pos_x: ui.position.top
                    });

                    $.isFunction(self.options.moved) && self.options.moved(_note);
                }
            });

            self.container.append(_div_wrap);
            self.notes[note.id] = note;

            $("#note-" + note.id, self.container).on('click', function() {
                return false;
            });
        }
    });

    $.fn.extend({
        sticky: function (options){
            return new sticky(this, options);
        }
    });
})(jQuery);
