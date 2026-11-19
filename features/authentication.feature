Feature: Customer authentication
  A customer should be able to register and log in,
  while invalid or duplicate credentials are rejected safely.

  @ui
  Scenario: Registered customer can log in
    Given I am a newly registered customer
    When I log in with my registered credentials
    Then I am taken to the product catalogue

  @ui
  Scenario: Invalid UI credentials are rejected
    Given I open the login page
    When I log in with email "missing.user@example.test" and password "Wrong!Password123"
    Then I see the invalid credentials message
    And I remain on the login page

  @ui
  Scenario: Mismatched password confirmation prevents registration
    Given I open the registration page
    When I enter different passwords in the password fields
    Then I see the passwords do not match message
    And the registration button is disabled

  @api
  Scenario: Created customer receives a usable login token
    Given I create a unique customer through the API
    When I log in through the API with that customer's credentials
    Then the API returns a valid authentication token

  @api
  Scenario: Duplicate customer email is rejected
    Given I create a unique customer through the API
    When I try to create the same customer again through the API
    Then the API reports that the email must be unique

  @api
  Scenario: Unknown customer login is rejected without technical details
    When I log in through the API as a non-existent customer
    Then the API rejects the login without leaking technical details
