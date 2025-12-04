from pathlib import Path

from flask import Flask, render_template


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(
        __name__,
        static_folder="static",
        template_folder="templates",
    )

    @app.route("/")
    def index():
        return render_template("index.html")

    return app


app = create_app()


if __name__ == "__main__":
    # Simple dev server; rely on `uv run flask --app app run --debug` during development.
    app.run(debug=True)
