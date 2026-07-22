const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const statsManager = require('./utils/statsManager');
require('dotenv').config();

// Initialize Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Load Questions Database
const questionsPath = path.join(__dirname, 'data/questions.json');
let questions = [];

function loadQuestions() {
    try {
        if (fs.existsSync(questionsPath)) {
            questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
            console.log(`Loaded ${questions.length} questions from database.`);
        } else {
            console.error('❌ Lỗi: File data/questions.json không tồn tại.');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Lỗi load questions:', error);
        process.exit(1);
    }
}

const PDF_SOURCE_URL = 'https://cdn.thuvienphapluat.vn/uploads/OnThiGiayPhepLaiXe/On-thi-gplx-hang-b2-2023.pdf';

// Active Exam Sessions Map (key: userId, value: sessionState)
const activeExams = new Map();

client.once('clientReady', () => {
    loadQuestions();
    console.log(`✅ Bot Discord LTLX đã sẵn sàng! Đăng nhập dưới tên: ${client.user.tag}`);
});

// Command handlers
client.on('interactionCreate', async (interaction) => {
    // Channel restriction check
    if (process.env.LIVE_CHANNEL_ID && interaction.channelId !== process.env.LIVE_CHANNEL_ID) {
        await interaction.reply({ 
            content: `❌ Bot chỉ được phép hoạt động tại kênh <#${process.env.LIVE_CHANNEL_ID}>. Vui lòng di chuyển sang kênh này để sử dụng bot!`, 
            ephemeral: true 
        });
        return;
    }

    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'help') {
            await handleHelpCommand(interaction);
        } else if (commandName === 'on-tap') {
            await handleOnTapCommand(interaction);
        } else if (commandName === 'thi-thu') {
            await handleThiThuCommand(interaction);
        } else if (commandName === 'thong-ke') {
            await handleThongKeCommand(interaction);
        }
    } else if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
    }
});

