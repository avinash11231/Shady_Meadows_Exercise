Feature: Branding API Verification

  Background:
    * url baseUrl + '/branding'

  Scenario: Validate branding name and contact email
    Given method GET
    When status 200
    Then match response.name == 'Shady Meadows B&B'
    And match response.contact.email == '#regex [a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}'
    And match response.description == '#string'
    And match response.contact.phone == '#string'