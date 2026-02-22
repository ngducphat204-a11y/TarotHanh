export interface TarotCard {
    id: string;
    name: string;
    meaning: string;
    description: string;
    image: string;
}

export const majorArcana: TarotCard[] = [
    {
        id: '0',
        name: 'The Fool (Chàng Khờ)',
        meaning: 'Sự khởi đầu mới, tinh thần tự do, sự liều lĩnh đầy thuần khiết.',
        description: 'Lá bài nhắc nhở bạn rằng mỗi bước đi sắp tới đều là một cuộc phiêu lưu. Đừng sợ hãi, hãy tin vào trực giác và bước tới.',
        image: 'https://www.trustedtarot.com/img/cards/the-fool.png'
    },
    {
        id: '1',
        name: 'The Magician (Nhà Ảo Thuật)',
        meaning: 'Sức mạnh ý chí, tài năng bẩm sinh, khả năng hiện thực hóa ước mơ.',
        description: 'Bạn đang nắm giữ mọi công cụ cần thiết để thành công. Hãy tập trung và biến những suy nghĩ thành hành động cụ thể.',
        image: 'https://www.trustedtarot.com/img/cards/the-magician.png'
    },
    {
        id: '2',
        name: 'The High Priestess (Nữ Tư Tế)',
        meaning: 'Trực giác, sự bí ẩn, tiềm thức và tri thức nội tại.',
        description: 'Câu trả lời không nằm ở bên ngoài mà nằm sâu trong tâm hồn bạn. Hãy lắng nghe tiếng nói tĩnh lặng bên trong.',
        image: 'https://www.trustedtarot.com/img/cards/the-high-priestess.png'
    },
    {
        id: '3',
        name: 'The Empress (Nữ Hoàng)',
        meaning: 'Sự trù phú, nuôi dưỡng, khả năng sáng tạo và vẻ đẹp.',
        description: 'Đây là lúc để đón nhận sự ấm áp và thịnh vượng. Hãy chăm sóc bản thân và để những ý tưởng của bạn được nảy mầm.',
        image: 'https://www.trustedtarot.com/img/cards/the-empress.png'
    },
    {
        id: '6',
        name: 'The Lovers (Tình Nhân)',
        meaning: 'Tình yêu, sự hòa hợp, sự lựa chọn quan trọng từ trái tim.',
        description: 'Một mối quan hệ hoặc một ngã rẽ cuộc đời đang đòi hỏi bạn phải thành thật với bản thân mình nhất.',
        image: 'https://www.trustedtarot.com/img/cards/the-lovers.png'
    },
    {
        id: '7',
        name: 'The Chariot (Chiến Xa)',
        meaning: 'Sự kiểm soát, chiến thắng, quyết tâm và sức mạnh ý chí.',
        description: 'Bạn đang tiến về phía trước với tốc độ lớn. Hãy giữ vững tay lái và tập trung vào mục tiêu của mình.',
        image: 'https://www.trustedtarot.com/img/cards/the-chariot.png'
    },
    {
        id: '8',
        name: 'Strength (Sức Mạnh)',
        meaning: 'Sự can đảm, kiên nhẫn, sức mạnh nội tâm và lòng trắc ẩn.',
        description: 'Sức mạnh thực sự không đến từ vũ lực, mà đến từ sự tĩnh lặng và khả năng làm chủ bản ngã.',
        image: 'https://www.trustedtarot.com/img/cards/strength.png'
    },
    {
        id: '9',
        name: 'The Hermit (Ẩn Sĩ)',
        meaning: 'Sự chiêm nghiệm, tìm kiếm chân lý, sự cô độc đầy minh triết.',
        description: 'Đã đến lúc tạm rời xa thế giới ồn ào để quay vào bên trong. Ánh sáng tri thức đang chờ bạn khám phá.',
        image: 'https://www.trustedtarot.com/img/cards/the-hermit.png'
    },
    {
        id: '10',
        name: 'Wheel of Fortune (Bánh Xe Số Phận)',
        meaning: 'Sự thay đổi, định mệnh, bước ngoặt bất ngờ.',
        description: 'Cuộc đời luôn xoay vần. Dù bạn đang ở đâu trên vòng quay đó, hãy hiểu rằng mọi thứ đều có lý do của nó.',
        image: 'https://www.trustedtarot.com/img/cards/the-wheel-of-fortune.png'
    },
    {
        id: '13',
        name: 'Death (Cái Chết)',
        meaning: 'Sự kết thúc, sự chuyển hóa, buông bỏ cái cũ để đón nhận cái mới.',
        description: 'Đừng sợ hãi sự thay đổi. Một cánh cửa đóng lại là để một cánh cửa khác rực rỡ hơn được mở ra.',
        image: 'https://www.trustedtarot.com/img/cards/death.png'
    },
    {
        id: '15',
        name: 'The Devil (Ác Quỷ)',
        meaning: 'Sự ràng buộc, cám dỗ, những thói quen hoặc nỗi sợ đang kìm hãm bạn.',
        description: 'Bạn đang tự giới hạn bản thân mình. Hãy nhận diện những xiềng xích vô hình và can đảm phá vỡ chúng.',
        image: 'https://www.trustedtarot.com/img/cards/the-devil.png'
    },
    {
        id: '17',
        name: 'The Star (Ngôi Sao)',
        meaning: 'Hy vọng, niềm tin, sự hồi phục và nguồn cảm hứng dạt dào.',
        description: 'Sau cơn mưa trời lại sáng. Hãy giữ vững niềm tin, vũ trụ đang gửi đến bạn những tín hiệu tích cực nhất.',
        image: 'https://www.trustedtarot.com/img/cards/the-star.png'
    },
    {
        id: '18',
        name: 'The Moon (Mặt Trăng)',
        meaning: 'Ảo giác, nỗi sợ, sự bất an và những điều còn ẩn giấu.',
        description: 'Mọi thứ có thể không như vẻ ngoài của nó. Hãy tin vào trực giác nhạy bén của bạn để đi qua màn sương mù.',
        image: 'https://www.trustedtarot.com/img/cards/the-moon.png'
    },
    {
        id: '19',
        name: 'The Sun (Mặt Trời)',
        meaning: 'Hạnh phúc, thành công, sự rạng rỡ và niềm tin yêu cuộc sống.',
        description: 'Ánh sáng đang chiếu rọi tâm hồn bạn. Mọi ưu phiền sẽ tan biến dưới sức mạnh của sự tích cực.',
        image: 'https://www.trustedtarot.com/img/cards/the-sun.png'
    },
    {
        id: '21',
        name: 'The World (Thế Giới)',
        meaning: 'Sự hoàn thành, viên mãn, đạt tới đỉnh cao của hành trình.',
        description: 'Chúc mừng bạn. Một chương của cuộc đời đã kết thúc một cách trọn vẹn để mở ra một chân trời mới rộng lớn hơn.',
        image: 'https://www.trustedtarot.com/img/cards/the-world.png'
    }

];

export const getRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * majorArcana.length);
    return majorArcana[randomIndex];
};
