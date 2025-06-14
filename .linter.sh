#!/bin/bash
cd /home/kavia/workspace/code-generation/fruitmatch-4x4-41013-9989ce5e/fruitmatch_4x4_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

