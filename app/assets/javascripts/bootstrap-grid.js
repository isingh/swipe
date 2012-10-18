!function(window, $){
  "use strict"; 

  $.fn.grid = function(config){

    config = $.extend({}, {
      options: {
        highlight: false,
        checkboxes: false,
        numbered: false,
        zebra: true
      }
    }, config || {});

    return this.each(function(){

      // cache reference to Html element
      var $t = $(this);

      // check if instance exists
      if($.data(this, 'grid'))
        return;

      // create new grid
      new grid($t.get(0), config);
    });
  };

  var grid = function(container, config){
    // store this
    var $t = this;
    // create store of properties
    $t.config = config;
    // set container property
    $t.container = $t.config.container = $(container);
    // if headers and data are empty then assume markup exists
    if(!$t.config.headers && !$t.config.data){
      // create component from markup
      $t.generate();
    }else{
      // add table class
      $t.container.addClass('table');
      // create thead markup
      $t.headers();
      // create tbody markup
      $t.body();
    }
    // create hidden input to manage checkboxes
    $t.input();
    // apply styling defined by config 'options'
    $t.beautify();
    // attach events
    $t.events();

    if($t.sort){
      $('th:eq(' + $t.sort.index + ')', $t.thead)
      .addClass($t.sort.direction)
      .trigger('click');
    }
    // use $.data to store grid instance
    $.data(container, 'grid', $t);
  };

  $.extend(grid.prototype, {
    beautify: function(){
      var $t = this;

      if($t.config.options.border){
        $t.container.addClass('table-bordered');
      }

      if($t.config.options.zebra){
        $t.container.addClass('table-striped');
        $('tr', $t.tbody).filter(':even').addClass('even').end().filter(':odd').addClass('odd');
      }

      if($t.config.options.checkbox){
        $t.container.addClass('table-checkboxes');
      }
    },

    body: function(){
      var $t = this;

      if($t.config.data.length == 0){
        return;
      }

      var tbody = $(document.createElement('tbody')),
          count = 1;

      tbody.appendTo($t.container);

      for(var i = 0, k = $t.config.data.length; i < k; i++){
        var tr = $(document.createElement('tr')),
            row = $t.config.data[i],
            array = [];

        tr.attr('data-uid', row.id || i + 1);
        
        tbody.append(tr);

        if(typeof(row.cells[0]) === 'object'){
          for(var prop in row.cells[0]){
            array.push(row.cells[0][prop]);
          }

          row = array;
        }

        if($t.config.options.checkbox){
          row.unshift('<span class="cbox"></span>');
        }

        if($t.config.options.numbered){
          row.unshift('<span class="numbered">$</span>');
        }

        for(var j = 0, l = row.length; j < l; j++){
          var td = $(document.createElement('td')),
              content = row[j];

          if($.isFunction($t.config.format)){
            content = $t.config.format.call($t.container, $t.config.headers[j].name, content);
          }

          if($t.config.headers[j].name === 'numbered'){
            content = content.replace('$', count+'.');
            td.addClass('numbered-column');
          }

          td.addClass($t.config.headers[j].cssCls || '')
          .css($t.config.headers[j].css || {})
          .html(content)
          .appendTo(tr);
        }
        count++;
      }

      $t.checked = [];
      $t.tbody = $(tbody, $t.container);
    },

    generate: function(){
      var $t = this;

      $t.thead = $('thead', $t.container);
      $t.tbody = $('tbody', $t.container);

      var headers = $('th', $t.thead),
          hdrs = [];

      for(var i = 0, k = headers.length; i < k; i++){
        var item = $(headers[i]),
            sortable = item.attr('data-sortable') || false,
            sortType = item.attr('data-sort-type') || false,
            cssCls = item.attr('data-css-cls') || false,
            css = item.attr('data-css') || false;

        hdrs.push({
          title: item.html(),
          sortable: sortable,
          type: sortType,
          cssCls: cssCls,
          css: css
        });

        if(item.children().hasClass('cbox')){
          $t.config.options.checkbox = true;
          $t.checked = [];          
        }

        if(sortable){
          item.append(' <i class="pull-right icon-"></i>')
        }
      }

      $t.headers = hdrs;
    },

    input: function(){
      var $t = this,
        hidden = $(document.createElement('input'));

      hidden.attr({
        type: 'hidden',
        name: $t.config.name || $t.container.attr('id') || 'bootstrapGrid_' + Math.random(Math.floor(Math.random * 10000))
      });

      $t.hidden = hidden;

      $t.tbody.append(hidden);
    },

    events: function(){
      var $t = this;

      if($t.config.options.checkbox){
        $('.cbox', $t.tbody).bind('click', function(e){
          var checkbox = $(this),
              hidden = checkbox.next('input'),
              checked  = checkbox.hasClass('checked'),
              uid = checkbox.closest('tr').attr('data-uid'),
              action = checkbox.hasClass('checked') ? 'removeClass' : 'addClass';

          // remove check from select all if this was not set
          if(checked && $('.cbox', $t.thead).hasClass('checked')){
            $('.cbox', $t.thead).removeClass('checked');
          }
          // updated selected array
          $t.update(uid, checked ? 'remove' : 'add');
          // add selected class to row
          checkbox[action]('checked').closest('tr')[action]('selected ');
          // if a callback has been defined fire it
          if($.isFunction($t.config.onSelect)){
            // set scope of this (table DOM element), event, checked state, and array of selected row ids 
            $t.config.onSelect.call($t.container[0], e, checked, $t.checked);
          }
        });

        $('.cbox', $t.thead).bind('click', function(){
          var all = $(this),
              checked = all.hasClass('checked');
          // trigger click of checked or unchecked elements
          $(checked ? '.cbox.checked' : '.cbox:not(.checked)', $t.tbody).trigger('click');
          // apply class, checked or unchecked
          all[checked ? 'removeClass' : 'addClass']('checked');
        });
      }

      $('th[data-sortable]', $t.container).on('click', function(){
        var th = $(this),
            column = th.index(),
            key = $t.sorter(th.attr('data-sort') || 'string'),
            arrow = $('i', th),
            icons = $('i', $t.thead),
            direction = th.hasClass('desc') ? -1 : 1,
            rows = $('tr:visible', $t.tbody).get();

        $.each(rows, function(index, row){
          row.filter = key($(row).children('td').eq(column));
        });
        
        rows.sort(function(a, b){
          if (a.filter < b.filter) return -direction;
          if (a.filter > b.filter) return direction;
          return 0;
        });
        
        $.each(rows, function(i, row){
          $t.tbody.append(row);
          row.filter = null;
        });
        
        $('th', $t.thead).removeClass('sort desc asc').filter(':nth-child(' + (column + 1) + ')');

        icons.removeClass('icon-chevron-up icon-chevron-down');

        if(direction == 1){
          th.addClass('desc');          
          arrow.addClass('icon-chevron-up');
        }else{
          th.addClass('asc');
          arrow.addClass('icon-chevron-down');
        }

        if($t.config.options.highlight){
          th.addClass('sort');
          $('td', $t.tbody).removeClass('sort').filter(':nth-child(' + (column + 1) + ')').addClass('sort');
        }          

        $('tr:visible', $t.tbody).removeClass('odd even');
        $('tr:visible', $t.tbody).filter(':even').addClass('even').end().filter(':odd').addClass('odd');
      });
    },

    headers: function(){
      var $t = this;

      if($t.config.headers.length == 0){
        return;
      }

      if($t.config.options.checkbox){
        $t.config.headers.unshift({
          title: '<span class="cbox"></span>',
          sortable: false,
          cssCls: 'checkbox-column'
        });
      }

      if($t.config.options.numbered){
        $t.config.headers.unshift({
          name: 'numbered',
          title: '<span class="numbered"></span>',
          cssCls: 'numbered-column'
        });
      }

      var thead = $(document.createElement('thead')),
          tr = $(document.createElement('tr'));

      thead.append(tr).appendTo($t.container);

      for(var i = 0, k = $t.config.headers.length; i < k; i++){
        var th = $(document.createElement('th')),
            item = $t.config.headers[i],
            title = item.title || '';

        th.html(title);

        if(item.sortable){
          th.attr({
            'data-sortable': true,
            'data-sort':  item.type || 'string'
          })
          .css('cursor', 'pointer')
          .html(title + ' <i class="pull-right icon-"></i>');

          if(item.default){
            $t.sort = {
              index: i,
              direction: item.direction || ''              
            };
          }
        }

        th.addClass(' ' + item.cssCls || '')
        .css(item.css || {})
        .appendTo(tr);
      }

      $t.thead = $(thead, $t.container);
    },

    sorter: function(value){
      var key;

      if(value === 'str' || value === 'string'){
        key = function(val){
          return val.text().toUpperCase();
        };
      }else if(value === 'date'){
        key = function(val){
          return Date.parse(val.text());
        };
      }else if(value === 'int' || value === 'number'){
        key = function(val){
          return parseFloat(val.text().replace(/[^0-9.]/g, ''));
        };
      }else{
        key = null;
      }
    
      return key;
    },

    update: function(item, action){
      var $t = this;

      if(action === 'add'){
        if($.inArray(item, $t.checked) !== -1){
          return;
        }
        $t.checked.push(item);
      }else{
        if($.inArray(item, $t.checked) !== -1){
          for(var i = 0, k = $t.checked.length; i < k; i++){
            if($t.checked[i] === item){
              $t.checked.splice(i, 1);
            }
          }         
        }
      }

      $t.hidden.attr('value', $t.checked);
    }
  });

  $.extend($.fn, {
    getSelected: function(){
      var $t = $.data(this[0], 'grid'),
          array = [];

      if(!$t)
        throw('This element is not bound to any grid instance. Check your selector and try again.');
      
      for(var i = 0, k = $t.config.data.length; i < k; i++){
        if($.inArray($t.config.data[i].id, $t.checked) !== -1){
          array.push($t.config.data[i]);
        }
      }

      return array;
    }
  });
}(window, jQuery);