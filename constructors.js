function Query(action) {
    this.action = action;
    this.query = function () {
        Connection.query('SELECT * FROM ?', action, (err, results) => {
            console.table(results);
        })
    }
}



module.exports = Query;