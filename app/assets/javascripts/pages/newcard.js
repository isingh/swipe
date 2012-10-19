$(document).ready(function() {
  /**
   * cardReg object
   * @type {Singleton Pattern}
   */
  var cardReg = {

    gridInfo: {
      name: 'myCards',
      headers: [{
        name: 'Card',
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
          },
          "OcGd5dea22Cs"
          );
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
        url: "/user/"+gon.new_card_info.user_id+"/user_cards",
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function(data, textStatus, xhr) {
          cardReg.printCardsInfo(data);
        },
        error: function(xhr, textStatus, errorThrown) {
          console.log("F**K!! There's an error!!");
        }
      });
    },

    printCardsInfo: function(data){
      var info = cardReg.grid_info;
      info.data = data;
      $('#grid').grid(gridInfo);
    }
  };

  // Calling everything
  console.log("Info", gon.new_card_info);
  cardReg.enableAddNewCard();
  if(gon.cards){
    cardReg.printCardsInfo(gon.cards);
  };
});
