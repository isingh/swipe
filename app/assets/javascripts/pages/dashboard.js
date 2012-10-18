  $(document).ready(function(){

    $('.dropdown-toggle').dropdown();

    $('#grid').grid({
      name: 'myGrid',
      headers: [{
        name: 'name',
        title: 'Date',
        sortable: true
      },{
        name: 'offers',
        title: 'Retailer',
        cssCls: 'hidden-tablet hidden-phone'
      },{
        name: 'type',
        title: 'Purchase',
        cssCls: 'hidden-phone',
        sortable: true
      },{
        name: 'bid',
        title: 'Savings',
        sortable: true,
        type: 'number'
      },{
        name: 'budget',
        title: '',
        sortable: true,
        type: 'number'
      },{
        name: 'start',
        title: 'Starts',
        sortable: true,
        default: true,
        direction: 'desc',
        type: 'date'
      },{
        name: 'end',
        title: 'Ends',
        sortable: true,
        cssCls: 'hidden-phone',
        type: 'date'
      }],
      data: [{
        id: '01235',
        cells: [{
          name: 'New Apple',
          offers: [['012345', 'MacBook Retina'], ['124355', 'iPhone 5']],
          type: 'CPC',
          bid: '$.25',
          budget: '$4,500.00',
          start: '07/01/2012',
          end: '07/30/2012'
        }]
      },{
        id: '12232',
        cells: [{
          name: 'Lululemon',
          offers: [['1234', 'Mens Pro V'], ['12345', 'Womens Yoga Bag']],
          type: 'CPA',
          bid: '$5.00',
          budget: '$20,000.00',
          start: '06/21/2012',
          end: '06/28/2012'
        }]
      },{
        id: '15553',
        cells: [{
          name: 'Snap &amp; Sync',
          offers: [['1234', 'Snap &amp; Sync']],
          type: 'PPI',
          bid: '$1.25',
          budget: '$50,000.00',
          start: '06/21/2012',
          end: '06/30/2012'
        }]
      }],
      options: {
        border: true,
        checkbox: true,
        highlight: false,
        zebra: true
      },
      onSelect: function(e, checked, selected){
        if(selected.length == 1){
          $('.campaign-actions .btn').removeClass('disabled');
        }else if(selected.length >= 2){
          $('#edit').addClass('disabled');
        }else{
          $('.campaign-actions .btn').addClass('disabled');
        }
      },
      format: function(column, content){
        var str = '',
            labels =  {
              'PPI': 'label-inverse',
              'CPC': 'label-info',
              'CPA': 'label-success'
            };

        if(column === 'offers'){
          for(var i = 0, k = content.length; i < k; i++){
            str += '<a href="offers?id='+ content[i][0] +'"><code>'+ content[i][1] +'</code></a> ';
          }

          return str;
        }else if(column === 'type'){
          return '<span class="label ' + labels[content] + '">' + content + '</span>';
        }else{
          return content;
        }
      }
    });

    var data = [
      { label: "Spent", data: [[1,70]]},
      { label: "Saved", data: [[1,30]]}
    ];

    var config = {
      colors: ['#FFAE45', '#79C2F5', '#014C81', '#46ACF5'],
      series: {
        pie: {
          show: true
        }
      },
      legend: {
        labelBoxBorderColor: 'none',
        labelFormatter: function(label, data){
          var percent = Math.round(data.percent);
          return '<div class="campaign-pie-labels">' + label + '</div>';
        },
        container: $('#legend')
      }
    };

    $('#delete, #deactive').on('click', function(){
      var btn = $(this);

      if(btn.hasClass('disabled'))
        return;

      var selected = $('#grid').getSelected(),
          msg = '',
          count = 1,
          length = selected.length,
          connector = length == 2 ? ' & ' : ', ',
          plural = length > 1 ? 's' : '';

        for(var row in selected){
         msg += '"<b>' + selected[row].cells[0].name + '</b>"' + (length == 1 || count == length ? '' : connector);
         count++;
        }

        if(btn.attr('id') === 'delete'){
          $('#deleteModal').find('h3').html('Delete Campaign'+plural).end().find('.modal-body').html('<p>Are you sure you want to remove the campaign' + plural + ' '+msg+'?</p>');
        }else{
          $('#deleteModal').find('h3').html('Deactivate Campaign'+plural).end().find('.modal-body').html('<p>Are you sure you want to deactivate the campaign' + plural + ' '+msg+'?</p>');

        }

      $('#deleteModal').modal();
    });

    $.plot($("#pie"), data, config);

    $(window).resize(function(){
      $.plot($("#pie"), data, config);
    })


    $('.icon-remove').on('click', function(){
      $(this).parent().remove();
    });

    $('.dropdown-toggle').dropdown();
    $('.typeahead').typeahead();
    $('*[rel="popover"]').popover();
    $('*[rel="tooltip"]').tooltip();

    $('.btn').bind('click', function(){
      if($(this).hasClass('disabled'))
        return;
    });
  });
