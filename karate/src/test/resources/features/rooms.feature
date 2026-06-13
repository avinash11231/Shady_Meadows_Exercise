Feature: Room Inventory API

  Background:
    * url baseUrl + '/room'

  Scenario: Verify room list is non-empty and has valid prices
    Given method GET
    When status 200
    
    Then match response.rooms == '#array'
    * assert response.rooms.length > 0
    
    And match each response.rooms contains
      """
      {
        roomid:    '#number',
        roomName:  '#string',
        roomPrice: '#number'
      }
      """
    
    * def validRoom = response.rooms.find(r => r.roomPrice > 0)
    * match validRoom != null