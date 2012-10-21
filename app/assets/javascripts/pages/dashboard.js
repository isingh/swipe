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
      { label: "Money Spent", data: [[1,198.50]]},
      { label: "Savings", data: [[1,32.75]]}
    ];

    var config = {
      colors: ['#444', '#FFAE45'], //['#FFAE45', '#79C2F5', '#014C81', '#46ACF5'],
      series: {
        pie: {
          show: true
        }
      },
      grid: {
        hoverable: true
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

    $.plot($("#pie"), data, config);


    $('#pie').bind('plothover', function (event, pos, item) {

      if(item){
        showTooltip({
          msg: '<b>$'+parseFloat(item.datapoint[1][0][1]).toFixed(2) + '</b> - ' + item.series.label,
          left: Math.floor(pos.pageX),
          top:  Math.floor(pos.pageY + 30)
        });
      }else{
        $('#tooltip').empty().remove();
      }
    });

function showTooltip(config){

  if($('#tooltip').length == 0){
    var tooltip = $(document.createElement('div'));
    tooltip.attr('id', 'tooltip');

    $(document.body).append(tooltip);
  }

    var left = config.left,
        maxWidth = $(window).width() + $(document).scrollLeft(),
        width = 240,
        oLeft = maxWidth < (left + width) ? left - width - 5 : left + 5;

    $('#tooltip').html('<div>'+config.msg+'</div>')
    .css({
      position: 'absolute',
      left: oLeft+ 'px',
      top: config.top+ 'px',
      'background-color': 'rgba(0,0,0, .75)',
      color: '#fff',
      padding: '10px',
      'border-radius': '5px'
    })
    .show();

}
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
