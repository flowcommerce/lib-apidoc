# docgen

- Use markdown files to compliment standard apidoc documentation. Allow
documentation to be formatted via markdown.
- When processing markdown docs, verify that references to items in service.json
are valid. If broken reference found, break the build/deploy.
- When releasing, warn if there are items in service.json that are missing in
smarkdown docs.

## Example markdown doc format

    #doc:model:address

    Some Formatted Text
    - with bullets
    - and [links](#nowhere)

    #doc:resource:DELETE:/tiers/:id

    Some specific details about deleting tiers...

# codegen
