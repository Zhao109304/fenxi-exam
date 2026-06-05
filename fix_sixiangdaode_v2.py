import zipfile
import xml.etree.ElementTree as ET
import json
import random
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

def extract_all_text(file_path):
    with zipfile.ZipFile(file_path, 'r') as z:
        xml_content = z.read('word/document.xml')
    
    root = ET.fromstring(xml_content)
    
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = root.findall('.//w:p', namespaces)
    
    all_text = []
    for para in paragraphs:
        text = ''
        runs = para.findall('.//w:t', namespaces)
        for t in runs:
            if t.text:
                text += t.text
        
        if text.strip():
            all_text.append(text.strip())
    
    return all_text

lines = extract_all_text(r'E:\临时\思想道德与法治习题库(1).docx')

print(f"Total lines: {len(lines)}")

# 找到各题型的分界线
sections = {}
for i, line in enumerate(lines):
    if '一、' in line and '单选' in line:
        sections['single'] = i + 1
    elif '二、' in line and '多选' in line:
        sections['multiple'] = i + 1
    elif '三、' in line and '判断' in line:
        sections['truefalse'] = i + 1
    elif '四、' in line and '填空' in line:
        sections['fill'] = i + 1
    elif '五、' in line:
        sections['qa'] = i + 1

print("\nSection boundaries:")
for name, idx in sections.items():
    print(f"  {name}: 开始于第 {idx} 行")

# 统计各题型
def count_questions(start_idx, end_idx):
    count = 0
    for i in range(start_idx, end_idx):
        if re.match(r'^\d+[、．.．]', lines[i]):
            count += 1
    return count

print("\nCounting questions...")
if 'single' in sections:
    end = sections.get('multiple', len(lines))
    single_count = count_questions(sections['single'], end)
    print(f"  单选题: {single_count}")

if 'multiple' in sections:
    end = sections.get('truefalse', len(lines))
    multiple_count = count_questions(sections['multiple'], end)
    print(f"  多选题: {multiple_count}")

if 'truefalse' in sections:
    end = sections.get('fill', len(lines))
    tf_count = count_questions(sections['truefalse'], end)
    print(f"  判断题: {tf_count}")

# 解析题目
questions = []
all_answer_texts = []

# 解析单选题
if 'single' in sections:
    start = sections['single']
    end = sections.get('multiple', len(lines))
    
    i = start
    while i < end:
        line = lines[i]
        if re.match(r'^\d+[、．.．]', line):
            question_text = re.sub(r'^\d+[、．.．]\s*', '', line).strip()
            # 提取括号中的答案标记
            answer_match = re.search(r'[（(]\s*([A-D])\s*[)）]', question_text)
            answer_letter = answer_match.group(1) if answer_match else ''
            
            # 清理题目文本
            question_text = re.sub(r'[（(]\s*[A-D]\s*[)）]', '', question_text).strip()
            if question_text.endswith('。') or question_text.endswith('，'):
                question_text = question_text[:-1]
            
            # 获取正确答案文本
            answer_text = ''
            if i + 1 < end:
                next_line = lines[i + 1]
                if re.match(r'^[A-D][、．.．]?', next_line):
                    answer_text = re.sub(r'^[A-D][、．.．]?\s*', '', next_line).strip()
                    all_answer_texts.append(answer_text)
            
            questions.append({
                'id': len(questions) + 1,
                'type': 'single',
                'question': question_text,
                'answer': answer_letter,
                'originalAnswer': answer_text,
                'raw_answer_line': answer_text
            })
            i += 2
        else:
            i += 1

# 解析多选题
if 'multiple' in sections:
    start = sections['multiple']
    end = sections.get('truefalse', len(lines))
    
    i = start
    while i < end:
        line = lines[i]
        if re.match(r'^\d+[、．.．]', line):
            question_text = re.sub(r'^\d+[、．.．]\s*', '', line).strip()
            # 提取括号中的答案标记（2-4个字母）
            answer_match = re.search(r'[（(]\s*([A-D]{2,4})\s*[)）]', question_text)
            answer_letters = answer_match.group(1) if answer_match else ''
            
            # 清理题目文本
            question_text = re.sub(r'[（(]\s*[A-D]{2,4}\s*[)）]', '', question_text).strip()
            if question_text.endswith('。') or question_text.endswith('，'):
                question_text = question_text[:-1]
            
            # 获取正确答案文本（接下来的几行，都是以A/B/C/D开头的）
            answer_texts = []
            j = i + 1
            while j < end and re.match(r'^[A-D][、．.．]?', lines[j]):
                ans_text = re.sub(r'^[A-D][、．.．]?\s*', '', lines[j]).strip()
                answer_texts.append(ans_text)
                all_answer_texts.append(ans_text)
                j += 1
            
            # 如果没有找到答案行，可能是"正确答案 A,B,C,D"格式
            if not answer_texts and j < end:
                correct_answer_line = lines[j]
                if '正确答案' in correct_answer_line:
                    answer_letters_match = re.search(r'正确答案\s*[:：]?\s*([A-D,\s、]+)', correct_answer_line)
                    if answer_letters_match:
                        letters_str = answer_letters_match.group(1)
                        answer_letters = ''.join([l for l in letters_str if l in 'ABCD'])
            
            questions.append({
                'id': len(questions) + 1,
                'type': 'multiple',
                'question': question_text,
                'answer': answer_letters,
                'originalAnswer': '；'.join(answer_texts) if answer_texts else '',
                'correctOptions': list(answer_letters) if answer_letters else [],
                'raw_answer_lines': answer_texts
            })
            i = j
        else:
            i += 1

