var mysql      = require('mysql');
var async = require('async');
client = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'tangent90'
});

function initializeComprehensively(){
    async.series([
        function connect(callback) {
            client.connect(callback);
        },
        function clear(callback) {
            client.query('DROP SCHEMA IF EXISTS `simpledb`', callback);
        },
        function create_schema(callback) {
            client.query('CREATE SCHEMA IF NOT EXISTS `simpledb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci', callback);
        },
        function use_db(callback) {
            client.query('USE `simpledb`', callback);
        },
        function drop_table_users(callback) {
            client.query('DROP TABLE IF EXISTS `simpledb`.`users`', callback);
        },
        function create_users(callback) {
            client.query(
                    ' CREATE TABLE IF NOT EXISTS `simpledb`.`users` (' +
                    '   `userID` INT UNSIGNED NOT NULL,' +
                    '   `username` VARCHAR(45) NULL,' +
                    '   `password` VARCHAR(45) NULL,' +
                    '   `socketID` VARCHAR(45) NULL,' +
                    '   `last_login_date` DATETIME NULL,' +
                    '   PRIMARY KEY (`userID`))' +
                    ' ENGINE = InnoDB'
                , callback);
        },
        function drop_table_messages(callback) {
            client.query(' DROP TABLE IF EXISTS `simpledb`.`messages` ', callback);
        },
        function create_messages(callback) {
            client.query(
                    ' CREATE TABLE IF NOT EXISTS `simpledb`.`messages` (' +
                    '   `messagesID` INT NOT NULL AUTO_INCREMENT,' +
                    '   `from` INT UNSIGNED NOT NULL,' +
                    '   `to` INT UNSIGNED NOT NULL,' +
                    '   `content` VARCHAR(255) NULL,' +
                    '   `delivery_status` VARCHAR(45) NULL DEFAULT \'none\',' +
                    '   `date` DATETIME NULL,' +
                    '   PRIMARY KEY (`messagesID`, `to`, `from`),' +
                    '   INDEX `from_userID_idx` (`from` ASC),' +
                    '   INDEX `to_userID_idx` (`to` ASC),' +
                    '   CONSTRAINT `from_userID`' +
                    '     FOREIGN KEY (`from`)' +
                    '     REFERENCES `simpledb`.`users` (`userID`)' +
                    '     ON DELETE NO ACTION' +
                    '     ON UPDATE NO ACTION,' +
                    '   CONSTRAINT `to_userID`' +
                    '     FOREIGN KEY (`to`)' +
                    '     REFERENCES `simpledb`.`users` (`userID`)' +
                    '     ON DELETE NO ACTION' +
                    '     ON UPDATE NO ACTION)' +
                    ' ENGINE = InnoDB'
                , callback);
        },
        function insert_users(callback) {
            var userData = [
                [1, 'PersonA', 'secret'],
                [2, 'PersonB', 'secret']
            ];
            client.query('INSERT INTO `simpledb`.`users` (`userID`, `username`, `password`) VALUES ?', [userData], callback);
        },
        function insert_messages(callback) {
        }
    ], function (err, results) {
        if (err) {
            console.log('Exception initializing database.');
            throw err;
        } else {
            console.log('Database initialization complete.');
        }
    });
}
//initializeComprehensively();

module.exports.initializeComprehensively = initializeComprehensively;
module.exports.client = client;
