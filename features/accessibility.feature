Feature: Keyboard and focus accessibility for layout actions
  As a keyboard-first user
  I want to add, select, and remove widgets without a mouse
  So that the page builder remains accessible

  Background:
    Given I open the app
    And I start a new blank page

  Scenario: Add a widget via keyboard
    When I focus the add-widget control
    And I use the keyboard to choose a "notes" widget
    Then the "notes" widget is added to the grid at the first available position
    And focus moves to the newly added widget

  Scenario: Navigate and remove via keyboard
    Given I have placed a "todo" widget and a "mood tracker" widget on the page
    When I navigate focus to the "todo" widget using the keyboard
    And I trigger its remove control via keyboard
    Then the "todo" widget is removed
    And focus moves predictably to the next logical control (e.g., the grid or another widget)
