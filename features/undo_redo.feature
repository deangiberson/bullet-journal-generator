Feature: Undo and redo layout changes
  As a user experimenting with layouts
  I want to undo and redo changes
  So that I can recover from mistakes quickly

  Background:
    Given I open the app
    And I start a new blank page

  Scenario: Undo and redo widget placement
    When I add a "habit tracker" widget to the page
    And I undo the last change
    Then the "habit tracker" widget is not on the page
    When I redo the last undone change
    Then the "habit tracker" widget appears again at the same position

  Scenario: Undo and redo widget removal
    Given I have placed a "mood tracker" widget on the page
    When I remove the "mood tracker" widget
    And I undo the last change
    Then the "mood tracker" widget is restored to its prior position
    When I redo the last undone change
    Then the "mood tracker" widget is removed again
