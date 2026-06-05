import json
import io

with open(r'E:\临时\fuxi\questions.js', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('[')
end_idx = content.rfind(']') + 1
questions = json.loads(content[start_idx:end_idx])

filtered_questions = []
new_id = 1

for q in questions:
    if q['type'] != 'fill':
        q['id'] = new_id
        filtered_questions.append(q)
        new_id += 1

output = f'const questions = {json.dumps(filtered_questions, ensure_ascii=False, indent=2)};\n\nwindow.questions = questions;'

with open(r'E:\临时\fuxi\questions.js', 'w', encoding='utf-8') as f:
    f.write(output)

single_count = sum(1 for q in filtered_questions if q['type'] == 'single')
tf_count = sum(1 for q in filtered_questions if q['type'] == 'truefalse')

print(f"Generated {len(filtered_questions)} questions:")
print(f"  - {single_count} 单选题")
print(f"  - {tf_count} 判断题")
print(f"Removed 15 填空题")
