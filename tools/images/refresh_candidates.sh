#!/bin/sh
# Look for pictures for species without one and for rejected ones, then export the new ones to the
# app's review screen. Slow: Wikimedia throttles anonymous use. Run from the project root.
set -e
python3 -I tools/images/fetch_images.py tools/images/species.json tools/images/candidates.json
python3 -I tools/images/find_alternatives.py
python3 -I tools/images/approve.py
python3 -I tools/images/export_candidates.py
