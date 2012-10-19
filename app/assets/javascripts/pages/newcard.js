$(document).ready(function() {
  /**
   * cardReg object
   * @type {Singleton Pattern}
   */
  var cardReg = {

    gridInfo: {
      name: 'myCards',
      headers: [{
        name: 'card',
        title: 'Card No',
        sortable: true,
        default: true,
        direction: 'desc'
      },{
        name: 'expiration',
        title: 'Expiration Date',
        cssCls: 'hidden-tablet hidden-phone',
        type: 'date'
      },{
        name: 'brand',
        title: 'Brand',
        cssCls: 'hidden-tablet hidden-phone',
        sortable: true
      },{
        name: 'offers',
        title: 'Offers'
      }],
      options: {
        border: true,
        checkbox: true,
        highlight: false,
        zebra: true
      },
    },

    enableAddNewCard: function() {
      $('#registration_form').submit(function(event) {
        $('.submit-button').attr('disabled', 'disabled');
        CardSpring.addCard(
          cardReg.cardSpringResponseHandler,
          {
            publisher_id: gon.new_card_info.publisher_id,
            security_token: gon.new_card_info.security_token,
            timestamp: gon.new_card_info.timestamp,
            hmac: gon.new_card_info.hmac,
            test_mode: gon.new_card_info.test_mode
          },
          {
            card_number: $('.card-number').val(),
            exp_month: $('.expiration-month').val(),
            exp_year: $('.expiration-year').val(),
            user_id: gon.new_card_info.user_id
          });
        return false;
      });
    },

    cardSpringResponseHandler: function(data){
      console.log("getting", data);

      if(data.error){
        alert("ERROR #"+data.error+": "+data.reason);
        return false;
      }

      $.ajax({
        url: "/user_cards",
        type: 'POST',
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        dataType: 'json',
        data: data,
        success: function(data, textStatus, xhr) {
          $('#new').modal('hide');
          cardReg.cleanForm($('#new'));
          cardReg.throwAlert("success", "Card added!", "Your card was successfully added!");
          cardReg.printCardsInfo(data.all_cards);
        },
        error: function(xhr, textStatus, errorThrown) {
          console.log("F**K!! There's an error!!");
          $('#new').modal('hide');
          alert("ERROR: "+errorThrown);
        }
      });
    },

    printCardsInfo: function(data){
      var info = this.gridInfo,
        $grid = $('#grid');
      info.data = this.structureData(data);
      if(info.data.length > 0){
        $('#nocardsmessage').hide();
        $grid.removeData('grid').empty();
        if($.type(data) == "string")
          $grid.grid(info);
        else
          $grid.grid('reload',info);
        $grid.show();
      }
    },

    structureData: function(data){
      if($.type(data) == "string")
        data = $.parseJSON(data);
      var ret = [];

      for(var i=0; i<data.length; i++){
        ret.push({
          id: data[i].id,
          cells: [{
            card: "**** **** **** "+ (data[i].last4 || "????"),
            expiration: data[i].expiration || "",
            brand: data[i].brand_string || "",
            offers: data[i].offers || []
          }]
        });
      }
      return ret;
    },

    cleanForm: function($form){
      $form.find('.card-number').val('');
      $form.find('.submit-button').removeAttr('disabled');
    },

    throwAlert: function(type, title, content){
      var $alert = $('#alertblock');
      $alert
        .removeClass()
        .addClass("alert alert-block alert-"+type)
        .find('.title')
          .html(title);
      $alert.find('.content').html(content);
      $alert.alert();
    }
  };

  // Calling everything
  cardReg.enableAddNewCard();
  if(gon.cards){
    cardReg.printCardsInfo(gon.cards);
  };
});
