Feature: Booking Creation API

  Background:
    * url baseUrl

  Scenario: Create a booking using a valid room ID
    
    Given path '/room'
    And method GET
    Then status 200
    * def roomId = response.rooms[0].roomid

    * def randomDays = Math.floor(Math.random() * 200) + 30
    * def checkin  = new Date(Date.now() + randomDays * 86400000).toISOString().split('T')[0]
    * def checkout = new Date(Date.now() + (randomDays + 4) * 86400000).toISOString().split('T')[0]

    Given url baseUrl + '/booking'
    And header Content-Type = 'application/json'
    And request
      """
      {
        "roomid":      #(roomId),
        "firstname":   "Test",
        "lastname":    "User",
        "depositpaid": true,
        "bookingdates": {
          "checkin":  "#(checkin)",
          "checkout": "#(checkout)"
        },
        "email":       "test@example.com",
        "phone":       "01234567890"
      }
      """
    And method POST
    Then status 201
    And match response.bookingid == '#number'
    And match response.firstname == 'Test'
    And match response.roomid    == roomId