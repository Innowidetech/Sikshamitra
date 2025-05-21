const moment = require('moment-timezone');

function formatTimeToIST(data) {
    const formatDateFields = (doc) => {
        if (!doc || typeof doc !== 'object') return doc;

        return {
            ...doc,
            ...(doc.createdAt && { createdAt: moment(doc.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss') }),
            ...(doc.updatedAt && { updatedAt: moment(doc.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss') }),
            ...(doc.date && { date: moment(doc.date).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss') }),
        };
    };

    if (Array.isArray(data)) {
        return data.map(formatDateFields);
    } else {
        return formatDateFields(data);
    }
}

module.exports = formatTimeToIST;
