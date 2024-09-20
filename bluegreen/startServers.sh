#!/bin/bash

# python -m http.server 9000 --bind 127.0.0.8 --directory ~/blog_assets/bluegreen/green &
# python -m http.server 9000 --bind 127.0.0.9 --directory ~/blog_assets/bluegreen/blue &
python -m http.server 9008 --directory ./blue &
python -m http.server 9009 --directory ./green &