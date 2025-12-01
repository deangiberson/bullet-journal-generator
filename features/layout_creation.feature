Feature: Create and place widgets on a grid page
  As a user building a journal page
  I want to place widgets on a grid with snapping
  So that my layout is structured and predictable

  Background:
    Given I open the app
    And I start a new blank page

  Scenario: Place a widget on an empty grid
    When I add a "month calendar" widget to the page
    Then it snaps to the grid in the first available space
    And the widget is visible on the page

  Scenario: Snap to grid on drop
    When I drag a "todo" widget and drop it slightly off-grid
    Then it snaps to the nearest valid grid position

  Scenario: Block placement when it does not fit
    Given there is a "daily schedule" widget occupying the top-left area
    When I try to place a "3-month calendar" widget overlapping that area
    Then the placement is rejected
    And the existing layout stays unchanged
