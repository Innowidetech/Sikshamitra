const moment = require('moment-timezone');

function formatTimeToIST(data) {
    const formatDateFields = (doc) => {
        if (!doc || typeof doc !== 'object') return doc;

        return {
            ...doc,
            createdAt: doc.createdAt ? moment(doc.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss') : null,
            updatedAt: doc.updatedAt ? moment(doc.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss') : null,
        };
    };

    if (Array.isArray(data)) {
        return data.map(formatDateFields);
    } else {
        return formatDateFields(data);
    }
}

module.exports = formatTimeToIST;
