export function getMskDate() {
    const utcDate = new Date(); // Получаем текущее UTC время
    const moscowOffset = 3 * 60 * 60 * 1000; // Московский часовой пояс UTC+3 в миллисекундах
    const mskDate = new Date(utcDate.getTime() + moscowOffset);
    return mskDate;
}
