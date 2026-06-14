# Participant Work Folder

This folder is only for local organization. Files here are not used by the website.

Suggested structure:

```text
participant-work/
  participant-name/
    work-01/
      main.pd
      title.txt
      description.md
```

Use `_template/participant-name/work-01/` as a starting point. Copy that folder, rename
`participant-name` and `work-01`, then replace the placeholder files.

If you later want a work to appear on the website, copy its `main.pd` into
`public/patches/{id}/main.pd` and add the metadata to `src/content/patches.json`.