# 解析判断题
if 'truefalse' in sections:
    start = sections['truefalse']
    end = sections.get('fill', len(lines))
    
    i = start
    while i < end:
        line = lines[i]
        if re.match(r'^\d+[、．.．]', line):
            question_text = re.sub(r'^\d+[、．.．]\s*', '', line).strip()
            
            # 提取答案标记：√ 或 ×
            is_correct = None
            if '（√）' in question_text or '（对）' in question_text or '√' in question_text:
                is_correct = True
            elif '（×）' in question_text or '（错）' in question_text or '×' in question_text:
                is_correct = False
            
            # 清理题目文本
            question_text = re.sub(r'[（(]\s*[√×对错]\s*[)）]', '', question_text).strip()
            question_text = re.sub(r'[√×]', '', question_text).strip()
            if question_text.endswith('。'):
                question_text = question_text[:-1]
            
            questions.append({
                'id': len(questions) + 1,
                'type': 'truefalse',
                'question': question_text + '？',
                'answer': 'A' if is_correct else 'B',
                'originalAnswer': '正确' if is_correct else '错误'
            })
        i += 1

print(f"\nParsed {len(questions)} questions:")
single_count = sum(1 for q in questions if q['type'] == 'single')
multiple_count = sum(1 for q in questions if q['type'] == 'multiple')
truefalse_count = sum(1 for q in questions if q['type'] == 'truefalse')
print(f"  单选题: {single_count}")
print(f"  多选题: {multiple_count}")
print(f"  判断题: {truefalse_count}")

# 生成干扰选项
letters = ['A', 'B', 'C', 'D']
all_answer_texts = list(set(all_answer_texts))
random.seed(42)
random.shuffle(all_answer_texts)

print(f"\nTotal unique answer texts: {len(all_answer_texts)}")

# 为单选题生成干扰选项
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
        correct_answers = q['originalAnswer'].split('；') if q['originalAnswer'] else []
        if len(correct_answers) > 4:
            correct_answers = correct_answers[:4]
        
        # 如果没有正确答案文本，使用干扰选项
        if not correct_answers or not correct_answers[0]:
            correct_answers = [f"正确选项{i+1}" for i in range(2)]
        
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
    
    elif q['type'] == 'truefalse':
        q['options'] = ['A. 正确', 'B. 错误']

# 生成JS文件
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

with open(r'E:\临时\fuxi\questions_sixiangdaode.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"\nSaved {len(questions)} questions to questions_sixiangdaode.js")

# 保存JSON版本
with open(r'E:\临时\fuxi\questions_sixiangdaode.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Saved to questions_sixiangdaode.json")

# 打印样本
print("\nSample single question:")
single_sample = next((q for q in questions if q['type'] == 'single'), None)
if single_sample:
    print(f"  Q: {single_sample['question']}")
    print(f"  Options: {single_sample['options']}")
    print(f"  Answer: {single_sample['answer']}")
    print(f"  Original: {single_sample['originalAnswer']}")

print("\nSample multiple question:")
multiple_sample = next((q for q in questions if q['type'] == 'multiple'), None)
if multiple_sample:
    print(f"  Q: {multiple_sample['question']}")
    print(f"  Options: {multiple_sample['options']}")
    print(f"  Answer: {multiple_sample['answer']}")
    print(f"  Original: {multiple_sample['originalAnswer']}")

print("\nSample truefalse question:")
tf_sample = next((q for q in questions if q['type'] == 'truefalse'), None)
if tf_sample:
    print(f"  Q: {tf_sample['question']}")
    print(f"  Options: {tf_sample['options']}")
    print(f"  Answer: {tf_sample['answer']}")
    print(f"  Original: {tf_sample['originalAnswer']}")
