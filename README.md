# ecfr

Download parts of the [Electronic Code of Federal Regulations (eCFR)](https://www.ecfr.gov/) and save them as HTML or optionally as DOCX.

## Requirements

- Node.js 18+

```bash
# Clone the project repository
git clone https://github.com/paulopes/ecfr.git

# Navigate to the project directory
cd ecfr

# Install dependencies
npm install

# Link the command globally so you can run `ecfr` from anywhere
npm link
```


This makes the `ecfr` command available globally.

## Usage

### With command-line arguments

```bash
ecfr <date> <title> <part>
```

Example:

```bash
ecfr 2026-03-10 47 54
```

By default, this saves the original HTML file.

To convert to DOCX, pass `--docx` or `-d`:

```bash
ecfr --docx 2026-03-10 47 54
ecfr -d 2026-03-10 47 54
```

### Interactive mode

```bash
ecfr
```

You will be prompted for:

1. **Date** - document version date in `YYYY-MM-DD` format
2. **Title number** - CFR title (e.g. `47`)
3. **Part number** - CFR part (e.g. `54`)

## Output

By default, the script generates an HTML file in the current directory, e.g. `ecfr_title47_part54_2026-03-10.html`.

With `--docx` or `-d`, the script generates a DOCX file, e.g. `ecfr_title47_part54_2026-03-10.docx`.

## API

This tool uses the eCFR public API:

```
https://www.ecfr.gov/api/renderer/v1/content/enhanced/{date}/title-{title}?part={part}
```

## License

This project is licensed under the [Apache License 2.0](LICENSE).
