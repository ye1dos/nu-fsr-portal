#!/bin/bash

docker build -t sandbox.almanit.kz:32500/fsr-front-ui:latest .
docker push sandbox.almanit.kz:32500/fsr-front-ui:latest
