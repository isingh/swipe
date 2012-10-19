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
        name: 'new_transaction',
        title: 'Test'
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
      console.log("response", data);
      if(data.error){
        $('#new_card').modal('hide');
        cardReg.cleanForm($('#new_card'));
        cardReg.throwAlert("error", "Something wrong happened...", "ERROR #"+data.error+(data.reason ? ": "+data.reason : ""));
        return false;
      }

      $.ajax({
        url: "/user_cards",
        type: 'POST',
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        dataType: 'json',
        data: data,
        success: function(data, textStatus, xhr) {
          $('#new_card').modal('hide');
          cardReg.cleanForm($('#new_card'));
          cardReg.throwAlert("success", "Card added!", "Your card was successfully added!");
          cardReg.printCardsInfo(data.all_cards);
        },
        error: function(xhr, textStatus, errorThrown) {
          $('#new_card').modal('hide');
          cardReg.cleanForm($('#new_card'));
          cardReg.throwAlert("error", "Something wrong happened...", errorThrown);
        }
      });
    },

    printCardsInfo: function(data){
      var info = this.gridInfo,
        $grid = $('#grid');
      info.data = this.structureData(data);
      if(info.data.length > 0){
        $('#nocardsmessage').hide();

        if($.type(data) == "string")
          $grid.grid(info);
        else{
          console.log("reloading", info.data);
          $grid.grid('reload', info.data);
        }

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
            new_transaction: '<a data-card="'+data[i].id+'" class="transaction-btn btn btn-mini" data-toggle="modal" href="#new_transaction">Fake New Trans.</a>'
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
      var $alert = $('<div>');
      $alert
        .attr('id','alertblock')
        .addClass("alert alert-block fade in alert-"+type)
        .attr('style',"margin-top: 10px");
      $('<button>')
        .addClass('close')
        .attr('data-dismiss','alert')
        .html("×")
        .appendTo($alert);
      $('<h4>')
        .addClass('alert-heading')
        .html(title)
        .appendTo($alert);
      $('<p>')
        .html(content)
        .appendTo($alert);
      $alert.prependTo('.content.container-fluid');
    },

    enableSimulateTransaction: function(){
      $('#card_grid').on('click', '.transaction-btn', function(e){
        $('#new_transaction').data('current_card', $(e.currentTarget).data('card'));
      });

      $('#transaction_form').submit(function(event) {
        event.preventDefault();
        $('.submit-button').attr('disabled', 'disabled');
        var current_card_id = $('#new_transaction').data("current_card");
        $.ajax({
          url: '/user_cards/'+current_card_id+'/add_transaction',
          type: 'POST',
          beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
          dataType: 'json',
          data: {amount: $("#transaction_form .amount").val()},
          complete: function(){
            $('#new_transaction').modal('hide');
            cardReg.cleanForm($('#new_transaction'));
          },
          success: function(data, textStatus, xhr) {
            console.log("OK!", data);
            cardReg.throwAlert("success", "Transaction created!", "It seems that nothing happens, but your transaction is being processed and you'll receive a SMS soon");
          },
          error: function(xhr, textStatus, errorThrown) {
            cardReg.throwAlert("error", "Something wrong happened...", errorThrown);
          }
        });

        return false;
      });
    }
  };

  // Calling everything
  cardReg.enableAddNewCard();
  cardReg.enableSimulateTransaction();
  if(gon.cards){
    cardReg.printCardsInfo(gon.cards);
  };
});
