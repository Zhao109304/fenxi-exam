from docx import Document
import re

doc = Document(r'E:\临时\思想道德与法治习题库(1).docx')

all_paragraphs = []
for i, para in enumerate(doc.paragraphs):
    text = para.text.strip()
    if text:
        all_paragraphs.append(text)

print('检查单选题部分的第35-40题:')
print('='*80)
for i in range(68, 82):
    if i < len(all_paragraphs):
        text = all_paragraphs[i]
        is_question = bool(re.match(r'^\d+[、．.．]', text))
        is_answer = bool(re.match(r'^[A-D][、．.．]?', text))
        prefix = '[题]' if is_question else ('[答]' if is_answer else '     ')
        print(f'{i+1}: {prefix} {text[:100]}')

print()
print('检查判断题部分的前10题:')
print('='*80)
tf_start = 445
for i in range(tf_start, tf_start + 20):
    if i < len(all_paragraphs):
        text = all_paragraphs[i]
        is_question = bool(re.match(r'^\d+[、．.．]', text))
        prefix = '[题]' if is_question else '     '
        print(f'{i+1}: {prefix} {text[:100]}')
