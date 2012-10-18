$(document).ready(function() {
  var cardSpringResponseHandler = function(data){
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
      complete: function(xhr, textStatus) {
        //called when complete
        console.log("Action complete");
      },
      success: function(data, textStatus, xhr) {
        //called when successful
        console.log("New card added!! :3");
      },
      error: function(xhr, textStatus, errorThrown) {
        //called when there is an error
        console.log("F**K!! There's an error!!");
      }
    });
  };

  console.log("Info", gon.new_card_info);

  $('#registration_form').submit(function(event) {
    $('.submit-button').attr('disabled', 'disabled');
    CardSpring.addCard(
        cardSpringResponseHandler,
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
});
