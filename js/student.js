/**
 * Created by wz on 17-2-23.
 */
function login() {
    var focus = function () {
        pwd = document.getElementById('password');
        pwd.focus();
    };
    var click = function () {
        document.getElementById('btn1').click();
    };
    setTimeout(focus, 1000);
    setTimeout(click, 1200);
}

function changeImg(callback) {
    document.getElementById("imgRandom").src = "http://jiaowu.swjtu.edu.cn/servlet/GetRandomNumberToJPEG?test=" + new Date().getTime();
    setTimeout(callback, 1500);
}


function studentmain() {
    var callimage2string = function () {
        img2string(4, "student.json", function (ret) {
            if (ret)
                document.getElementById('ranstring').value = ret;
            else
                document.getElementById('ranstring').value = '分割失败，请刷新网页';
            chrome.storage.sync.get({'autoclick': false}, function (result) {
                if (result.autoclick) {
                    login();
                }
            });
        })
    };
    chrome.storage.local.get({'retry': false}, function (result) {
        if (result.retry) {
            chrome.storage.local.remove('retry');
            changeImg(callimage2string);
        }
        else
            callimage2string();
    });
}

function studentclicked() {
    var body = document.body;
    var next = function (result) {
        if (body.innerHTML.indexOf('随机验证码输入错误') != -1) {
            body.innerHTML = body.innerHTML + "<br><h1>-1s</h1><script id='effect'></script>";
            chrome.storage.sync.get({'autoback': true}, function (result) {
                if (result.autoback) {
                    window.history.go(-1);
                    chrome.storage.local.set({"retry": true}, function (result) {
                    });
                }
            });
            chrome.storage.sync.get({"effect": false}, function (result) {
                if (result.effect) {
                    var i = (Math.random() * 10).toFixed() % 7;
                    if(i==6){
                        setAdvertise();
                        return;
                    }
                    var name = "/images/" + i + ".png";
                    name = chrome.runtime.getURL(name);
                    name = 'url("' + name + '")';
                    document.body.style.backgroundImage = name;
                    document.body.style.backgroundRepeat = "no-repeat";
                    document.body.style.backgroundPosition = "center";
                    document.body.style.backgroundSize = "cover";
                }
            });
            chrome.storage.sync.get({"minus": 1}, function (result) {
                chrome.storage.sync.set({"minus": result.minus + 1}, function () {
                });
            });
        }
        else if (body.innerHTML.indexOf('登录成功') != -1) {
            var remod = /欢迎您，(.*?)同学/;
            remod.exec(body.innerHTML);
            var name = RegExp.$1;
            body.innerHTML = body.innerHTML.replace(/欢迎您，(.*?)同学，正在连接系统，请稍候\.\.\.\.\./,
                '欢迎您，膜法师' + name + "。您的膜法已使长者的生命<font color='#FF0000'>+" + result.plus + "s，-" +
                result.minus + 's</font>  请再接再厉 ><<br><h1>+1s</h1><script id="effect"></script>');
            chrome.storage.sync.get({'effect': false}, function (result) {
                if (result.effect)
                    PhotoMove();
            });
            chrome.storage.sync.set({'plus': result.plus + 1}, function () {
            })
        }
    };
    chrome.storage.sync.get({'plus': 1, "minus": 0}, function (result) {
        next(result);
    });
}
