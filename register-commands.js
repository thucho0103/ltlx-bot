const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Xem hướng dẫn sử dụng bot và các mẹo thi lý thuyết GPLX B2.'),

    new SlashCommandBuilder()
        .setName('on-tap')
        .setDescription('Ôn tập bộ 600 câu hỏi lý thuyết lái xe ô tô hạng B2 theo chủ đề.')
        .addStringOption(option =>
            option.setName('chu-de')
                .setDescription('Chọn chủ đề bạn muốn ôn tập')
                .setRequired(true)
                .addChoices(
                    { name: 'Luật giao thông đường bộ (166 câu)', value: 'luat' },
                    { name: 'Nghiệp vụ vận tải (26 câu)', value: 'nghiepvu' },
                    { name: 'Văn hóa & Đạo đức người lái xe (21 câu)', value: 'daoduc' },
                    { name: 'Kỹ thuật lái xe ô tô (56 câu)', value: 'kthuat' },
                    { name: 'Cấu tạo & Sửa chữa ô tô (35 câu)', value: 'cautao' },
                    { name: 'Hệ thống biển báo đường bộ (182 câu)', value: 'bienbao' },
                    { name: 'Giải thế sa hình (114 câu)', value: 'sahinh' },
                    { name: 'Câu hỏi điểm liệt (60 câu - Quan trọng!)', value: 'diemliet' },
                    { name: 'Ngẫu nhiên tất cả (600 câu)', value: 'ngau-nhien' }
                )
        ),

    new SlashCommandBuilder()
        .setName('thi-thu')
        .setDescription('Bắt đầu bài thi thử lý thuyết sát hạch lái xe ô tô Hạng B2 (35 câu / 22 phút).'),

    new SlashCommandBuilder()
        .setName('thong-ke')
        .setDescription('Xem thống kê kết quả học tập và thi thử GPLX B2 của bạn.')
].map(command => command.toJSON());

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
    console.error('❌ Lỗi: Bạn cần cung cấp DISCORD_TOKEN và CLIENT_ID trong file .env');
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Đang đăng ký ${commands.length} lệnh slash commands...`);

        if (process.env.GUILD_ID) {
            console.log(`Đăng ký lệnh cho Server (Guild ID: ${process.env.GUILD_ID})...`);
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log('✅ Đăng ký lệnh cho Server thành công!');
        } else {
            console.log('Đăng ký lệnh toàn cầu (Global commands)...');
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log('✅ Đăng ký lệnh toàn cầu thành công! (Có thể mất đến 1 tiếng để cập nhật trên mọi máy chủ)');
        }
    } catch (error) {
        console.error('❌ Có lỗi xảy ra khi đăng ký lệnh:', error);
    }
})();
