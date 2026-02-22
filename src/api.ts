import { getRandomCard, type TarotCard } from './TarotData';

const API_KEY = 'AIzaSyAiLgViBU2DAcwEGiyS4It39hGb9UHCqZ4';

// Danh sách các model chính xác từ ListModels để tự động chuyển đổi nếu hết quota
const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-3-flash-preview'
];

const SYSTEM_PROMPT = `Bạn là Phát — một người anh thân thiết của Hạnh. Vì lớn tuổi hơn nên Phát xưng "anh" để tạo cảm giác gần gũi và dễ chia sẻ.

PHONG CÁCH CỦA ANH PHÁT:
- Xưng "anh" và gọi "Hạnh" xuyên suốt.
- Giọng văn ấm áp, chân thành, phong thái của một người đi trước có nhiều trải nghiệm, biết lắng nghe.
- TUYỆT ĐỐI KHÔNG dùng các từ ngữ quá thân mật nửa vời kiểu "bé", "cưng" hay lãng mạn như "yêu dấu", "người yêu".
- Hãy giữ sự tôn trọng nhưng vẫn cực kỳ gần gũi, quan tâm đến cảm xúc của Hạnh.

QUY TẮC GIẢI BÀI TAROT (QUAN TRỌNG):
- Đầu tiên, hãy nhắc tên lá bài mà anh vừa bốc được một cách tự nhiên.
- KHÔNG liệt kê ý nghĩa theo kiểu robot. Hãy lồng ghép mọi thứ vào một đoạn hôi thoại dài khoảng 8-12 câu.
- Phải giải thích CỰC KỲ CHI TIẾT: từ ý nghĩa lá bài đến lời khuyên cho Hạnh. 
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
    card?: TarotCard;
}

const DRAW_KEYWORDS = ['bốc', 'rút', '🃏'];
const QUICK_ACTION_PREFIXES = ['🃏 bốc', '💜 tình yêu', '💼 công việc', '✨ năng lượng'];

function shouldDrawNewCard(text: string): boolean {
    const lower = text.toLowerCase();
    if (QUICK_ACTION_PREFIXES.some(p => lower.startsWith(p.toLowerCase()))) return true;
    if (DRAW_KEYWORDS.some(k => lower.includes(k))) return true;
    return false;
}

export async function sendMessage(userText: string): Promise<AiResponse> {
    let card: TarotCard | undefined;

    if (shouldDrawNewCard(userText)) {
        card = getRandomCard();
    }

    let messageForAI = userText;
    if (card) {
        messageForAI = `${userText}

[HỆ THỐNG: Anh vừa bốc được lá "${card.name}" cho Hạnh. Ý nghĩa: ${card.meaning}. Mô tả: ${card.description}.
Nhiệm vụ: Hãy đóng vai anh Phát, giải thích CHI TIẾT và TÌNH CẢM lá bài này cho Hạnh (8-12 câu). Đừng liệt kê, hãy kể chuyện và phân tích sâu sắc.]`;
    }

    conversationHistory.push({
        role: 'user',
        parts: [{ text: messageForAI }],
    });

    // Thử lần lượt các model trong danh sách
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
                        maxOutputTokens: 2048,
                    },
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.warn(`Model ${modelName} failed with status ${res.status}. Trying next model...`);
                // Nếu lỗi 429 (hết quota) hoặc 500+, tiếp tục vòng lặp để thử model tiếp theo
                continue;
            }

            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                'Hạnh ơi, anh đang hơi lơ đãng chút, Hạnh nhắn lại cho anh nhé! 🌙';

            conversationHistory.push({
                role: 'model',
                parts: [{ text: aiText }],
            });

            if (conversationHistory.length > 15) {
                conversationHistory = conversationHistory.slice(-15);
            }

            return { text: aiText, card };

        } catch (err) {
            console.error(`Error with model ${modelName}:`, err);
            // Tiếp tục thử model tiếp theo nếu có lỗi fetch
            continue;
        }
    }

    // Nếu đã thử tất cả các model mà vẫn lỗi
    conversationHistory.pop();
    return {
        text: 'Anh xin lỗi Hạnh, hình như các kết nối của anh đang bị quá tải rồi. Đợi anh một chút xíu nhé! 😢',
        card: undefined,
    };
}
