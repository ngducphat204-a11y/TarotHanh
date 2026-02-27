import { getRandomCard, type TarotCard } from './TarotData';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
];

const SYSTEM_PROMPT = `Bạn là Phát — một người anh thân thiết của Hạnh. Vì lớn tuổi hơn nên Phát xưng "anh" để tạo cảm giác gần gũi và dễ chia sẻ.

PHONG CÁCH CỦA ANH PHÁT:
- Xưng "anh" và gọi "Hạnh" xuyên suốt.
- Giọng văn ấm áp, chân thành, phong thái của một người đi trước có nhiều trải nghiệm, biết lắng nghe.
- TUYỆT ĐỐI KHÔNG dùng các từ ngữ quá thân mật nửa vời kiểu "bé", "cưng" hay lãng mạn như "yêu dấu", "người yêu".
- Hãy giữ sự tôn trọng nhưng vẫn cực kỳ gần gũi, quan tâm đến cảm xúc của Hạnh.

QUY TẮC GIẢI BÀI TAROT (QUAN TRỌNG):
- Nếu bốc 1 lá: Hãy nhắc tên lá bài và giải thích CHI TIẾT (8-12 câu).
- Nếu bốc 3 lá (Trải bài Quá khứ - Hiện tại - Tương lai): Hãy giải thích sự kết nối giữa 3 lá bài này. Phân tích từng giai đoạn một cách sâu sắc và đưa ra lời khuyên tổng thể cho Hạnh (15-20 câu).
- KHÔNG liệt kê ý nghĩa theo kiểu robot. Hãy lồng ghép mọi thứ vào một đoạn hội thoại tự nhiên.
- Không được kết thúc lửng lơ. Hãy chắc chắn câu trả lời hoàn chỉnh và có lời nhắn nhủ sau cùng.

VÍ DỤ TÔNG GIỌNG:
"Hạnh ơi, anh vừa bốc được lá The Star cho Hạnh nè. Lá bài này mang năng lượng rất tích cực... Anh thấy dạo này Hạnh đang có những hy vọng mới... Đừng lo lắng quá nhé, cứ tin vào bản thân mình là mọi chuyện sẽ ổn thôi."

KHÔNG dùng markdown (**, ##). Xuống dòng hợp lý cho dễ đọc trên chat mobile.`;

interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

let conversationHistory: ChatMessage[] = [];

export function resetConversation() {
    conversationHistory = [];
}

export interface AiResponse {
    text: string;
    cards?: TarotCard[];
}

const DRAW_KEYWORDS = ['bốc', 'rút', '🃏'];
const SPREAD_3_KEYWORDS = ['3 lá', 'trải bài', 'quá khứ'];
const QUICK_ACTION_PREFIXES = ['🃏 bốc', '💜 tình yêu', '💼 công việc', '✨ năng lượng'];

function getDrawType(text: string): 'none' | 'single' | 'triple' {
    const lower = text.toLowerCase();
    if (SPREAD_3_KEYWORDS.some(k => lower.includes(k))) return 'triple';
    if (QUICK_ACTION_PREFIXES.some(p => lower.startsWith(p.toLowerCase()))) return 'single';
    if (DRAW_KEYWORDS.some(k => lower.includes(k))) return 'single';
    return 'none';
}

export async function sendMessage(userText: string): Promise<AiResponse> {
    let cards: TarotCard[] = [];
    const drawType = getDrawType(userText);

    if (drawType === 'triple') {
        // Bốc 3 lá không trùng nhau
        while (cards.length < 3) {
            const nextCard = getRandomCard();
            if (!cards.find(c => c.name === nextCard.name)) {
                cards.push(nextCard);
            }
        }
    } else if (drawType === 'single') {
        cards = [getRandomCard()];
    }

    let messageForAI = userText;
    if (cards.length === 1) {
        const card = cards[0];
        messageForAI = `${userText}

[HỆ THỐNG: Anh vừa bốc được lá "${card.name}" cho Hạnh. Ý nghĩa: ${card.meaning}. Mô tả: ${card.description}.
Nhiệm vụ: Hãy đóng vai anh Phát, giải thích CHI TIẾT và TÌNH CẢM lá bài này cho Hạnh (8-12 câu). Đừng liệt kê, hãy kể chuyện và phân tích sâu sắc.]`;
    } else if (cards.length === 3) {
        messageForAI = `${userText}

[HỆ THỐNG: Anh vừa bốc trải bài 3 lá cho Hạnh:
1. Quá khứ: "${cards[0].name}" (${cards[0].meaning})
2. Hiện tại: "${cards[1].name}" (${cards[1].meaning})
3. Tương lai: "${cards[2].name}" (${cards[2].meaning})
Nhiệm vụ: Hãy đóng vai anh Phát, kết nối và giải thích CHI TIẾT trải bài này cho Hạnh (15-20 câu). Phân tích sự chuyển biến từ quá khứ đến tương lai và đưa ra lời khuyên chân thành.]`;
    }

    conversationHistory.push({
        role: 'user',
        parts: [{ text: messageForAI }],
    });

    for (const modelName of MODELS) {
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    contents: conversationHistory,
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.95,
                        maxOutputTokens: 4096,
                    },
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.warn(`Model ${modelName} failed with status ${res.status}. Error: ${data.error?.message}. Trying next model...`);
                continue;
            }

            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                'Hạnh ơi, anh đang hơi lơ đãng chút, Hạnh nhắn lại cho anh nhé! 🌙';

            conversationHistory.push({
                role: 'model',
                parts: [{ text: aiText }],
            });

            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-20);
            }

            return { text: aiText, cards: cards.length > 0 ? cards : undefined };

        } catch (err) {
            console.error(`Error with model ${modelName}:`, err);
            continue;
        }
    }

    conversationHistory.pop();
    return {
        text: 'Anh xin lỗi Hạnh, hình như các kết nối của anh đang bị quá tải rồi. Đợi anh một chút xíu nhé! 😢',
        cards: undefined,
    };
}
