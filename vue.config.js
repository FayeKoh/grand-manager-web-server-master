module.exports = {
	// 基本路径
	publicPath: '/',
	configureWebpack(){
        return{
            externals: [ {
                 './cptable': 'var cptable'
            }]
        }
    }
   }
