#!/usr/bin/env bash

docker system prune;
docker run --name JobSiteApiDb -e POSTGRES_PASSWORD=password postgres;
# docker exec -it [container-id] bash