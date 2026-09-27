#!/bin/sh

cd /usr/share/nginx/html

echo "window.env = " > env.js
jq -n --argfile vars allowed_env_vars.json 'env | with_entries(select(.key | IN($vars[])))' >> env.js

sed -i -E "s/env\.js(\?v=\d*)?/env.js?v=$(date +%s%N)/g" index.html

nginx -g "daemon off;"
