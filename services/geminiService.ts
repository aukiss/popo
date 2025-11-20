import { GoogleGenAI } from "@google/genai";

const BASE_URL = "https://api.videocaptioner.cn/v1";

// Initialize client with custom baseUrl as requested
const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY || '', 
  baseUrl: BASE_URL
});

const MODEL_NAME = 'gemini-2.5-flash';

const ROLE_DEFINITION = `
# 角色 
你是一位顶级的数学教育专家、课程设计师和数学史学者，深刻理解儿童认知心理学。你擅长将复杂的数学概念拆解为一系列清晰、直观、且内在逻辑紧密相连的原理和模型。

# 任务 
我是一名小学数学老师，我希望你对我提供的数学知识点进行一次“大师级”的深度教研分析。我需要你系统性地挖掘这个知识点背后所有隐藏的原理、模型、思想和教学策略。

# 格式要求
1. 涉及分数的都采用LaTeX格式（例如 $\\frac{a}{b}$），必须采用上下结构，方便和课本统一。
2. 涉及运算过程的每个步骤新起一行，左对齐。
3. 重点是揭示知识的“为什么”（Why）和“如何用模型辅助理解”（How）。
4. 使用Markdown格式输出。
`;

// Helper function to delay between calls if needed
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generatePart1 = async (topic: string): Promise<string> => {
  const prompt = `
${ROLE_DEFINITION}

# 挖掘的知识点 
[${topic}]

# 任务指令 (第一阶段)
请严格按照以下分析框架的前三步进行分析：

### 第一步：追本溯源（定义与意义）
* **核心定义：** 这个知识点最原始的数学定义是什么？
* **解决的问题：** 它在数学上被“发明”出来，是为了解决什么问题？
* **现实意义：** 它在现实生活中有哪几种不同的意义和应用场景？

### 第二步：承前启后（知识图谱）
* **承前（前序知识）：** 学生学习它 *之前* 必须牢固掌握的知识点有哪些？（列出3-5个）
* **启后（后续知识）：** 这个知识点将为 *之后* 哪些更高级的数学概念做铺垫？（列出2-3个）

### 第三步：多维拆解（算法原理的“为什么”）
* 这个知识点的核心“算法”或“法则”是什么？
* **深度追问“为什么”：** 请提供至少**三种**不同的解释路径或推导方法来证明这个法则是正确的。（例如：商不变性质、归一法、通分法、面积模型等）
* **注意：** 涉及运算过程请务必步骤清晰，每步一行。

请输出第一阶段的分析内容：
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating Part 1:", error);
    throw error;
  }
};

export const generatePart2 = async (topic: string, contextPart1: string): Promise<string> => {
  const prompt = `
${ROLE_DEFINITION}

# 挖掘的知识点 
[${topic}]

# 上下文
我们已经完成了前三步的分析：
${contextPart1.slice(0, 2000)}... (上下文省略)

# 任务指令 (第二阶段)
请继续按照分析框架，执行第四步至第六步：

### 第四步：抽象提炼（核心数学思想）
* 这个知识点背后，蕴含着哪些更宏观、更底层的数学思想？（例如：转化思想、数形结合、对应关系等）

### 第五步：模型“物化”（视觉表征）
* 请提供至少**三种**可以把这个抽象原理“画”出来或“做”出来的**视觉模型**或**直观教具**。
* 请分析每种视觉模型的优缺点，以及它分别对应了第三步中的哪种解释路径。
* **注意：** 对于图形描述，请尽可能详细，或者使用简单的ASCII图/Mermaid图辅助说明，或者详细描述图形的构成。

### 第六步：情境反思（典型应用）
* 这个知识点通常用来解决哪几类经典的“应用题”或“易错题”？
* 请分析每类应用题最适合用第五步中的哪种模型来辅助学生理解。

请输出第二阶段的分析内容：
`;

  try {
    // Small delay to be polite to the API limits
    await delay(1000);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating Part 2:", error);
    throw error;
  }
};

export const generatePart3 = async (topic: string, contextPart2: string): Promise<string> => {
  const prompt = `
${ROLE_DEFINITION}

# 挖掘的知识点 
[${topic}]

# 上下文
我们已经完成了前六步的分析。上一步重点分析了核心思想和视觉模型。
${contextPart2.slice(0, 500)}... (上下文省略)

# 任务指令 (第三阶段)
请完成分析框架的最后三步：

### 第七步：跨界联想（学科融合）
* 这个数学概念在**其他学科**（如科学、艺术、音乐、工程）或**生活常识**中，有没有可以类比的“原型”或应用？

### 第VIII步：溯源历史（人文背景）
* 这个数学概念在**历史上**是如何发展的？是哪位数学家或哪个文明最先提出的？
* 他们当初是为了解决什么现实问题而发展出这个概念的？

### 第九步：教学重构（创新教学法）
* 基于以上的分析，请设计一个**“探究式”或“项目制（PBL）”**的教学活动概要。
* 这个活动应引导学生*自己去“发现”或“发明”*这个知识点的核心规律，而不是由老师直接灌输。

请输出第三阶段的分析内容：
`;

  try {
    await delay(1000);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating Part 3:", error);
    throw error;
  }
};
