/**
 * 未使用axios进行api封装
 * 
 */


import request from '@/utils/request'

export function login(data){
	return request({
		url: '/login',
		method: 'post',
		data ,
	})
}