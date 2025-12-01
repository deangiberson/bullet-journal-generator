Feature: Remove widgets from the page
  As a user refining my layout
  I want to remove widgets
  So that I can adjust the page as needed

  Background:
    Given I open the app
    And I start a new blank page
    And I have placed a "notes" widget on the page

  Scenario: Remove a widget via explicit control
    When I activate the remove control on the "notes" widget
    Then the "notes" widget is no longer on the page