// ==========================================
// 1. /help Command
// ==========================================
async function handleHelpCommand(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('🚗 Hướng Dẫn Ôn Thi Lý Thuyết Lái Xe Ô Tô (GPLX B2)')
        .setDescription('Chào mừng bạn đến với Bot hỗ trợ học và thi lý thuyết GPLX. Bot cung cấp trọn bộ 600 câu hỏi sát hạch mới nhất của Bộ GTVT.')
        .setColor('#3a86c8')
        .setThumbnail(client.user ? client.user.displayAvatarURL() : null)
        .addFields(
            { 
                name: '🎮 Các Lệnh Chính', 
                value: '• `/help` - Xem hướng dẫn & mẹo thi.\n• `/on-tap` - Ôn tập theo 7 chủ đề hoặc ngẫu nhiên.\n• `/thi-thu` - Bắt đầu đề thi thử sát hạch Hạng B2 (35 câu / 22 phút).\n• `/thong-ke` - Xem số câu đã làm, tỉ lệ đúng và số đề thi đã đỗ.' 
            },
            { 
                name: '💡 Quy Định Thi Thử Sát Hạch B2 (Bộ GTVT)', 
                value: '**Đề thi Hạng B2 (Ô tô con):**\n- Số câu hỏi: **35 câu**.\n- Thời gian làm bài: **22 phút**.\n- Điều kiện ĐẠT: Đúng **32/35 câu trở lên** và **KHÔNG SAI câu điểm liệt nào**.' 
            },
            { 
                name: '✨ Mẹo Thi Lý Thuyết Nhanh & Chính Xác', 
                value: '1. Gặp câu hỏi có từ khóa **"Bị nghiêm cấm"**, **"Không được phép"**, **"Không được"** ở đáp án -> Chọn ngay làm đáp án đúng.\n2. Tuyệt đối nghiêm cấm lái xe khi trong cơ thể có chất ma túy hoặc trong máu/hơi thở có nồng độ cồn.\n3. Khi giao nhau không có vòng xuyến: Nhường xe đi từ bên **phải**; có vòng xuyến: Nhường xe đi từ bên **trái**.' 
            },
            {
                name: '📄 File PDF Gốc Bộ 600 Câu Hỏi (Đối Chiếu)',
                value: `🔗 [Tải / Xem File PDF Gốc Ôn Thi GPLX B2](${PDF_SOURCE_URL})`
            }
        )
        .setFooter({ text: 'Chúc các bạn ôn tập tốt và thi đạt kết quả cao! 🌟' })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

// ==========================================
// 2. /on-tap Command
// ==========================================
async function handleOnTapCommand(interaction) {
    const chuDe = interaction.options.getString('chu-de');
    await sendPracticeQuestion(interaction, chuDe, true);
}

async function sendPracticeQuestion(interaction, chuDe, isInitialReply = false) {
    let filtered = [];
    if (chuDe === 'ngau-nhien') {
        filtered = questions;
    } else if (chuDe === 'diemliet') {
        filtered = questions.filter(q => q.is_critical);
    } else {
        filtered = questions.filter(q => q.category === chuDe);
    }

    if (filtered.length === 0) {
        const errorEmbed = new EmbedBuilder()
            .setDescription(`❌ Không tìm thấy câu hỏi thuộc chủ đề này.`)
            .setColor('#e71d36');
        
        if (isInitialReply) {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } else {
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        }
        return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const question = filtered[randomIndex];

    const isCriticalText = question.is_critical ? ' ⚠️ [CÂU ĐIỂM LIỆT - SAI TRƯỢT NGAY]' : '';
    const embed = new EmbedBuilder()
        .setTitle(`📝 Ôn Tập: Câu hỏi số ${question.id}${isCriticalText}`)
        .setDescription(`**Đề bài:** ${question.question}`)
        .setColor(question.is_critical ? '#ffb703' : '#3a86c8')
        .setFooter({ text: `Chủ đề: ${getCategoryLabel(question.category)} | Nhấn nút bên dưới để chọn đáp án` });

    if (question.image) {
        embed.setImage(question.image);
    }

    let optionsText = '';
    question.options.forEach((opt, idx) => {
        optionsText += `**${idx + 1}.** ${opt}\n`;
    });
    
    if (optionsText.length > 1024) {
        optionsText = optionsText.substring(0, 1020) + '...';
    }
    embed.addFields({ name: 'Các phương án trả lời:', value: optionsText });

    const row = new ActionRowBuilder();
    question.options.forEach((_, idx) => {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId(`practice_${chuDe}_${question.id}_${idx}`)
                .setLabel(`Đáp án ${idx + 1}`)
                .setStyle(ButtonStyle.Primary)
        );
    });

    if (isInitialReply) {
        await interaction.reply({ embeds: [embed], components: [row] });
    } else {
        await interaction.message.edit({ embeds: [embed], components: [row] });
    }
}

function getCategoryLabel(category) {
    switch (category) {
        case 'luat': return 'Luật giao thông đường bộ';
        case 'nghiepvu': return 'Nghiệp vụ vận tải';
        case 'daoduc': return 'Văn hóa & Đạo đức người lái xe';
        case 'kthuat': return 'Kỹ thuật lái xe ô tô';
        case 'cautao': return 'Cấu tạo & Sửa chữa ô tô';
        case 'bienbao': return 'Hệ thống biển báo hiệu';
        case 'sahinh': return 'Giải thế sa hình';
        default: return 'Tổng hợp / Ngẫu nhiên';
    }
}

// ==========================================
// 3. /thi-thu Command (Exam simulator B2)
// ==========================================
async function handleThiThuCommand(interaction) {
    const hangBang = 'b2';
    const userId = interaction.user.id;

    if (activeExams.has(userId)) {
        await interaction.reply({ 
            content: '❌ Bạn đang có một bài thi chưa hoàn thành! Hãy hoàn thành hoặc nộp bài trước khi bắt đầu bài mới.', 
            ephemeral: true 
        });
        return;
    }

    const examSize = 35;
    const examTimeMinutes = 22;

    const examQuestions = generateExamPaper(hangBang, examSize);

    const session = {
        userId,
        username: interaction.user.username,
        hangBang,
        questions: examQuestions,
        answers: Array(examQuestions.length).fill(null),
        currentQuestionIndex: 0,
        startTime: Date.now(),
        timeLimitMs: examTimeMinutes * 60 * 1000,
        interaction
    };

    activeExams.set(userId, session);

    await sendExamQuestion(interaction, session, true);

    session.timer = setTimeout(async () => {
        if (activeExams.has(userId)) {
            await submitExam(userId, true);
        }
    }, session.timeLimitMs);
}

// Balanced Exam Generator according to GTVT B2 structure
function generateExamPaper(hangBang, size) {
    const criticalPool = questions.filter(q => q.is_critical);

    const examQuestions = [];

    // 1. Target 4 critical questions
    const targetCriticalCount = 4;
    const shuffledCritical = shuffleArray([...criticalPool]);
    const selectedCritical = shuffledCritical.slice(0, Math.min(shuffledCritical.length, targetCriticalCount));
    const criticalIds = new Set(selectedCritical.map(q => q.id));
    examQuestions.push(...selectedCritical);
    examQuestions.push(...selectedCritical);

    // 2. Select balanced categories
    const categories = ['luat', 'bienbao', 'sahinh', 'kthuat', 'cautao', 'nghiepvu', 'daoduc'];
    const nonCriticalQuestions = questions.filter(q => !criticalIds.has(q.id));

    let needed = size - examQuestions.length;
    const shuffledNonCritical = shuffleArray([...nonCriticalQuestions]);

    for (const q of shuffledNonCritical) {
        if (examQuestions.length >= size) break;
        examQuestions.push(q);
    }

    return shuffleArray(examQuestions);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function sendExamQuestion(interaction, session, isInitial = false) {
    const idx = session.currentQuestionIndex;
    const question = session.questions[idx];
    const totalQuestions = session.questions.length;

    const timeRemainingMs = Math.max(0, session.timeLimitMs - (Date.now() - session.startTime));
    const mins = Math.floor(timeRemainingMs / 60000);
    const secs = Math.floor((timeRemainingMs % 60000) / 1000);
    const timeString = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const isCriticalText = question.is_critical ? ' ⚠️ [CÂU ĐIỂM LIỆT]' : '';
    const embed = new EmbedBuilder()
        .setTitle(`📝 Thi Thử Hạng ${session.hangBang.toUpperCase()}: Câu ${idx + 1} / ${totalQuestions}${isCriticalText}`)
        .setDescription(`**Đề bài:** ${question.question}`)
        .setColor(question.is_critical ? '#ffb703' : '#3a86c8')
        .addFields({ name: '⏳ Thời gian còn lại:', value: `\`${timeString}\``, inline: true })
        .setFooter({ text: 'Chú ý: Trả lời sai câu hỏi điểm liệt sẽ khiến bài thi bị tính TRƯỢT ngay lập tức!' });

    if (question.image) {
        embed.setImage(question.image);
    }

    let optionsText = '';
    question.options.forEach((opt, oIdx) => {
        const userSelected = session.answers[idx] === oIdx;
        optionsText += `${userSelected ? '🔹' : '⬜'} **${oIdx + 1}.** ${opt}\n`;
    });
    
    if (optionsText.length > 1024) {
        optionsText = optionsText.substring(0, 1020) + '...';
    }
    embed.addFields({ name: 'Các phương án trả lời:', value: optionsText });

    const rowOptions = new ActionRowBuilder();
    question.options.forEach((_, oIdx) => {
        const isSelected = session.answers[idx] === oIdx;
        rowOptions.addComponents(
            new ButtonBuilder()
                .setCustomId(`exam_opt_${idx}_${oIdx}`)
                .setLabel(`Đáp án ${oIdx + 1}`)
                .setStyle(isSelected ? ButtonStyle.Success : ButtonStyle.Secondary)
        );
    });

    const rowNav = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('exam_prev')
                .setLabel('⬅️ Trước')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(idx === 0),
            new ButtonBuilder()
                .setCustomId('exam_next')
                .setLabel('Sau ➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(idx === totalQuestions - 1),
            new ButtonBuilder()
                .setCustomId('exam_submit_prompt')
                .setLabel('✔️ Nộp bài')
                .setStyle(ButtonStyle.Danger)
        );

    const payload = { embeds: [embed], components: [rowOptions, rowNav] };

    if (isInitial) {
        session.message = await interaction.reply(payload);
    } else {
        await interaction.update(payload);
    }
}

// Grade and submit exam
async function submitExam(userId, isTimeout = false, interactionToUpdate = null) {
    const session = activeExams.get(userId);
    if (!session) return;

    clearTimeout(session.timer);
    activeExams.delete(userId);

    const totalQuestions = session.questions.length;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let criticalFail = false;
    const failedQuestionsDetails = [];

    session.questions.forEach((q, idx) => {
        const userAnswer = session.answers[idx];
        if (userAnswer === null) {
            unansweredCount++;
            failedQuestionsDetails.push({ question: q, userAns: 'Không trả lời' });
            if (q.is_critical) {
                criticalFail = true;
            }
        } else if (userAnswer === q.answer) {
            correctCount++;
        } else {
            incorrectCount++;
            failedQuestionsDetails.push({ question: q, userAns: q.options[userAnswer] });
            if (q.is_critical) {
                criticalFail = true;
            }
        }
    });

    let isPassed = false;
    let requiredCorrect = 32;
    
    if (totalQuestions < 35) {
        requiredCorrect = Math.ceil(totalQuestions * (32 / 35));
    }

    if (correctCount >= requiredCorrect && !criticalFail) {
        isPassed = true;
    }

    statsManager.updateExamStats(userId, session.username, isPassed);

    const embedResult = new EmbedBuilder()
        .setTitle(isPassed ? '🎉 KẾT QUẢ: THI ĐẠT (PASSED) 🎉' : '❌ KẾT QUẢ: THI TRƯỢT (FAILED) ❌')
        .setDescription(isTimeout ? '⏰ **Hết giờ làm bài! Hệ thống tự động nộp bài.**' : '✅ **Bạn đã nộp bài thi thành công.**')
        .setColor(isPassed ? '#2ec4b6' : '#e71d36')
        .addFields(
            { name: 'Hạng bằng lái:', value: session.hangBang.toUpperCase(), inline: true },
            { name: 'Số câu đúng:', value: `✅ **${correctCount}** / ${totalQuestions}`, inline: true },
            { name: 'Số câu sai:', value: `❌ **${incorrectCount}**`, inline: true },
            { name: 'Không trả lời:', value: `⬜ **${unansweredCount}**`, inline: true }
        );

    if (criticalFail) {
        embedResult.addFields({ 
            name: '⚠️ Lý do trượt điểm liệt:', 
            value: 'Bạn đã làm sai hoặc bỏ trống ít nhất một **câu hỏi điểm liệt** (tình huống mất an toàn giao thông nghiêm trọng). Dù số câu đúng có đủ chỉ tiêu, bài thi vẫn bị tính là THI TRƯỢT.' 
        });
    } else if (correctCount < requiredCorrect) {
        embedResult.addFields({ 
            name: 'ℹ️ Lý do trượt:', 
            value: `Số câu trả lời đúng của bạn (${correctCount}) chưa đạt mức yêu cầu tối thiểu là **${requiredCorrect}** câu.` 
        });
    } else {
        embedResult.addFields({ 
            name: '🌟 Đánh giá:', 
            value: 'Chúc mừng bạn! Kết quả rất xuất sắc. Hãy tiếp tục giữ vững phong độ này trong bài thi thực tế nhé!' 
        });
    }

    if (failedQuestionsDetails.length > 0) {
        let reviewText = '';
        failedQuestionsDetails.slice(0, 5).forEach((item) => {
            const isCriticalMarker = item.question.is_critical ? '⚠️ [ĐIỂM LIỆT] ' : '';
            const qSnippet = item.question.question.length > 75 ? item.question.question.substring(0, 75) + '...' : item.question.question;
            reviewText += `**Câu ${item.question.id}:** ${isCriticalMarker}${qSnippet}\n`;
            reviewText += `- Bạn chọn: *${item.userAns}*\n`;
            reviewText += `- Đáp án đúng: **${item.question.options[item.question.answer]}**\n\n`;
        });
        if (reviewText.length > 1024) {
            reviewText = reviewText.substring(0, 1020) + '...';
        }
        embedResult.addFields({ name: '🔍 Chi tiết một số câu bạn làm chưa đúng:', value: reviewText });
    }

    embedResult.setTimestamp();

    if (interactionToUpdate) {
        await interactionToUpdate.update({ embeds: [embedResult], components: [] });
    } else if (session.message) {
        await session.message.edit({ embeds: [embedResult], components: [] });
    }
}

// ==========================================
// 4. /thong-ke Command
// ==========================================
async function handleThongKeCommand(interaction) {
    const userId = interaction.user.id;
    const stats = statsManager.getUserStats(userId, interaction.user.username);

    const practiceAccuracy = stats.questionsAnswered > 0 
        ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) 
        : 0;

    const examPassRate = stats.examsAttempted > 0 
        ? Math.round((stats.examsPassed / stats.examsAttempted) * 100) 
        : 0;

    const embed = new EmbedBuilder()
        .setTitle(`📊 Bảng Thống Kê Học Tập: ${interaction.user.username}`)
        .setColor('#3a86c8')
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
            { 
                name: '📝 Chế Độ Ôn Tập', 
                value: `• Tổng số câu đã làm: **${stats.questionsAnswered}**\n• Số câu đúng: **${stats.correctAnswers}**\n• Tỉ lệ đúng: **${practiceAccuracy}%**`,
                inline: false 
            },
            { 
                name: '🏁 Chế Độ Thi Thử', 
                value: `• Số đề đã thi: **${stats.examsAttempted}**\n• Số đề thi ĐẠT: **${stats.examsPassed}**\n• Số đề thi TRƯỢT: **${stats.examsAttempted - stats.examsPassed}**\n• Tỉ lệ đỗ: **${examPassRate}%**`,
                inline: false 
            }
        )
        .setTimestamp()
        .setFooter({ text: 'Chăm chỉ luyện tập mỗi ngày để lấy bằng lái xe nhé! 💪' });

    await interaction.reply({ embeds: [embed] });
}

