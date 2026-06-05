import sys
import zipfile
import xml.etree.ElementTree as ET
import json
import io
import re
import random

def extract_all_text(file_path):
    with zipfile.ZipFile(file_path, 'r') as z:
        xml_content = z.read('word/document.xml')
    
    root = ET.fromstring(xml_content)
    
    namespaces = {
        'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    }
    
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

def parse_docx(file_path):
    lines = extract_all_text(file_path)
    
    all_single_choice = []
    all_fill = []
    all_truefalse = []
    
    current_section = None
    question_id = 1
    
    fill_distractors = {
        '性状': ['鉴别', '检查', '含量测定'],
        'ICH': ['FDA', 'WHO', 'GMP'],
        '固定相': ['流动相', '吸附相', '分配相'],
        '指纹区': ['特征区', '官能团区', '指纹谱区'],
        '5': ['3', '4', '6'],
        '电泳': ['薄层色谱', '纸色谱', '柱色谱'],
        '顶空进样': ['直接进样', '分流进样', '不分流进样'],
        '溴化汞': ['氯化汞', '碘化汞', '硫化汞'],
        '炽灼残渣': ['干燥失重', '水分测定', '灰分测定'],
        '高湿': ['低温', '高压', '强光'],
        '含量测定': ['鉴别', '检查', '性状'],
        '1ml': ['2ml', '5ml', '10ml'],
        '振动': ['电子跃迁', '核自旋', '分子转动'],
        '药品的质量标准': ['通则', '索引', '附录'],
        '取样': ['送样', '留样', '检验'],
        '90~139 mmHg': ['80~120 mmHg', '100~140 mmHg', '70~130 mmHg'],
        '60~89mmHg': ['50~79 mmHg', '70~99 mmHg', '60~90 mmHg'],
        '中度热': ['低热', '高热', '超高热'],
        '超高热': ['低热', '中度热', '高热'],
        '包膜': ['被膜', '假膜', '纤维膜'],
        '膨胀性': ['浸润性', '侵袭性', '转移性'],
        '高热持续': ['低热期', '体温上升', '恢复期'],
        '体温下降': ['体温上升', '高热持续', '低热期'],
        '膨胀性或局限性': ['浸润性', '侵袭性', '转移性'],
        '不或无': ['可发生', '常发生', '易发生'],
        '主诉': ['现病史', '既往史', '个人史'],
        '系统性': ['全面性', '完整性', '准确性'],
        '浸润性': ['膨胀性', '局限性', '外生性'],
        '转移': ['复发', '浸润', '侵袭'],
        '140~159 mmHg': ['130~149 mmHg', '150~169 mmHg', '120~139 mmHg'],
        '90~99 mmHg': ['80~89 mmHg', '100~109 mmHg', '70~89 mmHg'],
        '瘀斑': ['瘀点', '紫癜', '血肿'],
        '红痣': ['丘疹', '斑疹', '结节'],
        '症状或体征': ['主诉', '现病史', '既往史'],
        '持续时间': ['发作时间', '病程', '治疗时间'],
        '160~179 mmHg': ['150~169 mmHg', '170~189 mmHg', '140~159 mmHg'],
        '100~109mmHg': ['90~99 mmHg', '110~119 mmHg', '80~89 mmHg'],
        '低热': ['中度热', '高热', '超高热'],
        '高热': ['低热', '中度热', '超高热'],
        '1~2': ['0.5~1', '2~3', '3~5'],
        '>5mm': ['2~3mm', '3~4mm', '1~2mm'],
        '出血点': ['瘀点', '紫癜', '瘀斑'],
        '紫癜': ['瘀点', '瘀斑', '血肿'],
        '既往病史': ['个人史', '家族史', '现病史'],
        '关联性': ['相关性', '相似性', '一致性'],
    }
    
    single_choice_distractors = {
        '代表性': ['科学性', '真实性', '准确性'],
        '保证用药的有效、合理、安全': ['提高药物纯度', '降低药物成本', '增加药物产量'],
        '70%': ['60%', '80%', '90%'],
        '二烯醇基': ['羟基', '羧基', '氨基'],
        '血液': ['尿液', '唾液', '毛发'],
        '不加供试品的情况下，按样品测定方法同法操作': ['不加试剂的操作', '不加溶剂的操作', '不加指示剂的操作'],
        '1.5': ['1.0', '2.0', '0.5'],
        '一般鉴别': ['特殊鉴别', '专属鉴别', '化学鉴别'],
        '气相色谱法': ['高效液相色谱法', '薄层色谱法', '紫外分光光度法'],
        '重金属检查法': ['砷盐检查法', '氯化物检查法', '铁盐检查法'],
        '标准品': ['对照品', '参考品', '供试品'],
        'β-内酰胺环': ['噻唑环', '苯环', '酰胺键'],
        '崩解时限检查': ['重量差异检查', '含量均匀度检查', '溶出度检查'],
        '对氨基苯甲酸': ['水杨酸', '苯胺', '苯甲酸'],
        '酚酞': ['甲基橙', '石蕊', '溴甲酚绿'],
        '称取重量应准确至所取重量的千分之一': ['称取重量应准确至所取重量的万分之一', '称取重量应准确至所取重量的百分之一', '称取重量应准确至所取重量的十分之一'],
        '药材或制剂经加热炽灼灰化遗留的无机物': ['药材或制剂经加热炽灼灰化遗留的有机物', '药材或制剂经加热挥发后的残留物', '药材或制剂经干燥后的残留物'],
        '甲醛硫酸反应': ['银镜反应', '重氮化反应', '水解反应'],
        '丙酮': ['甲醛', '乙醇', '甲醇'],
        '±10%': ['±5%', '±15%', '±20%'],
        '已知药物真伪': ['未知药物真伪', '药物含量', '药物纯度'],
        '化学原料药的含量测定': ['制剂的含量测定', '生物样品的测定', '药物鉴别'],
        '色谱峰的对称性': ['色谱峰的高度', '色谱峰的宽度', '色谱峰的面积'],
        '自身稀释对照法': ['杂质对照品法', '外标法', '内标法'],
        '永停法': ['电位法', '指示剂法', '电导法'],
        '磺胺甲噁唑': ['阿司匹林', '青霉素', '维生素C'],
        '药物于310 nm无吸收，而杂质有吸收': ['药物和杂质均有吸收', '药物有吸收，杂质无吸收', '药物和杂质均无吸收'],
        'GMP': ['GSP', 'GLP', 'GCP'],
        '避免亚硝酸挥发和分解': ['加快反应速度', '使反应完全', '防止氧化'],
        '重复性': ['中间精密度', '重现性', '稳定性'],
        'TLC 法': ['HPLC 法', 'GC 法', 'UV 法'],
        '维生素C': ['维生素A', '维生素B', '维生素D'],
        '加速反应': ['减慢反应', '使反应完全', '防止分解'],
        '中国药品通用名称': ['国际非专利药品名称', '商品名', '化学名'],
        '对光吸收性质的差异': ['溶解度差异', '熔点差异', '旋光度差异'],
        '紫外检测器': ['荧光检测器', '示差折光检测器', '电化学检测器'],
        'HPLC': ['TLC', 'GC', 'UV'],
        '产生新生态的氢': ['还原砷盐', '氧化砷盐', '中和砷盐'],
        '检测限': ['定量限', '线性范围', '耐用性'],
        '可以考核生产工艺和企业管理是否正常': ['可以控制药物的毒性', '可以提高药物的疗效', '可以降低药物的成本'],
        '氢化可的松': ['阿司匹林', '青霉素', '肾上腺素'],
        '准确度': ['精密度', '线性', '范围'],
        '氘灯': ['钨灯', '汞灯', '钠灯'],
        'Chinese Pharmacopoeia，ChP': ['United States Pharmacopoeia，USP', 'British Pharmacopoeia，BP', 'European Pharmacopoeia，EP'],
        '青霉素': ['维生素C', '阿司匹林', '磺胺甲噁唑'],
        '临床表现相似': ['关节疼痛', '红肿发热', '功能障碍'],
        '出血': ['穿孔', '幽门梗阻', '癌变'],
        '问诊': ['体格检查', '实验室检查', '影像学检查'],
        '血肌酐': ['血尿素氮', '尿常规', '肾小球滤过率'],
        '下垂部位先出现，休息减轻，对称、凹陷、坚实，可有胸腹水，心脏增大、肝大等': ['面部先出现，晨起明显', '腹水为主', '下肢水肿伴腹水'],
        '晚上': ['早上', '中午', '饭后'],
        '电离辐射灭菌法': ['高压蒸汽灭菌法', '煮沸消毒法', '紫外线消毒法'],
        '肾病面容': ['肝病面容', '甲亢面容', '贫血面容'],
        '高压蒸汽灭菌法': ['煮沸消毒法', '紫外线消毒法', '化学消毒剂浸泡法'],
        '管形尿': ['蛋白尿', '血尿', '水肿'],
        '呕血黑便': ['腹痛腹胀', '恶心呕吐', '食欲不振'],
        '胃、十二指肠和胰腺疾病': ['结肠疾病', '肝胆疾病', '阑尾疾病'],
        '生理反射是否存在': ['意识是否清楚', '对疼痛刺激的反应', '瞳孔是否等大'],
        '急性阑尾炎': ['急性胆囊炎', '急性胰腺炎', '急性胃肠炎'],
        '原发性慢性肾小球肾炎': ['糖尿病肾病', '高血压肾损害', '狼疮性肾炎'],
        '大叶性肺炎': ['支气管哮喘', '肺气肿', '胸腔积液'],
        '胃镜和胃粘膜活检': ['胃液分析', 'X线钡餐检查', '幽门螺杆菌检测'],
        '结肠疾病、膀胱炎、盆腔炎等': ['胃十二指肠疾病', '肝胆疾病', '胰腺疾病'],
        '幻听': ['幻视', '幻嗅', '幻味'],
        '早上': ['中午', '晚上', '饭后'],
        '肝病面容': ['肾病面容', '贫血面容', '甲亢面容'],
        '滑膜炎': ['关节软骨破坏', '骨质疏松', '关节畸形'],
        '偶见畸形': ['对称性关节畸形', '关节强直', '功能丧失'],
        '下肢对称性凹陷性水肿，逐渐向上蔓延，常伴随腹水、黄疸、肝掌、蜘蛛痣等体征。': ['下垂部位先出现', '面部水肿为主', '全身水肿'],
        '非典型抗精神病药物（如奥氮平、利培酮）': ['典型抗精神病药物（如氯丙嗪）', '抗抑郁药', '心境稳定剂'],
        '症状缓解后即可立即停药': ['长期维持治疗', '个体化治疗', '小剂量开始逐渐加量'],
        '消瘦、体重减轻，水肿从足部开始至全身': ['肥胖', '水肿从面部开始', '腹水为主'],
        '对时间、地点、人物的定向力发生障碍': ['意识完全丧失', '能回答简单问题', '对刺激无反应'],
    }
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        if line == '单选题':
            current_section = 'single'
            continue
        elif line == '填空题':
            current_section = 'fill'
            continue
        elif line in ['四、判断改错', '判断题']:
            current_section = 'truefalse'
            continue
        elif line in ['三、综合题', '五、简答题', '六．名词解释', '简答题']:
            current_section = 'skip'
            continue
        
        if current_section == 'single':
            match = re.search(r'^(.*?)\s+([A-D])\.(.+)$', line)
            if match:
                question_text = match.group(1).strip()
                answer_letter = match.group(2)
                answer_text = match.group(3).strip()
                
                if question_text and answer_text:
                    distractors = single_choice_distractors.get(answer_text, ['选项一', '选项二', '选项三'])
                    all_single_choice.append({
                        'question': question_text,
                        'answer_letter': answer_letter,
                        'answer_text': answer_text,
                        'distractors': distractors
                    })
        
        elif current_section == 'fill':
            fill_match = re.search(r'①[:：]?\s*([^。\n]+)', line)
            if fill_match:
                answer = fill_match.group(1).strip()
                clean_question = re.sub(r'\s*①[:：]?\s*[^。\n]*[。]?', '______。', line)
                clean_question = re.sub(r'^\d+[\.、]\s*', '', clean_question)
                
                distractors = fill_distractors.get(answer, ['鉴别', '检查', '含量测定'])
                all_fill.append({
                    'question': clean_question,
                    'answer': answer,
                    'distractors': distractors
                })
        
        elif current_section == 'truefalse':
            if ('（√）' in line or '（×）' in line or '（✓）' in line or '（✗）' in line) and not line.startswith('错误'):
                is_correct = '√' in line or '✓' in line
                clean_question = re.sub(r'[（(][√×✓✗][)）]\s*$', '', line)
                clean_question = re.sub(r'^\d+[\.、]\s*', '', clean_question)
                clean_question = clean_question.strip()
                
                if clean_question:
                    all_truefalse.append({
                        'question': clean_question,
                        'is_correct': is_correct
                    })
    
    js_questions = []
    qid = 1
    
    for q in all_single_choice:
        distractors = q['distractors'][:3]
        correct_letter = q['answer_letter']
        
        option_letters = ['A', 'B', 'C', 'D']
        options = []
        distractor_idx = 0
        
        for letter in option_letters:
            if letter == correct_letter:
                options.append(q['answer_text'])
            else:
                options.append(distractors[distractor_idx])
                distractor_idx += 1
        
        js_q = {
            'id': qid,
            'type': 'single',
            'question': q['question'],
            'options': [f'{letter}. {opt}' for letter, opt in zip(option_letters, options)],
            'answer': correct_letter,
            'originalAnswer': q['answer_text']
        }
        js_questions.append(js_q)
        qid += 1
    
    for q in all_fill:
        answer = q['answer']
        distractors = q['distractors']
        if len(distractors) < 3:
            distractors = distractors + ['鉴别', '检查'][:3-len(distractors)]
        
        options = [answer] + distractors[:3]
        random.shuffle(options)
        
        option_letters = ['A', 'B', 'C', 'D']
        correct_letter = option_letters[options.index(answer)]
        
        js_q = {
            'id': qid,
            'type': 'fill',
            'question': q['question'],
            'options': [f'{letter}. {opt}' for letter, opt in zip(option_letters, options)],
            'answer': correct_letter,
            'originalAnswer': answer
        }
        js_questions.append(js_q)
        qid += 1
    
    for q in all_truefalse:
        js_q = {
            'id': qid,
            'type': 'truefalse',
            'question': q['question'] + '？',
            'options': ['A. 正确', 'B. 错误'],
            'answer': 'A' if q['is_correct'] else 'B',
            'originalAnswer': '正确' if q['is_correct'] else '错误'
        }
        js_questions.append(js_q)
        qid += 1
    
    return js_questions, len(all_single_choice), len(all_fill), len(all_truefalse)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python parse_docx.py <docx_file>")
        sys.exit(1)
    
    questions, single_count, fill_count, tf_count = parse_docx(sys.argv[1])
    
    output = f'const questions = {json.dumps(questions, ensure_ascii=False, indent=2)};\n\nif (typeof module !== "undefined" && module.exports) {{\n  module.exports = questions;\n}}'
    
    output_path = sys.argv[1].replace('.docx', '_questions.js')
    with io.open(output_path, 'w', encoding='utf-8') as f:
        f.write(output)
    
    print(f"Generated {len(questions)} questions:")
    print(f"  - {single_count} 单选题")
    print(f"  - {fill_count} 填空题")
    print(f"  - {tf_count} 判断题")
    print(f"Saved to: {output_path}")
    
    print("\nFirst 5 single choice questions:")
    for i, q in enumerate(questions[:5]):
        if q['type'] == 'single':
            print(f"\nQ{i+1}: {q['question']}")
            for opt in q['options']:
                print(f"  {opt}")
            print(f"  Answer: {q['answer']}")
