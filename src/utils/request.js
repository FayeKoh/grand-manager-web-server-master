/**
 * 未使用axios进行api封装
 * 
 */


import axios from 'axios'
//import CancelStore from '@/axios/store';
// import { getHeader } from '@/axios/header'
// import { Message, MessageBox } from 'element-ui'
let baseURL = process.env.baseURL;
// if (process.env.NODE_ENV === "development") {
// baseURL = process.env.baseURL;
// } else {
//const CancelToken = axios.CancelToken;
// 创建axios实例
const service = axios.create({
	baseURL: baseURL, // api 的 base_url
	timeout: 50000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
	config => {
		// 这个是 取消重点
		//config.cancelToken = new CancelToken((cancel) => {
		// CancelStore._axiosPromiseCancel.push(cancel);
		//});
		let url = config.url.replace(config.baseURL, '');
		// let code = config.code;
		// config.headers = getHeader(url, code) // 让每个请求携带自定义签名
		// config.headers = getHeader(url)
		return config
	},
	error => {
		console.log(error) // for debug 11
		Promise.reject(error)
	}
)
export default service