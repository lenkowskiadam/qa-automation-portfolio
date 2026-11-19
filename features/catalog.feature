@ui
Feature: Product catalogue
  As a customer
  I want to browse and search the catalogue
  So that I can find products and see their prices

  Scenario: Seeded product details are visible
    Given I open the product catalogue
    Then I see "Apple Juice (1000ml)" priced at "1.99¤"

  Scenario: Catalogue can be filtered by a search term
    Given I open the product catalogue
    When I search the catalogue for "banana"
    Then I see exactly 1 product
    And every visible product contains "banana"
