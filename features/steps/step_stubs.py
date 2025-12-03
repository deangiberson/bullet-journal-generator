from behave import given, when, then


def pending(step_name: str) -> None:
    """Helper to mark steps as pending."""
    raise NotImplementedError(f"Step pending: {step_name}")


@given("I open the app")
def step_open_app(context):
    pending("I open the app")


@given("I start a new blank page")
def step_start_blank_page(context):
    pending("I start a new blank page")


@when('I add a "{widget}" widget to the page')
@given('I have placed a "{widget}" widget on the page')
def step_place_widget(context, widget):
    pending(f"Place widget: {widget}")


@then("it snaps to the grid in the first available space")
def step_snap_first_space(context):
    pending("Snap to grid in first available space")


@then("the widget is visible on the page")
def step_widget_visible(context):
    pending("Widget visible on page")


@when('I drag a "{widget}" widget and drop it slightly off-grid')
def step_drag_widget_off_grid(context, widget):
    pending(f"Drag widget off-grid: {widget}")


@then("it snaps to the nearest valid grid position")
def step_snap_nearest(context):
    pending("Snap to nearest valid grid position")


@given('there is a "{widget}" widget occupying the top-left area')
def step_widget_occupies_top_left(context, widget):
    pending(f"Widget occupying top-left: {widget}")


@when('I try to place a "{widget}" widget overlapping that area')
def step_try_place_overlapping(context, widget):
    pending(f"Try placing overlapping widget: {widget}")


@then("the placement is rejected")
def step_placement_rejected(context):
    pending("Placement rejected")


@then("the existing layout stays unchanged")
def step_layout_unchanged(context):
    pending("Layout stays unchanged")


@when('I activate the remove control on the "{widget}" widget')
def step_activate_remove_control(context, widget):
    pending(f"Activate remove control: {widget}")


@then('the "{widget}" widget is no longer on the page')
@then('the "{widget}" widget is not on the page')
def step_widget_absent(context, widget):
    pending(f"Widget absent: {widget}")


@when("I undo the last change")
def step_undo_change(context):
    pending("Undo last change")


@when("I redo the last undone change")
def step_redo_change(context):
    pending("Redo last undone change")


@then('the "{widget}" widget appears again at the same position')
def step_widget_reappears(context, widget):
    pending(f"Widget reappears at same position: {widget}")


@when('I remove the "{widget}" widget')
def step_remove_widget(context, widget):
    pending(f"Remove widget: {widget}")


@then('the "{widget}" widget is restored to its prior position')
def step_widget_restored(context, widget):
    pending(f"Widget restored: {widget}")


@then('the "{widget}" widget is removed again')
def step_widget_removed_again(context, widget):
    pending(f"Widget removed again: {widget}")


@when('I place a "{widget1}" widget and a "{widget2}" widget on the page')
def step_place_two_widgets(context, widget1, widget2):
    pending(f"Place two widgets: {widget1}, {widget2}")


@when("I save the layout")
def step_save_layout(context):
    pending("Save layout")


@when("I reload the app")
def step_reload_app(context):
    pending("Reload app")


@then('the "{widget1}" and "{widget2}" widgets reappear in the same positions')
def step_widgets_reappear(context, widget1, widget2):
    pending(f"Widgets reappear: {widget1}, {widget2}")


@given('I have placed a "{widget1}" widget and a "{widget2}" widget on the page')
def step_have_two_widgets(context, widget1, widget2):
    pending(f"Have two widgets placed: {widget1}, {widget2}")


@when("I export the layout")
def step_export_layout(context):
    pending("Export layout")


@then("I receive JSON that represents those widgets and their positions on the grid")
def step_receive_json(context):
    pending("Receive layout JSON")


@given('I have a valid layout JSON with a "{widget1}" widget and a "{widget2}" widget at specific positions')
def step_have_layout_json(context, widget1, widget2):
    pending(f"Have layout JSON: {widget1}, {widget2}")


@when("I import that layout JSON")
def step_import_layout_json(context):
    pending("Import layout JSON")


@then('the "{widget1}" and "{widget2}" widgets appear at those positions on the grid')
def step_widgets_appear_from_json(context, widget1, widget2):
    pending(f"Widgets appear at positions from JSON: {widget1}, {widget2}")


@when("I export the page to PDF")
def step_export_pdf(context):
    pending("Export page to PDF")


@then(
    'the generated PDF shows the "{widget1}" and "{widget2}" widgets in the same positions and sizes as on screen'
)
def step_pdf_parity(context, widget1, widget2):
    pending(f"PDF parity for widgets: {widget1}, {widget2}")


@when("I focus the add-widget control")
def step_focus_add_widget(context):
    pending("Focus add-widget control")


@when('I use the keyboard to choose a "{widget}" widget')
def step_keyboard_choose_widget(context, widget):
    pending(f"Keyboard choose widget: {widget}")


@then("focus moves to the newly added widget")
def step_focus_moves_new_widget(context):
    pending("Focus moves to newly added widget")


@when('I navigate focus to the "{widget}" widget using the keyboard')
def step_navigate_focus_widget(context, widget):
    pending(f"Navigate focus to widget: {widget}")


@when("I trigger its remove control via keyboard")
def step_trigger_remove_via_keyboard(context):
    pending("Trigger remove control via keyboard")


@then('the "{widget}" widget is removed')
def step_widget_removed(context, widget):
    pending(f"Widget removed: {widget}")


@then("focus moves predictably to the next logical control (e.g., the grid or another widget)")
def step_focus_moves_predictably(context):
    pending("Focus moves predictably after removal")
