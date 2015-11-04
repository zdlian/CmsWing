/**
 * Created by arter on 2015/10/29.
 */
'use strict';

export default class extends think.controller.base {

    /**
     * public action
     * @return {Promise} []
     */
    async signinAction(){
        //用户登录
        let is_login = await this.islogin();
        if(this.isPost()){
            let username = this.post('username');
            let password = this.post('password');
            password = encryptPassword(password);
            let res = await this.model("member").signin("admin",password,this.ip());
            if(0<res.uid){
                await this.session('userInfo', res);
                //TODO 用户密钥
                this.redirect('/admin/index');
            }else { //登录失败
                let fail;
                switch(res) {
                    case -1: fail = '用户不存在或被禁用'; break; //系统级别禁用
                    case -2: fail = '密码错误'; break;
                    default: fail = '未知错误'; break; // 0-接口参数错误（调试阶段使用）
                }
                this.fail(res, fail);
            }

        }else{
            if(is_login){
                this.redirect('/admin/index');
            }else{
                return this.display();
            }
        }
    }

    async logoutAction(){
        //退出登录
        let is_login = await this.islogin();
        if(is_login){
            await this.session();
            this.redirect('/admin/public/signin');
        }else{
            this.redirect('/admin/public/signin');
        }
    }

    async islogin(){
        let user = await this.session('userInfo');
        let res = think.isEmpty(user) ? false : true;
        return res;
    }
    verAction(){
       this.end("df11df")
    }

}