// ==========================================
// 5. Button Interactions Routing
// ==========================================
async function handleButtonInteraction(interaction) {
    const customId = interaction.customId;
    const userId = interaction.user.id;

    if (customId.startsWith('practice_')) {
        await handlePracticeButtonClick(interaction);
    }
    else if (customId.startsWith('exam_')) {
        const session = activeExams.get(userId);
        if (!session) {
            await interaction.reply({ content: '❌ Bài thi này đã kết thúc hoặc không tồn tại.', ephemeral: true });
            return;
        }

        if (customId.startsWith('exam_opt_')) {
            const parts = customId.split('_');
            const qIdx = parseInt(parts[2]);
            const oIdx = parseInt(parts[3]);
            session.answers[qIdx] = oIdx;
            await sendExamQuestion(interaction, session, false);
        } else if (customId === 'exam_prev') {
            if (session.currentQuestionIndex > 0) {
                session.currentQuestionIndex--;
                await sendExamQuestion(interaction, session, false);
            }
        } else if (customId === 'exam_next') {
            if (session.currentQuestionIndex < session.questions.length - 1) {
                session.currentQuestionIndex++;
                await sendExamQuestion(interaction, session, false);
            }
        } else if (customId === 'exam_submit_prompt') {
            const unanswered = session.answers.filter(a => a === null).length;
            const warningText = unanswered > 0 
                ? `⚠️ Bạn còn **${unanswered}** câu chưa trả lời. Bạn có chắc chắn muốn nộp bài thi không?` 
                : 'Bạn đã hoàn thành tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài thi không?';

            const embedPrompt = new EmbedBuilder()
                .setTitle('✔️ Xác Nhận Nộp Bài Thi')
                .setDescription(warningText)
                .setColor('#ffb703');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('exam_submit_confirm')
                        .setLabel('Nộp Bài')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('exam_submit_cancel')
                        .setLabel('Quay lại làm bài')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.update({ embeds: [embedPrompt], components: [row] });
        } else if (customId === 'exam_submit_confirm') {
            await submitExam(userId, false, interaction);
        } else if (customId === 'exam_submit_cancel') {
            await sendExamQuestion(interaction, session, false);
        }
    }
}

