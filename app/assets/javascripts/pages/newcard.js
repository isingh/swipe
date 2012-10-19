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
      var info = this.gridInfo;
      info.data = this.structureData(data);
      $('#nocardsmessage').hide();
      $('#grid').grid(info).show();
    },

    structureData: function(data){
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
      console.log("ret", ret);
      return ret;
    }
  };

  // Calling everything
  console.log("Info", gon.new_card_info);
  cardReg.enableAddNewCard();
  if(gon.cards){
    console.log("cards", gon.cards);
    cardReg.printCardsInfo(gon.cards);
  };
});
