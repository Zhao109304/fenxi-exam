from docx import Document
import re
import json
import random
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = Document(r"E:\临时\思想道德与法治习题库(1).docx")

all_texts = []
for para in doc.paragraphs:
    text = para.text.strip()
    if text:
        all_texts.append(text)

print(f"Total text segments: {len(all_texts)}")

questions = []
current_question = None
current_answers = []
current_type = 'single'
all_answer_texts = []
question_pattern = re.compile(r'^\d+[、．.．]')
option_pattern = re.compile(r'^[A-Z][、．.．]?')

i = 0
while i < len(all_texts):
    text = all_texts[i]
    
    if text == '一、单选题':
        current_type = 'single'
        print(f"\n[Section] 单选题 at {i}")
        i += 1
        continue
    elif text == '二、多选题' or '多选题' in text:
        current_type = 'multiple'
        print(f"\n[Section] 多选题 at {i}")
        i += 1
        continue
    elif text == '三、判断题' or '判断题' in text:
        current_type = 'truefalse'
        print(f"\n[Section] 判断题 at {i}")
        i += 1
        continue
    elif text == '四、填空题' or '填空题' in text:
        current_type = 'fill'
        print(f"\n[Section] 填空题 at {i}")
        i += 1
        continue
    
    if question_pattern.match(text):
        if current_question:
            if current_type == 'single' and current_answers:
                first_answer = current_answers[0]
                current_question['answer'] = first_answer['letter']
                current_question['originalAnswer'] = first_answer['text']
            elif current_type == 'multiple' and current_answers:
                letters = ''.join(sorted([a['letter'] for a in current_answers]))
                texts = '；'.join([a['text'] for a in current_answers])
                current_question['answer'] = letters
                current_question['originalAnswer'] = texts
                current_question['correctOptions'] = [a['letter'] for a in current_answers]
            elif current_type == 'truefalse' and current_answers:
                first_answer = current_answers[0]
                current_question['answer'] = first_answer['letter']
                current_question['originalAnswer'] = first_answer['text']
            questions.append(current_question)
        
        question_text = question_pattern.sub('', text).strip()
        current_question = {
            'id': len(questions) + 1,
            'type': current_type,
            'question': question_text,
            'options': [],
            'answer': '',
            'originalAnswer': ''
        }
        current_answers = []
    
    elif option_pattern.match(text):
        letter = text[0]
        answer_text = option_pattern.sub('', text).strip()
        current_answers.append({
            'letter': letter,
            'text': answer_text
        })
        all_answer_texts.append(answer_text)
    
    i += 1

if current_question:
    if current_type == 'single' and current_answers:
        first_answer = current_answers[0]
        current_question['answer'] = first_answer['letter']
        current_question['originalAnswer'] = first_answer['text']
    elif current_type == 'multiple' and current_answers:
        letters = ''.join(sorted([a['letter'] for a in current_answers]))
        texts = '；'.join([a['text'] for a in current_answers])
        current_question['answer'] = letters
        current_question['originalAnswer'] = texts
        current_question['correctOptions'] = [a['letter'] for a in current_answers]
    elif current_type == 'truefalse' and current_answers:
        first_answer = current_answers[0]
        current_question['answer'] = first_answer['letter']
        current_question['originalAnswer'] = first_answer['text']
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

print("\nSample single question:")
single_sample = next((q for q in questions if q['type'] == 'single'), None)
if single_sample:
    print(f"  Q: {single_sample['question'][:80]}...")
    print(f"  Answer: {single_sample['answer']}")
    print(f"  Original: {single_sample['originalAnswer']}")

print("\nSample multiple question:")
multiple_sample = next((q for q in questions if q['type'] == 'multiple'), None)
if multiple_sample:
    print(f"  Q: {multiple_sample['question'][:80]}...")
    print(f"  Answer: {multiple_sample['answer']}")
    print(f"  Original: {multiple_sample['originalAnswer']}")
    print(f"  Correct options: {multiple_sample.get('correctOptions', [])}")

