from docx import Document
import json
import random
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

def extract_all_text(file_path):
    doc = Document(file_path)
    all_paragraphs = []
    for i, para in enumerate(doc.paragraphs):
        text = para.text.strip()
        if text:
            all_paragraphs.append(text)
    return all_paragraphs

lines = extract_all_text(r'E:\临时\思想道德与法治习题库(1).docx')

print(f"Total lines: {len(lines)}")

# 找到各题型的分界线
sections = {}
for i, text in enumerate(lines):
    if '一、' in text and '单选' in text:
        sections['single'] = i + 1
    elif '二、' in text and '多选' in text:
        sections['multiple'] = i + 1
    elif '三、' in text and '判断' in text:
        sections['truefalse'] = i + 1
    elif '四、' in text and '填空' in text:
        sections['fill'] = i + 1
    elif '五、' in text:
        sections['qa'] = i + 1

print("\nSection boundaries:")
for name, idx in sections.items():
    print(f"  {name}: 开始于第 {idx} 段")

# 解析题目
questions = []
all_answer_texts = []

# 解析单选题（改进版：更健壮）
if 'single' in sections:
    start = sections['single']
    end = sections.get('multiple', len(lines))
    
    question_count = 0
    i = start
    
    while i < end:
        text = lines[i]
        
        # 检查是否是新题目
        if re.match(r'^\d+[、．.．]', text):
            question_count += 1
            question_text = re.sub(r'^\d+[、．.．]\s*', '', text).strip()
            
            # 提取括号中的答案标记
            answer_match = re.search(r'[（(]\s*([A-D])\s*[)）]', question_text)
            answer_letter = answer_match.group(1) if answer_match else ''
            
            # 清理题目文本
            question_text = re.sub(r'[（(]\s*[A-D]\s*[)）]', '', question_text).strip()
            if question_text.endswith('。') or question_text.endswith('，'):
                question_text = question_text[:-1]
            
            # 寻找答案行（下一行应该是答案，但格式可能不同）
            answer_text = ''
            j = i + 1
            while j < end:
                next_line = lines[j]
                # 答案行可能是：A. xxx, A.xxx, Axxx, A. xxx（有空格）
                if re.match(r'^[A-D][、．.．]?\s*', next_line):
                    answer_text = re.sub(r'^[A-D][、．.．]?\s*', '', next_line).strip()
                    all_answer_texts.append(answer_text)
                    break
                # 如果遇到下一个题目，说明没有找到答案行
                elif re.match(r'^\d+[、．.．]', next_line):
                    break
                j += 1
            
            questions.append({
                'id': len(questions) + 1,
                'type': 'single',
                'question': question_text,
                'answer': answer_letter,
                'originalAnswer': answer_text
            })
            i = j
        else:
            i += 1
    
    print(f"\n解析了 {question_count} 道单选题")

# 解析多选题（需要识别没有编号的题目）
if 'multiple' in sections:
    start = sections['multiple']
    end = sections.get('truefalse', len(lines))
    
    i = start
    question_count = 0
    
    while i < end:
        text = lines[i]
        
        # 检查是否是新题目（以数字+标点开头）
        is_numbered = bool(re.match(r'^\d+[、．.．]', text))
        
        # 检查是否是新题目但没有编号（后面跟着A/B/C/D选项）
        is_unnumbered = False
        if not is_numbered and not re.match(r'^[A-D][、．.．]?', text):
            j = i + 1
            while j < end:
                if re.match(r'^[A-D][、．.．]?', lines[j]):
                    is_unnumbered = True
                    break
                elif re.match(r'^\d+[、．.．]', lines[j]):
                    break
                j += 1
        
        if is_numbered or is_unnumbered:
            question_count += 1
            
            if is_numbered:
                # 提取题目编号和文本
                qnum_match = re.match(r'^(\d+)[、．.．]\s*(.*)', text)
                if qnum_match:
                    question_text = qnum_match.group(2).strip()
                else:
                    question_text = text
            else:
                question_text = text
            
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
            
            questions.append({
                'id': len(questions) + 1,
                'type': 'multiple',
                'question': question_text,
                'answer': answer_letters,
                'originalAnswer': '；'.join(answer_texts),
                'correctOptions': list(answer_letters) if answer_letters else [],
                'raw_answer_lines': answer_texts
            })
            i = j
        else:
            i += 1
    
    print(f"解析了 {question_count} 道多选题")

# 解析判断题（需要识别没有编号的题目）
if 'truefalse' in sections:
    start = sections['truefalse']
    end = sections.get('fill', len(lines))
    
    question_count = 0
    i = start
    
    while i < end:
        text = lines[i]
        
        # 检查是否是新题目（以数字+标点开头）
        is_numbered = bool(re.match(r'^\d+[、．.．]', text))
        
        # 检查是否是新题目但没有编号（包含√或×）
        is_unnumbered = False
        if not is_numbered:
            if '√' in text or '×' in text or '（√）' in text or '（×）' in text:
                is_unnumbered = True
        
        if is_numbered or is_unnumbered:
            question_count += 1
            
            if is_numbered:
                question_text = re.sub(r'^\d+[、．.．]\s*', '', text).strip()
            else:
                question_text = text
            
            # 提取答案标记：√ 或 ×
            is_correct = None
            if '（√）' in question_text or '√' in question_text:
                is_correct = True
            elif '（×）' in question_text or '×' in question_text:
                is_correct = False
            
            # 清理题目文本
            question_text = re.sub(r'[（(]\s*[√×对错]\s*[)）]', '', question_text).strip()
            question_text = re.sub(r'[√×]', '', question_text).strip()
            if question_text.endswith('。'):
                question_text = question_text[:-1]
            if not question_text.endswith('？'):
                question_text = question_text + '？'
            
            if is_correct is not None:
                questions.append({
                    'id': len(questions) + 1,
                    'type': 'truefalse',
                    'question': question_text,
                    'answer': 'A' if is_correct else 'B',
                    'originalAnswer': '正确' if is_correct else '错误'
                })
        i += 1
    
    print(f"解析了 {question_count} 道判断题")

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

print(f"\nFinal total: {len(questions)} questions")
print(f"  - 单选题: {single_count}")
print(f"  - 多选题: {multiple_count}")
print(f"  - 判断题: {truefalse_count}")
print(f"  - 填空题: 已移除")
