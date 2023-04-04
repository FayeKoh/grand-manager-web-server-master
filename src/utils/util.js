//处理返回年月日时分秒 eg. 2021-01-12 13:04:12
export function getYMDHMS (timestamp) {
	let time = new Date(timestamp)
	let year = time.getFullYear()
	let month = time.getMonth() + 1
	let date = time.getDate()
	let hours = time.getHours()
	let minute = time.getMinutes()
	let second = time.getSeconds()

	if (month < 10) { month = '0' + month }
	if (date < 10) { date = '0' + date }
	if (hours < 10) { hours = '0' + hours }
	if (minute < 10) { minute = '0' + minute }
	if (second < 10) { second = '0' + second }
	return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
}

export function getYMD (timestamp) {
	let time = new Date(timestamp)
	let year = time.getFullYear()
	let month = time.getMonth() + 1
	let date = time.getDate()

	if (month < 10) { month = '0' + month }
	if (date < 10) { date = '0' + date }
	return year + '-' + month + '-' + date
}

//返回年月日，天数会多增加一天，便于数据库处理查询得到正确查询结果
export function getYMDplus (timestamp) {
	let time = new Date(timestamp)
	let year = time.getFullYear()
	let month = time.getMonth() + 1
	let date = time.getDate() + 1

	if (month < 10) { month = '0' + month }
	if (date < 10) { date = '0' + date }
	return year + '-' + month + '-' + date
}