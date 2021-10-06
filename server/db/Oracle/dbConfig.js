const config = {
    // user         : process.env.NODEORACLEDB_USER || 'YK_IMS',
    // password     : process.env.NODEORACLEDB_PASSWORD || 'wjdqhykims',
    // connectString: process.env.NODEORACLEDB_CONNECTIONSTRING || '10.10.10.12:1527/YKDEV'
    user         : process.env.NODEORACLEDB_USER || 'YK_IMS',
    password     : process.env.NODEORACLEDB_PASSWORD || 'wjdqhykims',
    connectString: process.env.NODEORACLEDB_CONNECTIONSTRING || '10.10.10.11:1521/PROD'
}

module.exports = config;  