import sys
import zipfile
import xml.etree.ElementTree as ET
import io

def extract_all_text(file_path):
    with zipfile.ZipFile(file_path, 'r') as z:
        xml_content = z.read('word/document.xml')
    
    root = ET.fromstring(xml_content)
    
    namespaces = {
        'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    }
    
    paragraphs = root.findall('.//w:p', namespaces)
    
    all_text = []
    for i, para in enumerate(paragraphs):
        text = ''
        runs = para.findall('.//w:t', namespaces)
        for t in runs:
            if t.text:
                text += t.text
        
        if text.strip():
            all_text.append(f"[{i:03d}] {text}")
    
    return '\n'.join(all_text)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python extract_text.py <docx_file>")
        sys.exit(1)
    
    text = extract_all_text(sys.argv[1])
    
    output_path = sys.argv[1].replace('.docx', '_full_text.txt')
    with io.open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print(f"Full text extracted to: {output_path}")
    print("\nFirst 100 lines:")
    print('\n'.join(text.split('\n')[:100]))
