const questions = [
  {
    "id": 1,
    "type": "single",
    "question": "取样应遵循的原则是",
    "options": [
      "A. 科学性",
      "B. 真实性",
      "C. 准确性",
      "D. 代表性"
    ],
    "answer": "D",
    "originalAnswer": "代表性"
  },
  {
    "id": 2,
    "type": "single",
    "question": "药物分析学科最终研究的目的应该是",
    "options": [
      "A. 提高药物纯度",
      "B. 保证用药的有效、合理、安全",
      "C. 降低药物成本",
      "D. 增加药物产量"
    ],
    "answer": "B",
    "originalAnswer": "保证用药的有效、合理、安全"
  },
  {
    "id": 3,
    "type": "single",
    "question": "溶出度测定的结果判断：6片中每片的溶出度按标示量计算，均应不低于规定限度Q，除另有规定外，“Q”值应为标",
    "options": [
      "A. 60%",
      "B. 70%",
      "C. 80%",
      "D. 90%"
    ],
    "answer": "B",
    "originalAnswer": "70%"
  },
  {
    "id": 4,
    "type": "single",
    "question": "维生素C能与硝酸银试液反应生成去氢抗坏血酸和金属银黑色沉淀，是因为",
    "options": [
      "A. 二烯醇基",
      "B. 羟基",
      "C. 羧基",
      "D. 氨基"
    ],
    "answer": "A",
    "originalAnswer": "二烯醇基"
  },
  {
    "id": 5,
    "type": "single",
    "question": "体内药物分析最常采用的体内样品",
    "options": [
      "A. 血液",
      "B. 尿液",
      "C. 唾液",
      "D. 毛发"
    ],
    "answer": "A",
    "originalAnswer": "血液"
  },
  {
    "id": 6,
    "type": "single",
    "question": "空白试验是",
    "options": [
      "A. 不加试剂的操作",
      "B. 不加溶剂的操作",
      "C. 不加供试品的情况下，按样品测定方法同法操作",
      "D. 不加指示剂的操作"
    ],
    "answer": "C",
    "originalAnswer": "不加供试品的情况下，按样品测定方法同法操作"
  },
  {
    "id": 7,
    "type": "single",
    "question": "定量分析要求色谱峰分离度应大于",
    "options": [
      "A. 1.0",
      "B. 2.0",
      "C. 1.5",
      "D. 0.5"
    ],
    "answer": "C",
    "originalAnswer": "1.5"
  },
  {
    "id": 8,
    "type": "single",
    "question": "在药品质量标准中，无机金属盐的焰色反应归属的项目是",
    "options": [
      "A. 特殊鉴别",
      "B. 一般鉴别",
      "C. 专属鉴别",
      "D. 化学鉴别"
    ],
    "answer": "B",
    "originalAnswer": "一般鉴别"
  },
  {
    "id": 9,
    "type": "single",
    "question": "残留溶剂是合成原料药，辅料或制剂生产的过程中使用的，但在工艺中未能完全除去有机溶剂。残留溶剂检查通常采用的方法是",
    "options": [
      "A. 气相色谱法",
      "B. 高效液相色谱法",
      "C. 薄层色谱法",
      "D. 紫外分光光度法"
    ],
    "answer": "A",
    "originalAnswer": "气相色谱法"
  },
  {
    "id": 10,
    "type": "single",
    "question": "硫代乙酰胺法是指检查药物中的",
    "options": [
      "A. 砷盐检查法",
      "B. 氯化物检查法",
      "C. 铁盐检查法",
      "D. 重金属检查法"
    ],
    "answer": "D",
    "originalAnswer": "重金属检查法"
  },
  {
    "id": 11,
    "type": "single",
    "question": "用于生物检定、抗生素或生化药品中含量或效价测定的标准物质，按效价单位（或μg）计，称为",
    "options": [
      "A. 对照品",
      "B. 参考品",
      "C. 标准品",
      "D. 供试品"
    ],
    "answer": "C",
    "originalAnswer": "标准品"
  },
  {
    "id": 12,
    "type": "single",
    "question": "青霉素类药物不稳定，主要是由于分子中的",
    "options": [
      "A. 噻唑环",
      "B. 苯环",
      "C. β-内酰胺环",
      "D. 酰胺键"
    ],
    "answer": "C",
    "originalAnswer": "β-内酰胺环"
  },
  {
    "id": 13,
    "type": "single",
    "question": "《中国药典》规定，凡检查溶出度的制剂，可不在进行",
    "options": [
      "A. 崩解时限检查",
      "B. 重量差异检查",
      "C. 含量均匀度检查",
      "D. 溶出度检查"
    ],
    "answer": "A",
    "originalAnswer": "崩解时限检查"
  },
  {
    "id": 14,
    "type": "single",
    "question": "盐酸普鲁卡因需要检查的特殊杂质是",
    "options": [
      "A. 水杨酸",
      "B. 苯胺",
      "C. 对氨基苯甲酸",
      "D. 苯甲酸"
    ],
    "answer": "C",
    "originalAnswer": "对氨基苯甲酸"
  },
  {
    "id": 15,
    "type": "single",
    "question": "中国药典》采用酸碱直接滴定法测定阿司匹林原料药含量时，所选用的指示剂是",
    "options": [
      "A. 甲基橙",
      "B. 石蕊",
      "C. 溴甲酚绿",
      "D. 酚酞"
    ],
    "answer": "D",
    "originalAnswer": "酚酞"
  },
  {
    "id": 16,
    "type": "single",
    "question": "“精密称定”系指",
    "options": [
      "A. 称取重量应准确至所取重量的万分之一",
      "B. 称取重量应准确至所取重量的千分之一",
      "C. 称取重量应准确至所取重量的百分之一",
      "D. 称取重量应准确至所取重量的十分之一"
    ],
    "answer": "B",
    "originalAnswer": "称取重量应准确至所取重量的千分之一"
  },
  {
    "id": 17,
    "type": "single",
    "question": "总灰分是指",
    "options": [
      "A. 药材或制剂经加热炽灼灰化遗留的无机物",
      "B. 药材或制剂经加热炽灼灰化遗留的有机物",
      "C. 药材或制剂经加热挥发后的残留物",
      "D. 药材或制剂经干燥后的残留物"
    ],
    "answer": "A",
    "originalAnswer": "药材或制剂经加热炽灼灰化遗留的无机物"
  },
  {
    "id": 18,
    "type": "single",
    "question": "下列反应中，用于苯巴比妥鉴别的是",
    "options": [
      "A. 银镜反应",
      "B. 甲醛硫酸反应",
      "C. 重氮化反应",
      "D. 水解反应"
    ],
    "answer": "B",
    "originalAnswer": "甲醛硫酸反应"
  },
  {
    "id": 19,
    "type": "single",
    "question": "维生素C注射液中抗氧剂硫酸氢钠对碘量法有干扰，能排除其干扰的掩蔽剂是",
    "options": [
      "A. 甲醛",
      "B. 丙酮",
      "C. 乙醇",
      "D. 甲醇"
    ],
    "answer": "B",
    "originalAnswer": "丙酮"
  },
  {
    "id": 20,
    "type": "single",
    "question": "取用量为“约”若干时，系指取用量不得超过规定量的",
    "options": [
      "A. ±5%",
      "B. ±10%",
      "C. ±15%",
      "D. ±20%"
    ],
    "answer": "B",
    "originalAnswer": "±10%"
  },
  {
    "id": 21,
    "type": "single",
    "question": "药物的鉴别试验是判断",
    "options": [
      "A. 未知药物真伪",
      "B. 已知药物真伪",
      "C. 药物含量",
      "D. 药物纯度"
    ],
    "answer": "B",
    "originalAnswer": "已知药物真伪"
  },
  {
    "id": 22,
    "type": "single",
    "question": "容量分析具有准确度高等优点而广泛应用于",
    "options": [
      "A. 制剂的含量测定",
      "B. 生物样品的测定",
      "C. 化学原料药的含量测定",
      "D. 药物鉴别"
    ],
    "answer": "C",
    "originalAnswer": "化学原料药的含量测定"
  },
  {
    "id": 23,
    "type": "single",
    "question": "拖尾因子用来衡量色谱系统中",
    "options": [
      "A. 色谱峰的高度",
      "B. 色谱峰的宽度",
      "C. 色谱峰的对称性",
      "D. 色谱峰的面积"
    ],
    "answer": "C",
    "originalAnswer": "色谱峰的对称性"
  },
  {
    "id": 24,
    "type": "single",
    "question": "用TLC法检查特殊杂质，若无杂质的对照品时，应采用",
    "options": [
      "A. 杂质对照品法",
      "B. 外标法",
      "C. 内标法",
      "D. 自身稀释对照法"
    ],
    "answer": "D",
    "originalAnswer": "自身稀释对照法"
  },
  {
    "id": 25,
    "type": "single",
    "question": "盐酸普鲁卡因含量测定采用亚硝酸钠滴定法，指示终点采用",
    "options": [
      "A. 电位法",
      "B. 指示剂法",
      "C. 电导法",
      "D. 永停法"
    ],
    "answer": "D",
    "originalAnswer": "永停法"
  },
  {
    "id": 26,
    "type": "single",
    "question": "以下药物能发生重氮化-偶合反应的是",
    "options": [
      "A. 阿司匹林",
      "B. 磺胺甲噁唑",
      "C. 青霉素",
      "D. 维生素C"
    ],
    "answer": "B",
    "originalAnswer": "磺胺甲噁唑"
  },
  {
    "id": 27,
    "type": "single",
    "question": "肾上腺素中酮体检查的原理是基于",
    "options": [
      "A. 药物和杂质均有吸收",
      "B. 药物有吸收，杂质无吸收",
      "C. 药物和杂质均无吸收",
      "D. 药物于310 nm无吸收，而杂质有吸收"
    ],
    "answer": "D",
    "originalAnswer": "药物于310 nm无吸收，而杂质有吸收"
  },
  {
    "id": 28,
    "type": "single",
    "question": "《药品生产质量管理规范》的英文缩写是",
    "options": [
      "A. GSP",
      "B. GMP",
      "C. GLP",
      "D. GCP"
    ],
    "answer": "B",
    "originalAnswer": "GMP"
  },
  {
    "id": 29,
    "type": "single",
    "question": "亚硝酸钠滴定法中将滴定尖端插入液面下约2/3 处滴定被测样品，这样操作的主要原因是",
    "options": [
      "A. 加快反应速度",
      "B. 使反应完全",
      "C. 避免亚硝酸挥发和分解",
      "D. 防止氧化"
    ],
    "answer": "C",
    "originalAnswer": "避免亚硝酸挥发和分解"
  },
  {
    "id": 30,
    "type": "single",
    "question": "分析方法验证中，同一分析人员连续多次取样测定同一均匀供试品所得结果之间的接近程度系指",
    "options": [
      "A. 中间精密度",
      "B. 重复性",
      "C. 重现性",
      "D. 稳定性"
    ],
    "answer": "B",
    "originalAnswer": "重复性"
  },
  {
    "id": 31,
    "type": "single",
    "question": "中国药典中以比移值对药物进行鉴别的分析方法是",
    "options": [
      "A. HPLC 法",
      "B. TLC 法",
      "C. GC 法",
      "D. UV 法"
    ],
    "answer": "B",
    "originalAnswer": "TLC 法"
  },
  {
    "id": 32,
    "type": "single",
    "question": "能产生银镜反应的药物是",
    "options": [
      "A. 维生素C",
      "B. 维生素A",
      "C. 维生素B",
      "D. 维生素D"
    ],
    "answer": "A",
    "originalAnswer": "维生素C"
  },
  {
    "id": 33,
    "type": "single",
    "question": "亚硝酸钠滴定法中，加入KBr的作用是",
    "options": [
      "A. 减慢反应",
      "B. 加速反应",
      "C. 使反应完全",
      "D. 防止分解"
    ],
    "answer": "B",
    "originalAnswer": "加速反应"
  },
  {
    "id": 34,
    "type": "single",
    "question": "国家药品标准中，药品中文名称的命名应依据",
    "options": [
      "A. 国际非专利药品名称",
      "B. 中国药品通用名称",
      "C. 商品名",
      "D. 化学名"
    ],
    "answer": "B",
    "originalAnswer": "中国药品通用名称"
  },
  {
    "id": 35,
    "type": "single",
    "question": "肾上腺素中肾上腺酮的检查是利用",
    "options": [
      "A. 溶解度差异",
      "B. 对光吸收性质的差异",
      "C. 熔点差异",
      "D. 旋光度差异"
    ],
    "answer": "B",
    "originalAnswer": "对光吸收性质的差异"
  },
  {
    "id": 36,
    "type": "single",
    "question": "高效液相色谱中常用的检测器为",
    "options": [
      "A. 紫外检测器",
      "B. 荧光检测器",
      "C. 示差折光检测器",
      "D. 电化学检测器"
    ],
    "answer": "A",
    "originalAnswer": "紫外检测器"
  },
  {
    "id": 37,
    "type": "single",
    "question": "阿司匹林的有关物质检查采用方法",
    "options": [
      "A. TLC",
      "B. GC",
      "C. UV",
      "D. HPLC"
    ],
    "answer": "D",
    "originalAnswer": "HPLC"
  },
  {
    "id": 38,
    "type": "single",
    "question": "古蔡法检查药物中微量的砷盐，在酸性条件下加入锌粒的目的是",
    "options": [
      "A. 还原砷盐",
      "B. 氧化砷盐",
      "C. 产生新生态的氢",
      "D. 中和砷盐"
    ],
    "answer": "C",
    "originalAnswer": "产生新生态的氢"
  },
  {
    "id": 39,
    "type": "single",
    "question": "采用高效液相色谱法进行色谱系统的适用性试验时，一般当信噪比为3时，对应的浓度作为",
    "options": [
      "A. 定量限",
      "B. 检测限",
      "C. 线性范围",
      "D. 耐用性"
    ],
    "answer": "B",
    "originalAnswer": "检测限"
  },
  {
    "id": 40,
    "type": "single",
    "question": "药物中氯化物杂质检查的一般意义在于它",
    "options": [
      "A. 可以控制药物的毒性",
      "B. 可以考核生产工艺和企业管理是否正常",
      "C. 可以提高药物的疗效",
      "D. 可以降低药物的成本"
    ],
    "answer": "B",
    "originalAnswer": "可以考核生产工艺和企业管理是否正常"
  },
  {
    "id": 41,
    "type": "single",
    "question": "下列药物需检查水杨酸杂质的是",
    "options": [
      "A. 阿司匹林",
      "B. 氢化可的松",
      "C. 青霉素",
      "D. 肾上腺素"
    ],
    "answer": "B",
    "originalAnswer": "氢化可的松"
  },
  {
    "id": 42,
    "type": "single",
    "question": "回收率试验用于药品质量标准分析方法验证的内容为",
    "options": [
      "A. 精密度",
      "B. 准确度",
      "C. 线性",
      "D. 范围"
    ],
    "answer": "B",
    "originalAnswer": "准确度"
  },
  {
    "id": 43,
    "type": "single",
    "question": "紫外分光光度计常用的光源",
    "options": [
      "A. 氘灯",
      "B. 钨灯",
      "C. 汞灯",
      "D. 钠灯"
    ],
    "answer": "A",
    "originalAnswer": "氘灯"
  },
  {
    "id": 44,
    "type": "single",
    "question": "《中国药典》的英文简称及其缩写是",
    "options": [
      "A. Chinese Pharmacopoeia，ChP",
      "B. United States Pharmacopoeia，USP",
      "C. British Pharmacopoeia，BP",
      "D. European Pharmacopoeia，EP"
    ],
    "answer": "A",
    "originalAnswer": "Chinese Pharmacopoeia，ChP"
  },
  {
    "id": 45,
    "type": "single",
    "question": "下列药物中可能含有高分子聚合物杂质的是",
    "options": [
      "A. 维生素C",
      "B. 阿司匹林",
      "C. 磺胺甲噁唑",
      "D. 青霉素"
    ],
    "answer": "D",
    "originalAnswer": "青霉素"
  },
  {
    "id": 46,
    "type": "fill",
    "question": "药物的熔点收载于质量标准的______。",
    "options": [
      "A. 含量测定",
      "B. 性状 项下",
      "C. 鉴别",
      "D. 检查"
    ],
    "answer": "B",
    "originalAnswer": "性状 项下"
  },
  {
    "id": 47,
    "type": "fill",
    "question": "人用药品注册技术要求国际协调会的英文缩写是______。",
    "options": [
      "A. WHO",
      "B. GMP",
      "C. ICH",
      "D. FDA"
    ],
    "answer": "C",
    "originalAnswer": "ICH"
  },
  {
    "id": 48,
    "type": "fill",
    "question": "色谱法对被测组分产生保留的相称为______。",
    "options": [
      "A. 流动相",
      "B. 分配相",
      "C. 吸附相",
      "D. 固定相"
    ],
    "answer": "D",
    "originalAnswer": "固定相"
  },
  {
    "id": 49,
    "type": "fill",
    "question": "红外谱图按其特征可分为特征区和______。",
    "options": [
      "A. 特征区",
      "B. 指纹区",
      "C. 指纹谱区",
      "D. 官能团区"
    ],
    "answer": "B",
    "originalAnswer": "指纹区"
  },
  {
    "id": 50,
    "type": "fill",
    "question": "测定吸收系数选用______。",
    "options": [
      "A. 含量测定",
      "B. 检查",
      "C. 鉴别",
      "D. 5 台不同的紫外可见分光光度计"
    ],
    "answer": "D",
    "originalAnswer": "5 台不同的紫外可见分光光度计"
  },
  {
    "id": 51,
    "type": "fill",
    "question": "按照操作形式，色谱法可分为平面色谱法、柱色谱法及______。",
    "options": [
      "A. 电泳",
      "B. 薄层色谱",
      "C. 柱色谱",
      "D. 纸色谱"
    ],
    "answer": "A",
    "originalAnswer": "电泳"
  },
  {
    "id": 52,
    "type": "fill",
    "question": "气相色谱法进样方式一般可分为溶液直接进样和______。",
    "options": [
      "A. 不分流进样",
      "B. 顶空进样",
      "C. 分流进样",
      "D. 直接进样"
    ],
    "answer": "B",
    "originalAnswer": "顶空进样"
  },
  {
    "id": 53,
    "type": "fill",
    "question": "古蔡氏检砷法测砷时，砷化氢气体遇______。",
    "options": [
      "A. 含量测定",
      "B. 检查",
      "C. 鉴别",
      "D. 溴化汞 试纸产生黄色至棕色的砷斑"
    ],
    "answer": "D",
    "originalAnswer": "溴化汞 试纸产生黄色至棕色的砷斑"
  },
  {
    "id": 54,
    "type": "fill",
    "question": "通常情况下，不挥发性无机杂质采用______。",
    "options": [
      "A. 炽灼残渣 法进行检测",
      "B. 检查",
      "C. 含量测定",
      "D. 鉴别"
    ],
    "answer": "A",
    "originalAnswer": "炽灼残渣 法进行检测"
  },
  {
    "id": 55,
    "type": "fill",
    "question": "影响因素试验一般包括高温、______。",
    "options": [
      "A. 检查",
      "B. 含量测定",
      "C. 高湿和光照试验",
      "D. 鉴别"
    ],
    "answer": "C",
    "originalAnswer": "高湿和光照试验"
  },
  {
    "id": 56,
    "type": "fill",
    "question": "用规定的方法测定药物中有效成分的含量是______。",
    "options": [
      "A. 检查",
      "B. 含量测定",
      "C. 鉴别",
      "D. 性状"
    ],
    "answer": "B",
    "originalAnswer": "含量测定"
  },
  {
    "id": 57,
    "type": "fill",
    "question": "极易溶解是指溶质1g(mg）能在溶剂不到______。",
    "options": [
      "A. 检查",
      "B. 鉴别",
      "C. 1ml 溶解",
      "D. 含量测定"
    ],
    "answer": "C",
    "originalAnswer": "1ml 溶解"
  },
  {
    "id": 58,
    "type": "fill",
    "question": "红外光谱是由分子的______。",
    "options": [
      "A. 含量测定",
      "B. 检查",
      "C. 振动 和转动能级引起的光谱",
      "D. 鉴别"
    ],
    "answer": "C",
    "originalAnswer": "振动 和转动能级引起的光谱"
  },
  {
    "id": 59,
    "type": "fill",
    "question": "《中国药典》的正文收载的是______。",
    "options": [
      "A. 通则",
      "B. 药品的质量标准",
      "C. 索引",
      "D. 附录"
    ],
    "answer": "B",
    "originalAnswer": "药品的质量标准"
  },
  {
    "id": 60,
    "type": "fill",
    "question": "药品检验工作的基本程序一般为______。",
    "options": [
      "A. 取样、检验、留样、检验报告",
      "B. 鉴别",
      "C. 检查",
      "D. 含量测定"
    ],
    "answer": "A",
    "originalAnswer": "取样、检验、留样、检验报告"
  },
  {
    "id": 61,
    "type": "truefalse",
    "question": "目前各国药典均采用气相色谱法检查药物中的残留溶剂。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 62,
    "type": "truefalse",
    "question": "红外谱图按其特征可分为特征区和指纹区。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 63,
    "type": "truefalse",
    "question": "《中国药典》中，收载六味地黄丸含量测定的部分是二部正文。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "B",
    "originalAnswer": "错误"
  },
  {
    "id": 64,
    "type": "truefalse",
    "question": "水杨酸既是阿司匹林生产工艺中可能引入的杂质，也是其储藏过程中可能产生的杂质。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 65,
    "type": "truefalse",
    "question": "为药品研发、审批和上市制定统一的国际性技术指导原则的是GLP。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "B",
    "originalAnswer": "错误"
  },
  {
    "id": 66,
    "type": "truefalse",
    "question": "用古蔡法检查砷盐时，导气管塞入醋酸铅棉花的目的是除去可能产生的H2S气体。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 67,
    "type": "truefalse",
    "question": "盐酸溶液（9→100），表示 9 ml 浓盐酸加水溶液稀释到 100 ml。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 68,
    "type": "truefalse",
    "question": "药品检验工作的一般程序为取样→鉴别→检查→含量测定→写出检验报告。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 69,
    "type": "truefalse",
    "question": "取用量为“约”若干时，系指取用量不得超过规定量的±5%。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "B",
    "originalAnswer": "错误"
  },
  {
    "id": 70,
    "type": "truefalse",
    "question": "水浴温度：除另有规定外，均为70 ~ 80°C。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "B",
    "originalAnswer": "错误"
  },
  {
    "id": 71,
    "type": "truefalse",
    "question": "杂质限量是指杂质的最大允许量。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 72,
    "type": "truefalse",
    "question": "原料药的含量通常用标示量的百分含量（即百分标示量）表示。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "B",
    "originalAnswer": "错误"
  },
  {
    "id": 73,
    "type": "truefalse",
    "question": "药物中氯化物杂质检查的一般意义在于它可以考核生产工艺和企业管理是否正常。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 74,
    "type": "truefalse",
    "question": "溶液的百分比浓度，除另有规定外，系指溶液100 ml中含有溶质若干克。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  },
  {
    "id": 75,
    "type": "truefalse",
    "question": "杂质无治疗作用、或影响药物的稳定性和疗效、甚至对人体健康有害。？",
    "options": [
      "A. 正确",
      "B. 错误"
    ],
    "answer": "A",
    "originalAnswer": "正确"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = questions;
}