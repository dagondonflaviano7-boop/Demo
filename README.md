# PDF to Excel Converter — with Images in Cells

Convert any PDF (including embedded images) to an Excel `.xlsx` file.
Live stats powered by **Firebase Realtime Database**.

---

## Project Structure

```
pdf-to-excel/
├── backend/
│   ├── main.py                  ← FastAPI entry point
│   ├── requirements.txt
│   ├── routers/
│   │   └── convert.py           ← POST /api/convert
│   └── services/
│       ├── pdf_parser.py        ← PDF → structured data
│       └── excel_builder.py     ← Structured data → .xlsx with images
├── frontend/
│   └── index.html               ← Single-file frontend (no build step needed)
├── render.yaml                  ← Render deployment config
└── .gitignore
```

---

## Deployment

### 1. Deploy Backend → Render (free)

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect this GitHub repo
3. Settings:

| Field | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

4. Deploy — you'll get a URL like `https://pdf-to-excel-api.onrender.com`

### 2. Update the API URL in frontend

Open `frontend/index.html` and change line:
```js
const API_URL = "https://YOUR-APP.onrender.com";
```
to your actual Render URL.

### 3. Deploy Frontend → Vercel (free)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import this GitHub repo
3. Set **Root Directory** to `frontend`
4. Deploy

---

## Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Select project `pdftoexcel-43588`
3. **Realtime Database → Rules** → set:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Click **Publish**

---

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
Just open `frontend/index.html` in your browser.
Change `API_URL` to `http://localhost:8000` for local testing.

---

## API

### `POST /api/convert`

| Field | Type | Default | Description |
|---|---|---|---|
| `file` | File | required | PDF to convert |
| `embed_images` | bool | true | Embed images into Excel cells |
| `preserve_tables` | bool | true | Keep table structure |
| `ocr_enabled` | bool | false | OCR for scanned pages |
| `one_sheet_per_page` | bool | true | One worksheet per PDF page |

**Response:** `.xlsx` file download with headers `X-Pages` and `X-Images`.

---

## Tech Stack

- **Backend:** Python 3.11, FastAPI, pdfplumber, PyMuPDF, openpyxl, Pillow, Tesseract OCR
- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)
- **Database:** Firebase Realtime Database
