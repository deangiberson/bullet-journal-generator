Feature: Export the current layout to PDF with visual parity
  As a user preparing to print or share my page
  I want a PDF that matches what I see on screen
  So that the exported page is faithful to my design

  Background:
    Given I open the app
    And I start a new blank page

  Scenario: PDF export matches on-screen layout
    When I place a "month calendar" widget and a "todo" widget on the page
    And I export the page to PDF
    Then the generated PDF shows the "month calendar" and "todo" widgets in the same positions and sizes as on screen
