/**
 * Created by wz on 17-2-24.
 */
href = window.location.href;

var student = "jiaowu.swjtu.edu.cn/service/login.jsp";
var studentclick = "jiaowu.swjtu.edu.cn/servlet/UserLoginSQLAction";

var genearch="dean.swjtu.edu.cn/service/login.jsp";
var genearchclick="dean.swjtu.edu.cn/servlet/UserGenearchLoginAction";

var network="service.swjtu.edu.cn:8080/selfservice/module/scgroup/web/login_self.jsf";

function main() {
    if (href.replace("//service", "/service").indexOf(student) != -1) {
        studentmain();
        return;
    }
    if (href.replace("//servlet", "/servlet").indexOf(studentclick) != -1) {
        studentclicked();
        return;
    }
    if(href.indexOf(genearch)!=-1){
        genearchmain();
        return;
    }
    /*if(href.indexOf(genearchclick)!=-1){
        genearchclicked();
        return;
    }*/
    if(href.indexOf(network)!=-1){
        networkmain();
        return;
    }

}

main();
