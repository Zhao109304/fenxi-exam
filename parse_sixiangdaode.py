from docx import Document
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = Document(r"E:\临时\思想道德与法治习题库(1).docx")

questions = []
current_question = None
current_options = []
current_type = 'single'

for para in doc.paragraphs:
    text = para.text.strip()
    if not text:
        continue
    
    if text == '一、单选题':
        current_type = 'single'
        print(f"[Section] 单选题")
        continue
    elif text == '二、多选题':
        current_type = 'multiple'
        print(f"[Section] 多选题")
        continue
    elif text == '三、判断题':
        current_type = 'truefalse'
        print(f"[Section] 判断题")
        continue
    elif text == '四、填空题':
        current_type = 'fill'
        print(f"[Section] 填空题")
        continue
    
    if re.match(r'^\d+[、．.]', text):
        if current_question:
            if current_options:
                current_question['options'] = current_options
            questions.append(current_question)
        
        question_text = re.sub(r'^\d+[、．.]\s*', '', text)
        current_question = {
            'id': len(questions) + 1,
            'type': current_type,
            'question': question_text,
            'options': [],
            'answer': '',
            'originalAnswer': ''
        }
        current_options = []
    
    elif re.match(r'^[A-Z][、．.．]', text):
        if current_question:
            option_letter = text[0]
            option_text = re.sub(r'^[A-Z][、．.．]\s*', '', text)
            current_options.append(f"{option_letter}. {option_text}")
    
    elif text.startswith('答案：') or text.startswith('答案:'):
        if current_question:
            answer_text = re.sub(r'^答案[：:]\s*', '', text)
            current_question['originalAnswer'] = answer_text
            
            if current_type == 'multiple':
                current_question['answer'] = answer_text
            elif current_type == 'truefalse':
                if '对' in answer_text or '正确' in answer_text or answer_text == 'A':
                    current_question['answer'] = 'A'
                else:
                    current_question['answer'] = 'B'
                if not current_options:
                    current_options = ['A. 对', 'B. 错']
            else:
                current_question['answer'] = answer_text

if current_question:
    if current_options:
        current_question['options'] = current_options
    questions.append(current_question)

print(f"\nTotal questions: {len(questions)}")

single_count = sum(1 for q in questions if q['type'] == 'single')
multiple_count = sum(1 for q in questions if q['type'] == 'multiple')
truefalse_count = sum(1 for q in questions if q['type'] == 'truefalse')
fill_count = sum(1 for q in questions if q['type'] == 'fill')

print(f"单选题: {single_count}")
print(f"多选题: {multiple_count}")
print(f"判断题: {truefalse_count}")
print(f"填空题: {fill_count}")

print("\nSample questions:")
for q in questions[:5]:
    print(f"\nQ{q['id']}: {q['question'][:50]}...")
    print(f"  Type: {q['type']}")
    print(f"  Options: {len(q['options'])}")
    print(f"  Answer: {q['answer']}")

with open('questions_sixiangdaode.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("\nSaved to questions_sixiangdaode.json")
