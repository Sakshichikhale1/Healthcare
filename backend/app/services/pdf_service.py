import pdfplumber

def extract_text_from_pdf(file_path: str):
    """Extract text from a PDF file using pdfplumber."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error in extract_text_from_pdf: {e}")
        return None
