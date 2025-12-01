Feature: Save, reload, import, and export layouts
  As a user who iterates on pages
  I want to persist and move my layouts
  So that I can resume work or transfer layouts later

  Background:
    Given I open the app
    And I start a new blank page

  Scenario: Save to local storage and reload
    When I place a "goal tracker" widget and a "time tracker" widget on the page
    And I save the layout
    And I reload the app
    Then the "goal tracker" and "time tracker" widgets reappear in the same positions

  Scenario: Export layout to JSON
    Given I have placed a "pomodoro tracker" widget and a "gratitude log" widget on the page
    When I export the layout
    Then I receive JSON that represents those widgets and their positions on the grid

  Scenario: Import layout from JSON
    Given I have a valid layout JSON with a "daily schedule" widget and a "notes" widget at specific positions
    When I import that layout JSON
    Then the "daily schedule" and "notes" widgets appear at those positions on the grid
