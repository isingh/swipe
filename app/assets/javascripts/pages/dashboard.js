  $(document).ready(function(){

    $('.dropdown-toggle').dropdown();

    $('#grid').grid({
      name: 'myGrid',
      headers: [
        { name: 'card',     title: 'Card Number',            cssCls: 'hidden-tablet hidden-phone' },
        { name: 'date',     title: 'Date',        type: 'date', sortable: true, default: true, direction:'desc'},
        { name: 'business', title: 'Retailer',        cssCls: 'hidden-tablet hidden-phone' },
        // { name: 'desc',     title: 'What you bought', cssCls: 'hidden-tablet hidden-phone' },
        { name: 'purchase', title: 'Price',           cssCls: 'hidden-phone', sortable: true },
        { name: 'savings',  title: 'You saved',   sortable: true, type: 'number' },
        { name: 'total',    title: 'You spent',   sortable: true, type: 'number' },
        { name: 'offers',   title: 'Offers',      sortable: true, type: 'number' }
      ],
      data: [{
        id: 0,
        cells: [{
          card: '**** **** **** 4343',
          date: '10/14/2012',
          business: 'The Gap',
          //desc: 'lorem ipsum de colour. lorem ipsum de colour. ',
          purchase: '$76.50',
          savings: 'N/A',
          total: '$76.50',
          offers: '<a data-offer="123" class="offer-btn btn btn-mini" href="javascript:void(0);">View Offer</a>'
        }]
      },{
        id: 0,
        cells: [{
          card: '**** **** **** 0221',
          date: '10/16/2012',
          business: 'The Gap',
          //desc: 'lorem ipsum de colour. lorem ipsum de colour. ',
          purchase: '$92.97',
          savings: '10%',
          total: '$83.88',
          offers: '#HGZ0A2444HGNZ1'
        }]
      }],
      options: {
        border: true,
        checkbox: false,
        numbered: false,
        highlight: true,
        zebra: true
      }
    });

    $('.offer-btn').on('click', function(){
      $('#new').modal('show');
    });

    var data = [
      { label: "Money Spent", data: [[1,70]]},
      { label: "Savings", data: [[1,30]]}
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