all_answer_texts = list(set(all_answer_texts))
random.seed(42)
random.shuffle(all_answer_texts)

print(f"\nTotal unique answer texts: {len(all_answer_texts)}")

letters = ['A', 'B', 'C', 'D']
letter_index = 0

for q in questions:
    if q['type'] == 'single':
        correct_answer = q['originalAnswer']
        
        distractors = []
        for ans in all_answer_texts:
            if ans != correct_answer and len(distractors) < 3:
                distractors.append(ans)
        
        while len(distractors) < 3:
            distractors.append(f"干扰选项{len(distractors) + 1}")
        
        all_options = [(correct_answer, True)] + [(d, False) for d in distractors]
        random.shuffle(all_options)
        
        q['options'] = []
        new_answer = ''
        for idx, (opt_text, is_correct) in enumerate(all_options):
            letter = letters[idx]
            q['options'].append(f"{letter}. {opt_text}")
            if is_correct:
                new_answer = letter
        q['answer'] = new_answer
    
    elif q['type'] == 'multiple':
        correct_answers = q['originalAnswer'].split('；')
        if len(correct_answers) > 4:
            correct_answers = correct_answers[:4]
        correct_letters = q.get('correctOptions', [letters[min(i, 3)] for i in range(len(correct_answers))])
        
        distractors = []
        for ans in all_answer_texts:
            if ans not in correct_answers and len(distractors) < 4 - len(correct_answers):
                distractors.append(ans)
        
        while len(distractors) < 4 - len(correct_answers):
            distractors.append(f"干扰选项{len(distractors) + 1}")
        
        all_options = [(ans, True) for ans in correct_answers] + [(d, False) for d in distractors]
        random.shuffle(all_options)
        
        q['options'] = []
        new_answers = []
        for idx, (opt_text, is_correct) in enumerate(all_options[:4]):
            letter = letters[idx]
            q['options'].append(f"{letter}. {opt_text}")
            if is_correct:
                new_answers.append(letter)
        q['answer'] = ''.join(sorted(new_answers))

print("\nAfter generating options:")
print("\nSample single question:")
single_sample = next((q for q in questions if q['type'] == 'single'), None)
if single_sample:
    print(f"  Q: {single_sample['question'][:80]}...")
    print(f"  Options: {single_sample['options']}")
    print(f"  Answer: {single_sample['answer']}")

print("\nSample multiple question:")
multiple_sample = next((q for q in questions if q['type'] == 'multiple'), None)
if multiple_sample:
    print(f"  Q: {multiple_sample['question'][:80]}...")
    print(f"  Options: {multiple_sample['options']}")
    print(f"  Answer: {multiple_sample['answer']}")

js_content = '''const questions_sixiangdaode = [
'''

for i, q in enumerate(questions):
    js_content += '  {\n'
    js_content += f'    "id": {q["id"]},\n'
    js_content += f'    "type": "{q["type"]}",\n'
    js_content += f'    "question": {json.dumps(q["question"], ensure_ascii=False)},\n'
    js_content += '    "options": [\n'
    for opt in q['options']:
        js_content += f'      {json.dumps(opt, ensure_ascii=False)},\n'
    js_content += '    ],\n'
    js_content += f'    "answer": {json.dumps(q["answer"], ensure_ascii=False)},\n'
    js_content += f'    "originalAnswer": {json.dumps(q["originalAnswer"], ensure_ascii=False)}\n'
    js_content += '  }'
    if i < len(questions) - 1:
        js_content += ','
    js_content += '\n'

js_content += '''];
window.questions_sixiangdaode = questions_sixiangdaode;
'''

with open('questions_sixiangdaode.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"\nSaved {len(questions)} questions to questions_sixiangdaode.js")

with open('questions_sixiangdaode.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Saved to questions_sixiangdaode.json")
