# Nipuna Chamara — personal website

Responsive static academic website presenting research, teaching, extension and outreach, and professional community connections. No build process or dependencies are required.

## Preview

Open `index.html` directly in a browser, or serve this directory with a local static web server.

## Publish on GitHub Pages

The intended repository is `nipuna-chamara/nipuna-chamara.github.io`, if available and owned by the user. Alternatively use a project repository named `personal`.

Upload the files to the repository's `main` branch. In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/ (root)**, then save. The account repository serves at `https://nipuna-chamara.github.io/`; a `personal` repository serves at `https://nipuna-chamara.github.io/personal/`.

All assets and internal links are relative, so both locations work. `.nojekyll` keeps this a plain static site.

## Update content without coding

1. Open `editor.html` in your browser (or choose **Content editor** in the footer).
2. Choose **Profile & home banner** or one of the seven tabs, including **News**.
3. Edit headings and introductions. Open entries to edit them, or choose **Add entry**. Each entry supports a category, date/year, title, description, and optional link.
4. Preview the tab. Download `content.js` and replace the existing file in this folder. If the download is named `content (1).js`, rename it to `content.js`.
5. Refresh `index.html` to see the changes. Upload the same `content.js` to your GitHub Pages branch to publish them.

The editor saves drafts in browser storage where available. Drafts are not published automatically. Use **Export draft backup** to preserve edits or move them to another browser, then **Import backup** to restore them. Anyone can open the static editor; it grants no permission to change your public website. Publishing requires repository write access.

Photos can be added to `assets/`. To replace the portrait, update its path in **Profile & home banner**. New entries can hold course materials, publications, research projects, outreach events, or personal social activities. Existing social entries use verified professional information only.

## Files

- `index.html`: page shell and navigation container
- `content.js`: all editable profile and tab content
- `theme.css`: UNL scarlet and cream design and responsive layout
- `compact.js`, `compact.css`: compact personal layout, tab navigation, expandable entries, search, pagination, and homepage news
- `editor.html`, `editor.js`: local form editor, preview, export, backup/import
- `assets/nipuna-chamara.jpg`: user-supplied portrait
- `sources.html`: research sources, design references, and credits

The earlier design is retained in `index.previous.html` and `styles.previous.css`. These backups are excluded from the delivery ZIP. No hosted CMS or GitHub credentials are embedded in this website.

Content researched October 23, 2026. See `sources.html` for original references. Review public content periodically, especially position, course offerings, product availability, and external links.

## News and compact layout

Choose **News** in the content editor, then **Add news**. Fill in the headline, description, date, and optional source link. Use YYYY-MM-DD dates for consistent newest-first ordering. The homepage automatically shows the latest three items. Download and replace `content.js` as above to publish changes.

Every content tab displays at most four entries per page. Select a headline to expand its description and source link. Search narrows the list and resets pagination. Older browser drafts and JSON backups are migrated to include News without discarding existing entries.

The visible identity is personal: there is no university banner or university color branding. Factual academic history and source links remain in the content. The external reference fawadnajam.com was unreachable during this update, so its current design could not be inspected.