async function handlePracticeButtonClick(interaction) {
    const customId = interaction.customId;
    const userId = interaction.user.id;
    const username = interaction.user.username;

    if (customId.startsWith('practice_next_')) {
        const chuDe = customId.substring('practice_next_'.length);
        await sendPracticeQuestion(interaction, chuDe, false);
        return;
    }

    const parts = customId.split('_');
    const chuDe = parts[1];
    const questionId = parseInt(parts[2]);
    const optIndex = parseInt(parts[3]);

    const question = questions.find(q => q.id === questionId);
    if (!question) {
        await interaction.reply({ content: '❌ Không tìm thấy câu hỏi.', ephemeral: true });
        return;
    }

    const isCorrect = optIndex === question.answer;

    statsManager.updatePracticeStats(userId, username, isCorrect);

    const embed = new EmbedBuilder()
        .setTitle(isCorrect ? '✅ ĐÁP ÁN CHÍNH XÁC!' : '❌ RẤT TIẾC, CHƯA CHÍNH XÁC!')
        .setDescription(`**Câu hỏi:** ${question.question}`)
        .setColor(isCorrect ? '#2ec4b6' : '#e71d36')
        .addFields(
            { name: 'Câu trả lời của bạn:', value: `• ${question.options[optIndex]}` },
            { name: 'Đáp án đúng:', value: `• **${question.options[question.answer]}**` },
            { name: '💡 Giải thích lý thuyết:', value: question.explanation }
        )
        .setFooter({ text: `Học viên: ${username} | Chăm chỉ luyện tập để đạt kết quả tốt nhất!` });

    if (question.image) {
        embed.setImage(question.image);
    }

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`practice_next_${chuDe}`)
                .setLabel('Câu tiếp theo ➡️')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setLabel('📄 File PDF Gốc')
                .setStyle(ButtonStyle.Link)
                .setURL(PDF_SOURCE_URL)
        );

    await interaction.update({ embeds: [embed], components: [row] });
}

// Log unexpected errors
process.on('unhandledRejection', error => {
    console.error('Unhandled Rejection:', error);
});

// Login Bot
if (process.env.DISCORD_TOKEN) {
    client.login(process.env.DISCORD_TOKEN).catch(err => {
        console.error('❌ Lỗi kết nối Discord API:', err.message);
    });
} else {
    console.log('💡 Lưu ý: Cần cấu hình DISCORD_TOKEN trong file .env trước khi chạy bot.');
}
