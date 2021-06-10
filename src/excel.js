export const fillRange = (_range, data) => {
    window.Excel.run(function (context) {
        const sheet = context.workbook.worksheets.getItem('Crypto');

        const range = sheet.getRange(_range);
        range.values = data

        range.format.autofitColumns()
        range.format.autofitRows()
        range.format.horizontalAlignment = 'center'
        changeRangeFontsize(_range, 13)

        return context.sync().catch((err) => console.log(err))
    });
}

export const arrToCol = (arr) => arr.map(i => [i])

export const clearRange = () => {
    window.Excel.run(function (context) {
        const sheet = context.workbook.worksheets.getItem('Crypto');


        const range = sheet.getRange('A1:Z100');
        range.delete();

        return context.sync().then(() => console.log('清空成功')).catch((err) => console.log(err))
    });
}

export const paintRange = (_range, background, font = 'black') => {
    window.Excel.run(function (context) {
        const sheet = context.workbook.worksheets.getItem('Crypto');

        const range = sheet.getRange(_range);
        range.format.fill.color = background;
        range.format.font.color = font;

        return context.sync().catch((err) => console.log(err))
    });
}

export const boldRange = (_range) => {
    window.Excel.run(function (context) {
        const sheet = context.workbook.worksheets.getItem('Crypto');

        const range = sheet.getRange(_range);
        range.format.font.bold = true

        return context.sync().catch((err) => console.log(err))
    });
}

export const changeRangeFontsize = (_range, fontsize) => {
    window.Excel.run(function (context) {
        const sheet = context.workbook.worksheets.getItem('Crypto');

        const range = sheet.getRange(_range);
        range.format.font.size = +fontsize

        return context.sync().catch((err) => console.log(err))
    });
}