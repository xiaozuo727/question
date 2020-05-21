document.write('<script src="js/axios.js"></script>');
/*全局参数定义*/
// var hostUrl = 'http://newapp.q6w66.com/';
var hostUrl = "http://server.webziti.com/";
var user_id = localStorage.user_id;
var userpwd = localStorage.userpwd;
var token = localStorage.token;


$(function () {
    // document.getElementsByTagName('html')[0].style.fontSize = document.body.clientWidth / 7.5 + 'px';
    document.getElementsByTagName('html')[0].style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
    window.addEventListener('resize' , function () {
        document.getElementsByTagName('html')[0].style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';

    });

    // 判断login
    var L = getUrlname(window.location.href);
    if(!(localStorage.user_id && localStorage.userpwd)){
        if(!(L == 'login.html'|| L == 'register.html')){
            // window.location.href = 'login.html';
        }
    }

});
function getUrlname(url){
    url=url.split('?')[0];
    var urlSlashCount=url.split('/').length;
    return url.split('/')[urlSlashCount-1].toLowerCase();
}

Vue.prototype.Global = {
    avatar : './img/logo.jpg',
    nickname : '环球国际',
};
// Vue组件
let loading = '<div class="loading" v-if="loading"></div>';
let toast = '<div class="toast" v-if="toast">{{msg}}</div>';
let dialog = '<div class="mask" v-if="dialog"><div class="mask-box dialog"><p>温馨提示</p><div class="pad-l-5 pad-b-5 pad-r-3 pad-t-2 left" v-html="msg"></div><div class="pad-t-3 flex space-ard"><span class="pad-2-5 border-radius-1 bg-gray" @click="cancel">取消</span><span class="pad-2-5 border-radius-1 bg-blue color-white" @click="confirm">确定</span></div></div></div>';
let maskbot = '<div class="mask-bot" v-if="maskbot"><p>{{title}}</p><ul><li v-for="(item,i) in masklist" @click="selitem">{{item.msg}}</li></ul></div>';

Vue.component('loading',{
    template: loading,
    props: {'loading': Boolean}
});
Vue.component('toast',{
    template: toast,
    props: {'toast': Boolean, 'msg': String}
});
Vue.component('popup',{
    template: dialog,
    props: {'dialog': Boolean, 'msg': String},
    methods: {
        confirm() {
            this.$emit('confirm')
        },
        cancel() {
            this.$emit('cancel')
        }
    }
});

let header = `<header>
                <a :href="header.url" class="f1">
                    <i class="iconfont" v-html="header.svg_l"></i>
                </a>
                <div class="f8 center" v-text="header.tit"></div>
                <div class="f1 re right">
                    <a :href="header.url_r">
                        <i class="iconfont font5" v-html="header.svg_r"></i>
                        <span v-if="header.num" class="infocounts ab r-t-0" v-text="header.num"></span>
                    </a>  
                    <p v-if="header.btn" class="font2 bg-blue border-radius-1 color-black center line-h-1">完成</p>
                </div>
            </header>`;
Vue.component('top', {
    template: header,
    props: {
        header: Object,
    }
});
let footer = `<footer>
                <a :href="item.router" v-for="(item,i) in footer" :class="{active: i==type}">
                    <i class="iconfont font5" v-html="item.svg"></i>
                    <p v-text="item.name"></p>
                </a>
            </footer>`;
Vue.component('foot',{
    template: footer,
    data() {
        return {
            footer:[{
                name: '视讯',
                svg: '&#xe61e',
                router: 'video.html'
            },
                // {
                //     name: '足球',
                //     svg: '&#xe600',
                //     router: 'football.html'
                // },
                {
                    name: '游戏',
                    svg: '&#xe602',
                    router: 'game.html'
                },{
                    name: '充值',
                    svg: '&#xe64a',
                    router: 'pay.html'
                },{
                    name: '我的',
                    svg: '&#xe60e',
                    router: 'my.html'
                },],
        }
    },
    props: {
        type: Number,
    }
});
function getFootType(url) {
    let type = url.split('/')[url.split('/').length-1];
    type == 'video.html'? type = 0: type == 'game.html'? type = 1: type == 'pay.html'? type = 2: type == 'my.html'? type = 3: type = '';
    return type;
}

// Vue toast
function toastMsg(that,msg) {
    that.toast = true;
    that.msg = msg;
    setTimeout(function () {
        that.toast = false;
    },2000);
}

//Vue axios
function AxiosRequest() {
    // axios 请求拦截
    axios.interceptors.request.use(config => {
        // 为请求头，添加Token 的验证  Authorization 字段
        config.headers.userid = localStorage.user_id;
        config.headers.token = localStorage.token;
        return config
    },err=>{
        // 请求失败的处理
        return Promise.reject(err);
    });
    axios.interceptors.response.use(response => {
        console.log(response.data);
        // 在接收响应做些什么，例如跳转到登录页
        if(response.data.status == 2)
        {
            var L = getUrlname(window.location.href);
            if(!(L == 'login.html' || L == 'register.html'))
            {
                localStorage.user_id = '';
                localStorage.token = '';
                location.href = 'login.html';
            }
        }
        return response;
    },error =>{
        // 对响应错误做点什么
        return Promise.reject(error);
    });
}