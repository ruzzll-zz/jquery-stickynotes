/*****************************************************************
 * @author: Russell Kid Benancio Flores
 * @since: 2013-10-01
 * @version: 1.0
 * @require jquery, jquery-ui-resize, jquery-ui-draggable
 * @comments: based on http://www.jquery-sticky-notes.com/
 *********************************************************************************/
(function ($, undefined){
    $.stickyNotes = {
        defaults: {
            resizable: false,
            draggable: true,
            editable: true,
            edited: null,
            moved: null,
            resized: null
        }
    };

    var counter = 1;

    var stickyNotes = function (element, options){
        var self = this;

        self.currentNoteId = null;
        self.notes = {};
        self.options = $.extend({}, $.stickyNotes.defaults, options || {});
        self.container = element.addClass('sticky-container');
        //self.container = $('<div class="sticky-container" />');
        //element.append(self.container);

        self.container.on('click', function (e){
            self.stopEditing(self.currentNoteId);
        });
    };

    $.extend(stickyNotes.prototype, {
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
            if(noteId === null)
                return;

            var self = this,
                note = $("#note-" + noteId, self.container),
                text = $('textarea', note).val();

            // if it was deleted or removed
            if( ! note.size())
                return;

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
            var self = this;

            self.stopEditing(self.currentNoteId);

            var note = $('#note-' + noteId, self.container),
                html = $('p', note).html(),
                textarea = $('<textarea class="editor ignore" id="textarea-note-' + noteId + '" />').val(html);

            $('#p-note-' + noteId, self.container).replaceWith(textarea);

            textarea.css({
                width: note.width() - 44,
                height: note.height() - 15
            });

            $('textarea', note).on('blur', function (){
                self.stopEditing(self.currentNoteId);
            }).focus();

            self.currentNoteId = noteId;
        },

        render: function (note){
            var self = this;
            var _p_note_text = $('<p id="p-note-' + note.id + '" />').html(note.text);

            if(self.options.editable){
                _p_note_text.on('dblclick', function (e){
                    self.edit(note.id);
                });
            }

            var _div_note = $('<div class="jStickyNote" />');
            if( ! self.options.editable)
                _div_note.css({ cursor: 'default' });

            var _div_background = $('<div class="background" />').html('<img src="img/sticky/sticky-bg.png" class="stretch" style="margin-top:5px;" alt="" />');
            _div_note.append(_p_note_text);

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
              .append(_div_note);

            if(self.options.editable){
                $('<div class="jSticky-delete" />').on('click', function(){
                    self.remove(note.id);
                }).appendTo(_div_wrap);
            }

            if(self.options.editable && self.options.resizable){
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

            if(self.options.editable && self.options.draggable){
                _div_wrap.draggable({
                    containment: self.container,
                    // containment: self.container.parent(),
                    // opacity: 0.7,
                    drag: function (event, ui){
                        // return false;
                        /*if(_div_wrap.width() + ui.position.left >= self.container.width() - 20)
                            return false;*/
                        // console.log([self.container.width(), self.container.height(), ui.position]);
                    },
                    scroll: false,
                    stop: function(event, ui){
                        var _note = self.notes[note.id];

                        $.extend(_note, {
                            pos_y: ui.position.left,
                            pos_x: ui.position.top
                        });

                        $.isFunction(self.options.moved) && self.options.moved(_note);
                    }
                });
            }

            self.container.append(_div_wrap);
            self.notes[note.id] = note;

            $("#note-" + note.id, self.container).on('click', function() {
                return false;
            });
        }
    });

    $.fn.extend({
        stickyNotes: function (options){
            return new stickyNotes(this, options);
        }
    });
})(jQuery);
