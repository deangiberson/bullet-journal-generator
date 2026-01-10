#!/usr/bin/env python3
"""Build script for GitHub Pages deployment.

Converts Flask template to static HTML and copies assets to /docs folder.
"""
import re
import shutil
from pathlib import Path


def clean_docs_folder():
    """Remove existing docs folder to start fresh."""
    docs = Path("docs")
    if docs.exists():
        # Keep any markdown files that might be documentation
        md_files = list(docs.glob("*.md"))
        temp_md = {}
        for md_file in md_files:
            temp_md[md_file.name] = md_file.read_text()

        shutil.rmtree(docs)
        docs.mkdir()

        # Restore markdown files
        for name, content in temp_md.items():
            (docs / name).write_text(content)
    else:
        docs.mkdir()


def convert_template_to_static():
    """Convert Flask template to static HTML with hardcoded asset paths."""
    template_path = Path("templates/index.html")
    output_path = Path("docs/index.html")

    html = template_path.read_text()

    # Replace url_for('static', filename='...') with relative paths
    # Pattern: {{ url_for('static', filename='...') }}
    pattern = r"{{\s*url_for\('static',\s*filename='([^']+)'\)\s*}}"

    def replace_url_for(match):
        filename = match.group(1)
        # For fonts and other assets in subdirectories, keep the path structure
        return f"./{filename}"

    html = re.sub(pattern, replace_url_for, html)

    output_path.write_text(html)
    print(f"✓ Converted template to {output_path}")


def copy_static_assets():
    """Copy all static files to docs folder."""
    static_src = Path("static")
    docs_dest = Path("docs")

    # Copy all files and folders from static/
    for item in static_src.iterdir():
        if item.is_file():
            shutil.copy2(item, docs_dest / item.name)
            print(f"✓ Copied {item.name}")
        elif item.is_dir():
            dest_dir = docs_dest / item.name
            if dest_dir.exists():
                shutil.rmtree(dest_dir)
            shutil.copytree(item, dest_dir)
            print(f"✓ Copied {item.name}/ directory")


def create_nojekyll():
    """Create .nojekyll file to prevent GitHub from processing files."""
    nojekyll = Path("docs/.nojekyll")
    nojekyll.touch()
    print("✓ Created .nojekyll")


def main():
    """Run the build process."""
    print("Building static site for GitHub Pages...\n")

    clean_docs_folder()
    convert_template_to_static()
    copy_static_assets()
    create_nojekyll()

    print("\n✅ Build complete! Files are ready in /docs folder")
    print("\nNext steps:")
    print("1. Commit the /docs folder to your repository")
    print("2. Go to GitHub repo Settings → Pages")
    print("3. Set Source to 'Deploy from a branch'")
    print("4. Select branch 'main' and folder '/docs'")
    print("5. Save and wait for deployment")


if __name__ == "__main__":
    main()
