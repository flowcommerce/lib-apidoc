# docgen

- When processing markdown docs, verify that references to items in service.json
are valid. If broken reference found, break the build/deploy.
- When releasing, warn if there are items in service.json that are missing in
smarkdown docs.
